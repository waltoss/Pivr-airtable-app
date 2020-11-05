import {
  initializeBlock,
  Box,
  Text,
  useWatchable,
  useLoadable,
  useRecordById,
  useRecords,
  useGlobalConfig,
  useSettingsButton,
} from "@airtable/blocks/ui";
import { cursor, base } from "@airtable/blocks";
import Record from "@airtable/blocks/dist/types/src/models/record";

import { Set, Map } from "immutable";

import React, { useState } from "react";
import moment from "moment";
import "moment/locale/fr";
import AppointmentSlotSelector from "./components/AppointmentSlotSelector";
import { SettingsView } from "./components/SettingsView";
import { useSettings } from "./hooks/settings";

const START_OF_DAY = moment.duration({ h: 8 });
const END_OF_DAY = moment.duration({ h: 20 });
const SLOT_DURATION = moment.duration({ h: 1 });

// Fix immutable Map with Moment
// https://github.com/immutable-js/immutable-js/issues/1643
moment.prototype.hashCode = function () {
  return Number(this);
};

function PivrApp() {
  // display the settings button
  const [isShowingSettings, setIsShowingSettings] = useState(false);
  useSettingsButton(function () {
    setIsShowingSettings(!isShowingSettings);
  });

  // loads settings
  const [settings, _] = useSettings();

  // make sure the cursor is loaded
  useLoadable(cursor);

  // update the component whenever the cursor select a new table, view or record
  useWatchable(cursor, ["activeTableId", "activeViewId", "selectedRecordIds"]);

  const selectedRecordId = cursor.selectedRecordIds[0];

  // get current selected demand record
  const selectedDemand = useRecordById(
    selectedRecordId ? settings.demands.table : null, // pass null in order to prevent an API call
    selectedRecordId
  );

  const slotsRecords = useRecords(
    selectedDemand?.selectLinkedRecordsFromCell(settings.demands.slotField)
  );

  const demandCreationDate = moment(
    selectedDemand?.getCellValue(settings.demands.createdAtField)
  );

  // build a map to track the appointment slot with the matching record
  const slotDateToRecordMap = slotsRecords
    ? Map(
        slotsRecords.map((record) => [
          moment(record.getCellValue(settings.slots.startDateField)),
          record,
        ])
      )
    : Map<moment.Moment, Record>();

  const selectedSlots = Set(slotDateToRecordMap.keys());

  async function toggleSlot(slot: moment.Moment, toggled: boolean) {
    if (toggled) {
      await settings.slots.table.createRecordAsync({
        [settings.slots.demandField.id]: [{ id: selectedDemand.id }],
        [settings.slots.startDateField.id]: slot.toISOString(),
        [settings.slots.endDateField.id]: slot
          .clone()
          .add(SLOT_DURATION)
          .toISOString(),
      });
    } else {
      settings.slots.table.deleteRecordAsync(slotDateToRecordMap.get(slot));
    }
  }

  function isDemandSelected() {
    return !!selectedDemand;
  }

  if (isShowingSettings) {
    return <SettingsView></SettingsView>;
  }

  if (!settings.valid) {
    return (
      <Text>Configurez l'App en appuyant sur la roue en haut à droite</Text>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      backgroundColor="white"
      padding={0}
      overflow="hidden"
    >
      {isDemandSelected() && (
        <Box>
          <AppointmentSlotSelector
            startOfDay={START_OF_DAY}
            endOfDay={END_OF_DAY}
            slotDuration={SLOT_DURATION}
            fromDay={demandCreationDate}
            selectedSlots={selectedSlots}
            onSlotToggled={toggleSlot}
          ></AppointmentSlotSelector>
        </Box>
      )}
      {!isDemandSelected() && (
        <Box display="flex" alignContent="center" justifyContent="center">
          <Text size="large">Selectionnez une intervention</Text>
        </Box>
      )}
    </Box>
  );
}

moment.locale("fr");

initializeBlock(() => <PivrApp />);

import React, { useState } from "react";
import { Box, Text, Button } from "@airtable/blocks/ui";
import moment from "moment";
import { Set } from "immutable";

const DEFAULT_DISPLAYED_DAYS = 7;

interface AppointmentSlotSelectorProps {
  fromDay: moment.Moment;
  startOfDay: moment.Duration;
  endOfDay: moment.Duration;
  slotDuration: moment.Duration;
  selectedSlots: Set<moment.Moment>;
  onSlotToggled: (slot: moment.Moment, selected: boolean) => void;
}

export default function AppointmentSlotSelector({
  fromDay,
  selectedSlots,
  startOfDay,
  endOfDay,
  slotDuration,
  onSlotToggled,
}: AppointmentSlotSelectorProps) {
  const [displayedDays, setDisplayedDays] = useState(DEFAULT_DISPLAYED_DAYS);
  const days = [...Array(displayedDays).keys()].map((i) =>
    fromDay.clone().startOf("day").add(i, "day")
  );

  function getSlotsByDay(day: moment.Moment) {
    return selectedSlots.filter((slot) => slot.isSame(day, "day"));
  }

  function addMoreDays() {
    setDisplayedDays(displayedDays + 7);
  }

  return (
    <Box>
      {days.map((day, i) => (
        <DaySlotSelector
          key={i}
          day={day}
          slotDuration={slotDuration}
          startOfDay={startOfDay}
          endOfDay={endOfDay}
          selectedSlots={getSlotsByDay(day)}
          onSlotToggled={onSlotToggled}
        ></DaySlotSelector>
      ))}
      <Button onClick={() => addMoreDays()}>More ...</Button>
    </Box>
  );
}

interface DaySlotSelectorProps {
  day: moment.Moment;
  startOfDay: moment.Duration;
  endOfDay: moment.Duration;
  slotDuration: moment.Duration;
  selectedSlots: Set<moment.Moment>;
  onSlotToggled: (slot: moment.Moment, selected: boolean) => void;
}

function DaySlotSelector({
  day,
  selectedSlots,
  startOfDay,
  endOfDay,
  slotDuration,
  onSlotToggled,
}: DaySlotSelectorProps) {
  const numberOfSlots = Math.floor(
    endOfDay.clone().subtract(startOfDay).asMilliseconds() /
      slotDuration.asMilliseconds()
  );

  const availablesSlots = [...Array(numberOfSlots).keys()].map((i) =>
    day
      .clone()
      .add(startOfDay)
      .add(slotDuration.asMilliseconds() * i, "milliseconds")
  );

  function isSlotSelected(slot: moment.Moment) {
    return selectedSlots.has(slot);
  }

  function toggleSlot(slot: moment.Moment) {
    onSlotToggled(slot, !isSlotSelected(slot));
  }

  return (
    <Box padding={1} flex={1}>
      <Text style={{ textTransform: "capitalize" }}>
        {day.format("dddd ll")}
      </Text>
      {availablesSlots.map((slot, i) => (
        <Button
          style={SlotButtonStyle}
          key={i}
          variant={isSlotSelected(slot) ? "primary" : "default"}
          onClick={() => toggleSlot(slot)}
        >
          {slot.format("LT")}
        </Button>
      ))}
    </Box>
  );
}

const SlotButtonStyle: React.CSSProperties = {
  margin: 1,
};

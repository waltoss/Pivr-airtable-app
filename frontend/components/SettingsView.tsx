import React, { useState } from "react";
import {
  Text,
  Box,
  TablePicker,
  useGlobalConfig,
  FieldPicker,
} from "@airtable/blocks/ui";
import { base } from "@airtable/blocks";
import { useSettings } from "../hooks/settings";

export function SettingsView() {
  const [settings, setSettings] = useSettings();

  return (
    <Box display="flex" flexDirection="row" justifyItems="strech">
      <Box padding={2}>
        <Text>Table Interventions</Text>
        <TablePicker
          table={settings.demands.table}
          onChange={(newTable) =>
            setSettings({
              ...settings,
              demands: { ...settings.demands, table: newTable },
            })
          }
        />
        {settings.demands.table && (
          <Box padding={2}>
            <Text>Champ Disponibilités</Text>
            <FieldPicker
              table={settings.demands.table}
              field={settings.demands.slotField}
              onChange={(newField) =>
                setSettings({
                  ...settings,
                  demands: { ...settings.demands, slotField: newField },
                })
              }
            ></FieldPicker>
            <Text>Champ Créé à</Text>
            <FieldPicker
              table={settings.demands.table}
              field={settings.demands.createdAtField}
              onChange={(newField) =>
                setSettings({
                  ...settings,
                  demands: { ...settings.demands, createdAtField: newField },
                })
              }
            ></FieldPicker>
          </Box>
        )}
      </Box>
      <Box padding={2}>
        <Text>Table Disponibilités</Text>
        <TablePicker
          table={settings.slots.table}
          onChange={(newTable) =>
            setSettings({
              ...settings,
              slots: { ...settings.slots, table: newTable },
            })
          }
        />
        {settings.slots.table && (
          <Box padding={2}>
            <Text>Champ Intervention</Text>
            <FieldPicker
              table={settings.slots.table}
              field={settings.slots.demandField}
              onChange={(newField) =>
                setSettings({
                  ...settings,
                  slots: { ...settings.slots, demandField: newField },
                })
              }
            ></FieldPicker>
            <Text>Champ Date de début</Text>
            <FieldPicker
              table={settings.slots.table}
              field={settings.slots.startDateField}
              onChange={(newField) =>
                setSettings({
                  ...settings,
                  slots: { ...settings.slots, startDateField: newField },
                })
              }
            ></FieldPicker>
            <Text>Champ Date de fin</Text>
            <FieldPicker
              table={settings.slots.table}
              field={settings.slots.endDateField}
              onChange={(newField) =>
                setSettings({
                  ...settings,
                  slots: { ...settings.slots, endDateField: newField },
                })
              }
            ></FieldPicker>
          </Box>
        )}
      </Box>
    </Box>
  );
}

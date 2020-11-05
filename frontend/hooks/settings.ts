import { base } from "@airtable/blocks";
import Field from "@airtable/blocks/dist/types/src/models/field";
import Table from "@airtable/blocks/dist/types/src/models/table";
import { useGlobalConfig } from "@airtable/blocks/ui";
import { useState } from "react";

export interface Settings {
    demands: {
        table: Table,
        slotField: Field,
        createdAtField: Field,
    }
    slots: {
        table: Table,
        demandField: Field,
        startDateField: Field,
        endDateField: Field,
    }
    valid: boolean
}

export function useSettings(): [Settings, (newSettings: Settings) => void] {
    const globalConfig = useGlobalConfig();

    function get(key: string) {
        return globalConfig.get(key) as string;
    }

    const demandTableId = get("demands");
    const demandsTable = base.getTableByIdIfExists(demandTableId);
    const demandSlotFieldId = get("demands.slotField");
    const demandSlotField = demandsTable?.getFieldByIdIfExists(demandSlotFieldId)
    const demandCreatedAtFieldId = get("demands.createdAtField");
    const demandCreatedAtField = demandsTable?.getFieldByIdIfExists(demandCreatedAtFieldId)


    const slotTableId = get("slots");
    const slotsTable = base.getTableByIdIfExists(slotTableId);
    const slotDemandFieldId = get("slots.demandField");
    const slotDemandField = slotsTable?.getFieldByIdIfExists(slotDemandFieldId)
    const slotStartDateFieldId = get("slots.startDateField");
    const slotStartDateField = slotsTable?.getFieldByIdIfExists(slotStartDateFieldId)
    const slotEndDateFieldId = get("slots.endDateField");
    const slotEndDateField = slotsTable?.getFieldByIdIfExists(slotEndDateFieldId)

    const settings: Settings = {
        demands: {
            table: demandsTable,
            slotField: demandSlotField,
            createdAtField: demandCreatedAtField
        },
        slots: {
            table: slotsTable,
            demandField: slotDemandField,
            startDateField: slotStartDateField,
            endDateField: slotEndDateField,
        },
        valid: !!(demandsTable && demandSlotField && demandCreatedAtField && slotsTable && slotDemandField && slotStartDateField && slotEndDateField),
    }

    async function setSettings(newSettings: Settings) {
        await globalConfig.setPathsAsync([
            { path: ["demands"], value: newSettings?.demands?.table?.id },
            { path: ["demands.slotField"], value: newSettings?.demands?.slotField?.id },
            { path: ["demands.createdAtField"], value: newSettings?.demands?.createdAtField?.id },
            { path: ["slots"], value: newSettings?.slots?.table?.id },
            { path: ["slots.demandField"], value: newSettings?.slots?.demandField?.id },
            { path: ["slots.startDateField"], value: newSettings?.slots?.startDateField?.id },
            { path: ["slots.endDateField"], value: newSettings?.slots?.endDateField?.id }
        ])
    }

    return [settings, setSettings]
}
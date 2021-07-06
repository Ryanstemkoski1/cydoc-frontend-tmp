export interface PhysicalExamSchema {
    sections: PhysicalExamSchemaItem[];
}

export interface PhysicalExamSchemaItem {
    name: string;
    rows: PhysicalExamSchemaRow[];
}

export interface PhysicalExamSchemaRow {
    normalOrAbnormal: 'normal' | 'abnormal';
    needsRightLeft: boolean;
    display: 'buttons' | 'dropdown' | 'widget' | 'autocompletedropdown';
    widget?: WidgetType;
    includeSelectAll: boolean;
    findings: string[];
}

export enum WidgetType {
    Lungs = 'LUNG_WIDGET',
    Abdomen = 'ABDOMEN_WIDGET',
    Pulses = 'PULSES_WIDGET',
    Reflexes = 'REFLEXES_WIDGET',
    Murmurs = 'MURMURS_WIDGET',
    Skin = 'SKIN_WIDGET',
}

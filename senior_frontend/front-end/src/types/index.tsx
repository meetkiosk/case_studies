export interface Indicator {
    date: string;
    dimension: string;
    indicator: string;
    value: number;
}

export interface Dimension {
    id: string;
    country: string;
    business_unit: string;
}
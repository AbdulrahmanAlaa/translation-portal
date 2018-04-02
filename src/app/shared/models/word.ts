export interface Word {
    id: number;
    alternatives: Array<string>;
    specialStatus: boolean;
    gapStatus: boolean;
    offset: number;
    value: string;
}

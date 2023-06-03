export interface ILed {
    id: number;
    forme: string;
    position: [number, number];
    rotation: number;
    pin: number[];
}

export interface IAnimation {
    frequence: number;
    steps: IStep[];
}

export interface IStep {
    ids: number[];
    leds?: Array<{ number: number; color: string; intensity: number }>;
    colors?: string;
    intensities?: number;
    timecode: number;
}

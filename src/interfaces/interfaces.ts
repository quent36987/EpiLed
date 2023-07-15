export interface IDevice {
	id: string;
	size: number;
	connected: {
		id: string;
		pin: number;
	}[];
}

export interface IAnimation {
	id: number;
	modules: IModule[];
	function: (leds: ILed[], props: any, devices?: IDevice[]) => IStepAnimation;
	title: string;
	description?: string;
}

export interface ILed {
	id: string;
	shape: string;
	position: [number, number];
	rotation: number;
	pin: number[];
}

export interface IStepAnimation {
	frequency: number;
	steps: IStep[];
}

export interface IStep {
	ids: string[];
	leds?: Array<{ number: number; color: string; intensity: number }>;
	colors?: string;
	intensities?: number;
	timecode: number;
}

export interface IModule {
	name: string;
	title: string;
	range?: {
		min: number;
		max: number;
		value: number;
	};
	color?: {
		value: string;
	};
}

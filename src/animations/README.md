## How to Create a New Animation?

### Step 1

Create a new file in the `src/animations/` directory, naming it after your animation.

### Step 2

Define the animation function within the file you've just created.

Your primary function should accept the following parameters:

- `ILed[]`: This is the list of LEDs you will animate.
- `IProps`: These are the properties you will use for your animation (more information about the props below).
- `IDevice[]`: This is optional, but if you want to have access to the device, you can pass it as a parameter. It allows you to understand the LED graph more easily.

You can add properties to your animation:

- Color module: string
- Number range: number

To do this, you should create an `Props` interface with the properties you want to include. Example:

```ts
interface Props {
    color: string;
    speed: number;
    toggle: boolean;
    ...
}
```

And then create equivalent modules:

```ts
export const Modules: IModule[] = [
	{
		title: 'title',
		name: 'name of the props in the interface',
		range: {
			min: 1,
			max: 200,
			value: 100 // default value
		}
	},
	{
		title: 'title',
		name: 'name of the props in the interface',
		color: {
			value: '#ff0000' // default value
		}
	},
    {
        title: 'title',
        name: 'name of the props in the interface',
        toggle: {
            value: false // default value
        }
    }
];
```

The function should return an `IStepAnimation` object:

```ts
export interface IStepAnimation {
	frequency: number;
	steps: IStep[];
}

export interface IStep {
	ids: string[]; //ids of the leds
	leds?: Array<{ number: number; color: string; intensity: number }>; // not used yet
	colors?: string; // color
	intensities?: number; // not used yet
	timecode: number; // timecode (frequency * 10)
}
```

### Step 3

Add your animation to the list of others in the `src/data/data.ts` file.

```ts
export const ANIMATIONS: IAnimation[] = [
	{
		id: X,
		modules: Modules,
		function: createXXXXAnimation,
		title: 'title',
		description: 'description'
	}
];
```

### Step 4

Enjoy testing your animation within the software using the templates!

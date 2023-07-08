import type {IDevice, ILed} from '../interfaces/interfaces';

export const devic: IDevice[] = [
	{
		id: '1',
		connected: [
			{
				id: '2',
				pin:2
			}
		]
	},
	{
		id: '2',
		connected: [
			{
				id: '1',
				pin: 2
			}
		]
	}
];




export const deviceslol: IDevice[] = [
	{
		id: '1',
		connected: [
			{
				id: '2',
				pin: 3
			}
		]
	},
	{
		id: '2',
		connected: [
			{
				id: '1',
				pin: 1
			},
			{
				id: '3',
				pin: 2
			}
		]
	},
	{
		id: '3',
		connected: [
			{
				id: '2',
				pin: 1
			},
			{
				id: '4',
				pin: 2
			},
			{
				id: '8',
				pin: 3
			}
		]
	},
	{
		id: '4',
		connected: [
			{
				id: '3',
				pin: 1
			},
			{
				id: '5',
				pin: 3
			}
		]
	},
	{
		id: '5',
		connected: [
			{
				id: '4',
				pin: 1
			},
			{
				id: '6',
				pin: 2
			}
		]
	},
	{
		id: '6',
		connected: [
			{
				id: '5',
				pin: 3
			},
			{
				id: '7',
				pin: 2
			}
		]
	},
	{
		id: '7',
		connected: [
			{
				id: '6',
				pin: 1
			}
		]
	},
	{
		id: '8',
		connected: [
			{
				id: '3',
				pin: 1
			},
			{
				id: '9',
				pin: 2
			}
		]
	},
	{
		id: '9',
		connected: [
			{
				id: '8',
				pin: 1
			},
			{
				id: '10',
				pin: 3
			}
		]
	},
	{
		id: '10',
		connected: [
			{
				id: '9',
				pin: 1
			},
			{
				id: '11',
				pin: 3
			}
		]
	},
	{
		id: '11',
		connected: [
			{
				id: '10',
				pin: 1
			}
		]
	}
];

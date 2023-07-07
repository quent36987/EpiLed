import type { IDevice } from '../interfaces/interfaces';

export const devices: IDevice[] = [
	{
		id: '1',
		connected: [
			{
				id: '2',
				pin: 1
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
				pin: 2
			}
		]
	}
];

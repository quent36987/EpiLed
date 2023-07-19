import type { IDevice, IShape, ISharingShape } from '../interfaces/interfaces';

export const generateDevices = (triangleCount: number): IDevice[] => {
	const devices: IDevice[] = [];

	for (let i = 1; i <= triangleCount; i++) {
		const device: IDevice = {
			id: i.toString(),
			connected: [],
			size: 3
		};

		const prevId = i === 1 ? triangleCount : i - 1;
		const nextId = i === triangleCount ? 1 : i + 1;

		device.connected.push({ id: prevId.toString(), pin: 2 });
		device.connected.push({ id: nextId.toString(), pin: 4 });

		devices.push(device);
	}

	return devices;
};

export const deviceslol: IDevice[] = [
	{
		id: '1',
		connected: [
			{
				id: '2',
				pin: 6
			}
		],
		size: 2
	},
	{
		id: '2',
		connected: [
			{
				id: '1',
				pin: 2
			},
			{
				id: '3',
				pin: 4
			}
		],
		size: 2
	},
	{
		id: '3',
		connected: [
			{
				id: '2',
				pin: 2
			}
		],
		size: 3
	}
];

const shape: IShape = {
	title: 'title',
	id: 0,
	devices: deviceslol,
	owner_id: 5828,
	layers: []
};

export const sharingShapes: ISharingShape[] = [
	{
		id: 0,
		shape: shape
	},
	{
		id: 1,
		shape: shape
	},
	{
		id: 2,
		shape: shape
	},
	{
		id: 3,
		shape: shape
	},
	{
		id: 4,
		shape: shape
	},
	{
		id: 5,
		shape: shape
	},
	{
		id: 6,
		shape: shape
	},
	{
		id: 7,
		shape: shape
	},
	{
		id: 8,
		shape: shape
	},
	{
		id: 9,
		shape: shape
	}
];

// export const deviceslol: IDevice[] = [
// 	{
// 		id: '1',
// 		connected: [
// 			{
// 				id: '2',
// 				pin: 3
// 			}
// 		]
// 	},
// 	{
// 		id: '2',
// 		connected: [
// 			{
// 				id: '1',
// 				pin: 1
// 			},
// 			{
// 				id: '3',
// 				pin: 2
// 			}
// 		]
// 	},
// 	{
// 		id: '3',
// 		connected: [
// 			{
// 				id: '2',
// 				pin: 1
// 			},
// 			{
// 				id: '4',
// 				pin: 2
// 			},
// 			{
// 				id: '8',
// 				pin: 3
// 			}
// 		]
// 	},
// 	{
// 		id: '4',
// 		connected: [
// 			{
// 				id: '3',
// 				pin: 1
// 			},
// 			{
// 				id: '5',
// 				pin: 3
// 			}
// 		]
// 	},
// 	{
// 		id: '5',
// 		connected: [
// 			{
// 				id: '4',
// 				pin: 1
// 			},
// 			{
// 				id: '6',
// 				pin: 2
// 			}
// 		]
// 	},
// 	{
// 		id: '6',
// 		connected: [
// 			{
// 				id: '5',
// 				pin: 3
// 			},
// 			{
// 				id: '7',
// 				pin: 2
// 			}
// 		]
// 	},
// 	{
// 		id: '7',
// 		connected: [
// 			{
// 				id: '6',
// 				pin: 1
// 			}
// 		]
// 	},
// 	{
// 		id: '8',
// 		connected: [
// 			{
// 				id: '3',
// 				pin: 1
// 			},
// 			{
// 				id: '9',
// 				pin: 2
// 			}
// 		]
// 	},
// 	{
// 		id: '9',
// 		connected: [
// 			{
// 				id: '8',
// 				pin: 1
// 			},
// 			{
// 				id: '10',
// 				pin: 3
// 			}
// 		]
// 	},
// 	{
// 		id: '10',
// 		connected: [
// 			{
// 				id: '9',
// 				pin: 1
// 			},
// 			{
// 				id: '11',
// 				pin: 3
// 			}
// 		]
// 	},
// 	{
// 		id: '11',
// 		connected: [
// 			{
// 				id: '10',
// 				pin: 1
// 			}
// 		]
// 	}
// ];

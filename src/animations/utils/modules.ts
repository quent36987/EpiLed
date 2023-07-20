import type { IModule } from '../../interfaces/interfaces';
/* disable-eslint */
export const createConfig = (modules: IModule[]) => {
	const config = {};

	modules.forEach((module) => {
		if (module.range) config[module.name] = module.range.value;
		else if (module.color) config[module.name] = module.color.value;
		else if (module.toggle) config[module.name] = module.toggle.value;
	});

	return config;
};

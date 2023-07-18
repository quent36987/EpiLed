import { writable } from 'svelte/store';

export const toasts = writable<IToast[]>([]);

export interface IToast {
	id: number;
	type: string;
	dismissible: boolean;
	timeout: number;
	message: string;
}

export const addToast = (toast: any) => {
	const id = Math.floor(Math.random() * 10000);

	const defaults = {
		id,
		type: 'info',
		dismissible: true,
		timeout: 3000
	};

	toasts.update((all) => [{ ...defaults, ...toast }, ...all]);

	if (toast.timeout) setTimeout(() => dismissToast(id), toast.timeout);
};

export const addSuccessToast = (message: string) => {
	addToast({
		message,
		type: 'success',
		timeout: 3000
	});
};

export const addErrorToast = (message: string) => {
	addToast({
		message,
		type: 'error',
		timeout: 3000
	});
};

export const addInfoToast = (message: string) => {
	addToast({
		message,
		type: 'info',
		timeout: 3000
	});
};

export const dismissToast = (id: number) => {
	toasts.update((all) => all.filter((t) => t.id !== id));
};

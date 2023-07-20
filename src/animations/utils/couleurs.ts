/* eslint-disable */
function hslToHex(h: number, s: number, l: number): string {
	let r: number, g: number, b: number;
	if (s === 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	const toHex = (x: number) => {
		const hex = Math.round(x * 255).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToHSL(H: string): number {
	let r = 0,
		g = 0,
		b = 0;
	if (H.length === 4) {
		r = parseInt('0x' + H[1] + H[1]);
		g = parseInt('0x' + H[2] + H[2]);
		b = parseInt('0x' + H[3] + H[3]);
	} else if (H.length === 7) {
		r = parseInt('0x' + H[1] + H[2]);
		g = parseInt('0x' + H[3] + H[4]);
		b = parseInt('0x' + H[5] + H[6]);
	}
	r /= 255;
	g /= 255;
	b /= 255;

	let cmin = Math.min(r, g, b),
		cmax = Math.max(r, g, b),
		delta = cmax - cmin,
		h = 0;

	if (delta === 0) h = 0;
	else if (cmax === r) h = ((g - b) / delta) % 6;
	else if (cmax === g) h = (b - r) / delta + 2;
	else h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	if (h < 0) h += 360;

	h /= 360;

	return h;
}

export function generateColorWave(
	n: number,
	start: string = '#FF0000',
	end: string = '#ff0000'
): string[] {
	start = hexToHSL(start).toString();
	end = hexToHSL(end).toString();

	let colorWave: string[] = [];

	for (let i = 0; i < n; i++) {
		let hue = parseFloat(start) + (parseFloat(end) - parseFloat(start)) * (i / n);
		colorWave.push(hslToHex(hue, 1, 0.5));
	}

	return colorWave;
}

export function generateLightColorWave(
	n: number,
	start: string = '#ff2f00',
	end: string = '#ff0062'
): string[] {
	start = hexToHSL(start).toString();
	end = hexToHSL(end).toString();

	let colorWave: string[] = [];

	for (let i = 0; i < n; i++) {
		let hue = parseFloat(start) + (parseFloat(end) - parseFloat(start)) * (i / n);
		colorWave.push(hslToHex(hue, 0.3, 0.8));
	}

	return colorWave;
}

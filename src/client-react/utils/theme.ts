import * as tinycolor from 'tinycolor2';

export type Theme = {
	id: string;
	name: string;
	author: string;
	desc?: string;
	base?: 'dark' | 'light';
	props: { [key: string]: string };
};

export const lightTheme: Theme = require('../themes/_light.json5');
export const darkTheme: Theme = require('../themes/_dark.json5');

export const themeProps = Object.keys(lightTheme.props).filter(key => !key.startsWith('X'));

export const builtinThemes = [
	require('../themes/white.json5'),
	require('../themes/black.json5'),
	require('../themes/lilac.json5'),
	require('../themes/halloween.json5'),
	require('../themes/city.json5'),
	require('../themes/rainy.json5'),
	require('../themes/urban.json5'),
	require('../themes/cafe.json5'),
	require('../themes/chocolate.json5'),
	require('../themes/danboard.json5'),
	require('../themes/olive.json5'),
	require('../themes/ocean.json5'),
] as Theme[];

export const [
	whiteTheme,
	blackTheme,
	lilacTheme,
	halloweenTheme,
	cityTheme,
	rainyTheme,
	urbanTheme,
	cafeTheme,
	chocolateTheme,
	danboardTheme,
	oliveTheme,
	oceanTheme,
] = builtinThemes;

let timeout: number | null = null;

export function applyTheme(theme: Theme, persist = true) {
	if (timeout) clearTimeout(timeout);

	document.documentElement.classList.add('changing-theme');

	timeout = window.setTimeout(() => {
		document.documentElement.classList.remove('changing-theme');
	}, 1000);

	// Deep copy
	const _theme = JSON.parse(JSON.stringify(theme));

	if (_theme.base) {
		const base = [lightTheme, darkTheme].find(x => x.id === _theme.base);
		_theme.props = Object.assign({}, base.props, _theme.props);
	}

	const props = compile(_theme);

	for (const tag of Array.from(document.head.children)) {
		if (tag.tagName === 'META' && tag.getAttribute('name') === 'theme-color') {
			tag.setAttribute('content', props['html']);
			break;
		}
	}

	for (const [k, v] of Object.entries(props)) {
		document.documentElement.style.setProperty(`--${k}`, v.toString());
	}

	if (persist) {
		localStorage.setItem('theme', JSON.stringify(props));
	}
}

function compile(theme: Theme): Record<string, string> {
	function getColor(val: string): tinycolor.Instance {
		// ref (prop)
		if (val[0] === '@') {
			return getColor(theme.props[val.substr(1)]);
		}

		// ref (const)
		else if (val[0] === '$') {
			return getColor(theme.props[val]);
		}

		// func
		else if (val[0] === ':') {
			const parts = val.split('<');
			const func = parts.shift().substr(1);
			const arg = parseFloat(parts.shift());
			const color = getColor(parts.join('<'));

			switch (func) {
				case 'darken': return color.darken(arg);
				case 'lighten': return color.lighten(arg);
				case 'alpha': return color.setAlpha(arg);
			}
		}

		// other case
		return tinycolor(val);
	}

	const props: Record<string, string> = {};

	for (const [k, v] of Object.entries(theme.props)) {
		if (k.startsWith('$')) continue; // ignore const

		props[k] = genValue(getColor(v));
	}

	return props;
}

function genValue(c: tinycolor.Instance): string {
	return c.toRgbString();
}

export function validateTheme(theme: Record<string, any>): boolean {
	if (theme.id == null || typeof theme.id !== 'string') return false;
	if (theme.name == null || typeof theme.name !== 'string') return false;
	if (theme.base == null || !['light', 'dark'].includes(theme.base)) return false;
	if (theme.props == null || typeof theme.props !== 'object') return false;
	return true;
}
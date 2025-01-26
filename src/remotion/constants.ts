export const config = {
	compositionHeight: 600,
	compositionWidth: 600,
	duration: 1000,
	fps: 30
};

export type ThemeId = 'player1' | 'player2';

export type Theme = {
	name: ThemeId;
	displayName: string;
	colors: {
		background: string;
		black: string;
		white: string;
		primary: string;
	};
};

export const player1Theme: Theme = {
	name: 'player1',
	displayName: 'Player 1',
	colors: {
		background: '#1a1a1a',
		black: '#141414',
		white: '#ffffff',
		primary: '#FD3132'
	}
};

export const player2Theme: Theme = {
	name: 'player2',
	displayName: 'Player 2',
	colors: {
		background: '#1a1a1a',
		black: '#141414',
		white: '#ffffff',
		primary: '#3189FD'
	}
};

export const themes = [player1Theme, player2Theme];

export const findTheme = (themeId: ThemeId) =>
	themes.find((t) => t.name === themeId) || player1Theme;

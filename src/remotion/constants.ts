export const DURATIONS = [75, 120, 150];

export const config = {
	compositionHeight: 600,
	compositionWidth: 600,
	duration: DURATIONS.reduce((a, b) => a + b, 0),
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
		heatmap: {
			0: string;
			1: string;
			2: string;
			3: string;
			4: string;
			5: string;
			6: string;
			7: string;
		};
	};
};

export const player1Theme: Theme = {
	name: 'player1',
	displayName: 'Player 1',
	colors: {
		background: '#1a1a1a',
		black: '#141414',
		white: '#ffffff',
		primary: '#FD3132',
		heatmap: {
			0: '#FFFFFF',
			1: '#FFDBDB',
			2: '#FE9393',
			3: '#FD4B4B',
			4: '#FD0204',
			5: '#B40203',
			6: '#6C0102',
			7: '#240001'
		}
	}
};

export const player2Theme: Theme = {
	name: 'player2',
	displayName: 'Player 2',
	colors: {
		background: '#1a1a1a',
		black: '#141414',
		white: '#ffffff',
		primary: '#3189FD',
		// TODO: Change colors to match player 2 theme
		heatmap: {
			0: '#FFFFFF',
			1: '#FFDBDB',
			2: '#FE9393',
			3: '#FD4B4B',
			4: '#FD0204',
			5: '#B40203',
			6: '#6C0102',
			7: '#240001'
		}
	}
};

export const themes = [player1Theme, player2Theme];

export const findTheme = (themeId: ThemeId) =>
	themes.find((t) => t.name === themeId) || player1Theme;

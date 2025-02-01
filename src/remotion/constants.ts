export const DURATIONS = [90, 140, 150, 120];
export const TRANSITION_DURATION = 15;

export const config = {
	compositionHeight: 600,
	compositionWidth: 600,
	duration: DURATIONS.reduce((a, b) => a + b, 0) - (DURATIONS.length - 1) * TRANSITION_DURATION,
	fps: 30
};

export type ThemeId = 'player1' | 'player2' | 'player3' | 'player4';

export type Theme = {
	name: ThemeId;
	displayName: string;
	colors: {
		background: string;
		black: string;
		white: string;
		primary: string;
		// Shade generator: https://mdigi.tools/color-shades
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
		primary: '#2E88FD',
		// TODO: Change colors to match player 2 theme
		heatmap: {
			0: '#FFFFFF',
			1: '#DBEAFF',
			2: '#93C1FE',
			3: '#4B98FD',
			4: '#026FFD',
			5: '#024FB4',
			6: '#01306C',
			7: '#001024'
		}
	}
};

export const player3Theme: Theme = {
	name: 'player3',
	displayName: 'Player 3',
	colors: {
		background: '#1a1a1a',
		black: '#141414',
		white: '#ffffff',
		primary: '#f9ad01',
		heatmap: {
			0: '#FFFFFF',
			1: '#fff4db',
			2: '#ffdd92',
			3: '#fec74a',
			4: '#feb001',
			5: '#b57e01',
			6: '#6d4c00',
			7: '#241900'
		}
	}
};

export const player4Theme: Theme = {
	name: 'player4',
	displayName: 'Player 4',
	colors: {
		background: '#1a1a1a',
		black: '#141414',
		white: '#ffffff',
		primary: '#019d1d',
		heatmap: {
			0: '#FFFFFF',
			1: '#dbffe1',
			2: '#92fea6',
			3: '#4afe6a',
			4: '#02fd2f',
			5: '#01b521',
			6: '#016d14',
			7: '#002407'
		}
	}
};

export const themes = [player1Theme, player2Theme, player3Theme, player4Theme];

export const findTheme = (themeId: ThemeId) =>
	themes.find((t) => t.name === themeId) || player1Theme;

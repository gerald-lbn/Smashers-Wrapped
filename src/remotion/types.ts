import type { Theme } from './constants';
import { fakeData } from './all';

export type Stats = typeof fakeData;

export type CompositionProps = {
	stats: Stats;
	type: 'square'; // 'portrait' | 'square' | 'landscape';
	theme: Theme;
};

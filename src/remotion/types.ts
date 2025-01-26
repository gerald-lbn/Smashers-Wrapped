import type { Theme } from './constants';
import { fakeData } from './all';

type Stats = typeof fakeData;

export type CompositionProps = {
	stats: Stats;
	type: 'square'; // 'portrait' | 'square' | 'landscape';
	theme: Theme;
};

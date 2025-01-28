import React from 'react';
import { AbsoluteFill } from 'remotion';
import { type Theme } from '../constants';
import { type Stats } from '../types';

export const BiggestTournament: React.FC<{
	stats: Stats;
	theme: Theme;
}> = ({ stats, theme }) => {
	return <AbsoluteFill></AbsoluteFill>;
};

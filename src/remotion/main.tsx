import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { CompositionProps } from './types';
import { ThisIsMyRecap } from './ThisIsMyRecap';

export const Main: React.FC<CompositionProps> = ({ stats, theme }) => {
	return (
		<AbsoluteFill>
			<ThisIsMyRecap theme={theme} name={stats.player.name} image={stats.player.image} />
		</AbsoluteFill>
	);
};

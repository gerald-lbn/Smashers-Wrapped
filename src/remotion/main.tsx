import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { CompositionProps } from './types';
import { ThisIsMyRecap } from './ThisIsMyRecap';
import { Background } from './_components/Background';

export const Main: React.FC<CompositionProps> = ({ stats, theme }) => {
	return (
		<>
			<Background theme={theme} />

			<AbsoluteFill>
				<ThisIsMyRecap
					theme={theme}
					name={stats.player.name}
					country={'USA'}
					genderPronouns={stats.player.genderPronouns}
					image={stats.player.image}
				/>
			</AbsoluteFill>
		</>
	);
};

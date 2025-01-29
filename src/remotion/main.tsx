import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import type { CompositionProps } from './types';
import { ThisIsMyRecap } from './ThisIsMyRecap';
import { Background } from './_components/Background';
import { Slide, transitionDuration } from './_components/Slide';
import { BiggestTournament } from './BiggestTournament';
import { DURATIONS } from './constants';

export const Main: React.FC<CompositionProps> = ({ stats, theme }) => {
	const accumulatedDurations = (i: number) => DURATIONS.slice(0, i).reduce((a, b) => a + b, 0);

	return (
		<AbsoluteFill>
			<Background theme={theme} />

			<Sequence durationInFrames={DURATIONS[0] + transitionDuration} name="This is my recap">
				<Slide direction="left">
					<ThisIsMyRecap
						theme={theme}
						name={stats.player.name}
						country={'USA'}
						genderPronouns={stats.player.genderPronouns}
						image={stats.player.image}
					/>
				</Slide>
			</Sequence>

			<Sequence
				durationInFrames={DURATIONS[1] + transitionDuration}
				from={accumulatedDurations(1)}
				name="Biggest tournament"
			>
				<Slide direction="right">
					<Slide direction="left">
						<BiggestTournament stats={stats} theme={theme} />
					</Slide>
				</Slide>
			</Sequence>
		</AbsoluteFill>
	);
};

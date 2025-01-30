import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import type { CompositionProps } from './types';
import { ThisIsMyRecap } from './ThisIsMyRecap';
import { Background } from './_components/Background';
import { Slide, transitionDuration } from './_components/Slide';
import { BiggestTournament } from './BiggestTournament';
import { DURATIONS } from './constants';
import { TournamentsHeatmap } from './TournamentsHeatmap';

export const Main: React.FC<CompositionProps> = ({ stats, theme }) => {
	return (
		<AbsoluteFill>
			<Background theme={theme} />

			<Series>
				<Series.Sequence durationInFrames={DURATIONS[0]} name="This is my recap">
					<Slide direction="left">
						<ThisIsMyRecap
							theme={theme}
							name={stats.player.name}
							country={'USA'}
							genderPronouns={stats.player.genderPronouns}
							image={stats.player.image}
						/>
					</Slide>
				</Series.Sequence>

				<Series.Sequence
					durationInFrames={DURATIONS[1]}
					offset={-transitionDuration}
					name="Tournament Heatmap"
				>
					<Slide direction="right">
						<Slide direction="left">
							<TournamentsHeatmap theme={theme} />
						</Slide>
					</Slide>
				</Series.Sequence>

				<Series.Sequence
					durationInFrames={DURATIONS[2]}
					offset={-transitionDuration}
					name="Biggest tournament"
				>
					<Slide direction="right">
						<Slide direction="left">
							<BiggestTournament stats={stats} theme={theme} />
						</Slide>
					</Slide>
				</Series.Sequence>
			</Series>
		</AbsoluteFill>
	);
};

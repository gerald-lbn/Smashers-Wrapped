import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import type { CompositionProps } from './types';
import { ThisIsMyRecap } from './ThisIsMyRecap';
import { Background } from './_components/Background';
import { Slide } from './_components/Slide';
import { BiggestTournament } from './BiggestTournament';
import { DURATIONS, TRANSITION_DURATION } from './constants';
import { TournamentsHeatmap } from './TournamentsHeatmap';
import { RecurringOpponents } from './RecurringOpponents';

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
					offset={-TRANSITION_DURATION}
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
					offset={-TRANSITION_DURATION}
					name="Biggest tournament"
				>
					<Slide direction="right">
						<Slide direction="left">
							<BiggestTournament stats={stats} theme={theme} />
						</Slide>
					</Slide>
				</Series.Sequence>

				<Series.Sequence
					durationInFrames={DURATIONS[3]}
					offset={-TRANSITION_DURATION}
					name="Reccurring opponents"
				>
					<Slide direction="right">
						<Slide direction="left">
							<RecurringOpponents opponents={[]} theme={theme} />
						</Slide>
					</Slide>
				</Series.Sequence>
			</Series>
		</AbsoluteFill>
	);
};

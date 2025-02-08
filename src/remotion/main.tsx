import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import type { CompositionProps } from './types';
import { ThisIsMyRecap } from './ThisIsMyRecap';
import { Background } from './_components/Background';
import { Slide } from './_components/Slide';
import { BiggestTournament } from './BiggestTournament';
import { DURATIONS, TRANSITION_DURATION } from './constants';
import { TournamentsHeatmap } from './TournamentsHeatmap';
import { FavouriteCharacters } from './FavouriteCharacters';

import './_styles/fonts.css';
import './_styles/reset.css';

export const Main: React.FC<CompositionProps> = ({ stats, theme }) => {
	return (
		<AbsoluteFill
			style={{
				fontFamily: 'FOT-Rodin Pro UB'
			}}
		>
			<Background theme={theme} />

			<Series>
				<Series.Sequence durationInFrames={DURATIONS.myRecap} name="This is my recap">
					<Slide direction="left">
						<ThisIsMyRecap
							theme={theme}
							name={stats.player.name}
							country={stats.player.country}
							genderPronouns={stats.player.genderPronouns}
							image={stats.player.image}
						/>
					</Slide>
				</Series.Sequence>

				<Series.Sequence
					durationInFrames={DURATIONS.tournamentHeatmap}
					offset={-TRANSITION_DURATION}
					name="Tournament Heatmap"
				>
					<Slide direction="right">
						<Slide direction="left">
							<TournamentsHeatmap theme={theme} heats={stats.tournament.perWeek} />
						</Slide>
					</Slide>
				</Series.Sequence>

				<Series.Sequence
					durationInFrames={DURATIONS.biggestTournament}
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
					durationInFrames={DURATIONS.favouriteCharacters}
					offset={-TRANSITION_DURATION}
					name="Favourite characters"
				>
					<Slide direction="right">
						<Slide direction="left">
							<FavouriteCharacters
								theme={theme}
								characters={[
									{ id: 'sora', name: 'Sora', games: 790 },
									{ id: 'lucario', name: 'Lucario', games: 480 },
									{ id: 'sonic', name: 'Sonic', games: 6 }
								]}
							/>
						</Slide>
					</Slide>
				</Series.Sequence>
			</Series>
		</AbsoluteFill>
	);
};

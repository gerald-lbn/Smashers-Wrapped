import { Composition, Folder } from 'remotion';
import { Main } from './main';
import React from 'react';
import { config, DURATIONS, player1Theme } from './constants';
import { ThisIsMyRecap } from './ThisIsMyRecap';
import { BiggestTournament } from './BiggestTournament';
import { TournamentsHeatmap } from './TournamentsHeatmap';
import { fakeData } from './all';
import { thisIsMyRecapSchema } from './ThisIsMyRecap/schema';
import { RecurringOpponents } from './RecurringOpponents';

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="Video"
				component={Main}
				durationInFrames={config.duration}
				fps={config.fps}
				width={config.compositionWidth}
				height={config.compositionHeight}
				// You can override these props for each render:
				// https://www.remotion.dev/docs/parametrized-rendering
				defaultProps={{
					stats: fakeData,
					theme: player1Theme,
					type: 'square'
				}}
			/>
			<Folder name="Slides">
				<Composition
					id="this-is-my-recap"
					component={ThisIsMyRecap}
					durationInFrames={DURATIONS[0]}
					fps={config.fps}
					width={config.compositionWidth}
					height={config.compositionHeight}
					schema={thisIsMyRecapSchema}
					defaultProps={{
						theme: player1Theme,
						name: fakeData.player.name,
						image: fakeData.player.image,
						country: 'USA',
						genderPronouns: fakeData.player.genderPronouns
					}}
				/>
				<Composition
					id="biggest-tournament"
					component={BiggestTournament}
					durationInFrames={DURATIONS[1]}
					fps={config.fps}
					width={config.compositionWidth}
					height={config.compositionHeight}
					defaultProps={{
						theme: player1Theme,
						stats: fakeData
					}}
				/>
				<Composition
					id="tournaments-heatmap"
					component={TournamentsHeatmap}
					durationInFrames={DURATIONS[2]}
					fps={config.fps}
					width={config.compositionWidth}
					height={config.compositionHeight}
					defaultProps={{
						theme: player1Theme
					}}
				/>
				<Composition
					id="recurring-opponents"
					component={RecurringOpponents}
					durationInFrames={DURATIONS[3]}
					fps={config.fps}
					width={config.compositionWidth}
					height={config.compositionHeight}
					defaultProps={{
						opponents: [],
						theme: player1Theme
					}}
				/>
			</Folder>
		</>
	);
};

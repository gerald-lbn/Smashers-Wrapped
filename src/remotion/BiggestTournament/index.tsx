import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { type Theme } from '../constants';
import { type Stats } from '../types';
import { TournamentCard, DELAY } from './TournamentCard';

export const BiggestTournament: React.FC<{
	stats: Stats;
	theme: Theme;
}> = ({ stats, theme }) => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	const moveUp = spring({
		fps,
		frame: frame,
		config: {
			damping: 200
		},
		delay: DELAY
	});

	const titleMarginTop = interpolate(moveUp, [0, 1], [0, height / 3]);

	const totalTournaments = stats.tournament.total;

	return (
		<AbsoluteFill>
			<AbsoluteFill
				className="fot-rodin"
				style={{
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<h1
					style={{
						transform: `translateY(-${titleMarginTop}px)`,
						textAlign: 'center',
						fontSize: 40,
						lineHeight: 1.2,
						color: theme.colors.white,
						// @ts-expect-error -webkit-text-stroke is not in the types
						'-webkit-text-stroke': `2.5px ${theme.colors.black}`,
						textShadow: `4px 4px ${theme.colors.black}`,
						letterSpacing: '-0.04em',
						maxWidth: width - 100
					}}
				>
					Out of my {totalTournaments} tournament{totalTournaments > 1 && 's'}, my biggest one
					{totalTournaments > 1 ? 's are' : 'is'}
				</h1>
			</AbsoluteFill>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center'
				}}
			>
				{stats.tournament.mostAttendees.map((tournament, i) => {
					return (
						<TournamentCard
							index={i}
							image={tournament.image}
							name={tournament.name}
							attendees={tournament.numAttendees}
							startAt={tournament.startAt * 1000}
							theme={theme}
							key={i}
						/>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { type Theme } from '../constants';
import { Title } from '../_components/Title';
import { FAKE_DATA, Heatmap } from './Heatmap';

export const TournamentsHeatmap: React.FC<{
	// weeks: number[];
	theme: Theme;
}> = ({ theme }) => {
	const frame = useCurrentFrame();
	const { fps, width } = useVideoConfig();

	const spr = spring({
		fps,
		frame,
		config: {
			damping: 200
		}
	});

	const delayedSpr = spring({
		fps,
		frame: frame - 60,
		config: {
			damping: 200
		}
	});

	const translateYTitle = interpolate(spr, [0, 1], [-300, -30]);
	const translateYQuote = interpolate(delayedSpr, [0, 1], [300, 30]);

	const numberOfTournaments = FAKE_DATA.map((heats) => heats.heats.map((heat) => Number(heat)))
		.flat()
		.reduce((acc, curr) => acc + curr, 0);

	const funnyQuote = (tournaments: number) => {
		if (tournaments < 10) {
			return "I'm just chilling";
		} else if (tournaments < 20) {
			return 'Getting serious!';
		} else if (tournaments < 40) {
			return 'Getting there!';
		} else if (tournaments < 60) {
			return 'Almost there!';
		} else if (tournaments < 80) {
			return 'Getting serious!';
		} else if (tournaments < 100) {
			return 'Doing tournaments for a living!';
		} else {
			return 'Stop it! Your controller cannot take it anymore @_@^ !';
		}
	};

	return (
		<AbsoluteFill
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<div style={{ width: width - 50 }}>
				<Title
					theme={theme}
					style={{
						transform: `translateY(${translateYTitle}px)`
					}}
				>
					My {numberOfTournaments} tournaments through out the year
				</Title>

				<Heatmap
					weeks={FAKE_DATA}
					size={36}
					theme={theme}
					rowLabels={['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']}
				/>

				<p
					className="fot-rodin"
					style={{
						color: theme.colors.white,
						// @ts-expect-error -webkit-text-stroke is not in the types
						'-webkit-text-stroke': `6px ${theme.colors.black}`,
						textShadow: `4px 4px ${theme.colors.black}`,
						fontSize: 20,
						textAlign: 'center',
						marginTop: 20,
						transform: `translateY(${translateYQuote}px)`,
						maxWidth: width / 1.25,
						margin: '0 auto'
					}}
				>
					{funnyQuote(numberOfTournaments)}
				</p>
			</div>
		</AbsoluteFill>
	);
};

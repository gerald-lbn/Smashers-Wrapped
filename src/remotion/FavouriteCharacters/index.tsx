import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Theme } from '../constants';
import { Characters } from './Characters';

export const FavouriteCharacters: React.FC<{
	theme: Theme;
	characters: {
		name: string;
		image: string;
		games: number;
	}[];
}> = ({ theme, characters }) => {
	const frame = useCurrentFrame();
	const { fps, width } = useVideoConfig();

	const spr = spring({
		fps,
		frame: frame - 60,
		config: {
			damping: 200
		}
	});

	const translateX = interpolate(spr, [0, 1], [0, -width]);
	const translateX2 = interpolate(spr, [0, 1], [width, 0], {
		extrapolateRight: 'clamp'
	});

	return (
		<AbsoluteFill className="fot-rodin">
			<AbsoluteFill
				style={{
					transform: `translateX(${translateX}px)`,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<h1
					style={{
						textAlign: 'center',
						fontSize: 40,
						lineHeight: 1.2,
						color: theme.colors.white,
						WebkitTextStroke: `8px ${theme.colors.black}`,
						textShadow: `6px 6px ${theme.colors.black}`,
						letterSpacing: '-0.04em',
						maxWidth: width - 100
					}}
				>
					No matter the matchup, these were my go-to choices
				</h1>
			</AbsoluteFill>

			<AbsoluteFill
				style={{
					transform: `translateX(${translateX2}px)`
				}}
			>
				<Characters characters={characters} theme={theme} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

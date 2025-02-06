import React, { useMemo } from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig
} from 'remotion';
import type { Theme } from '../constants';

export const Characters: React.FC<{
	theme: Theme;
	characters: {
		name: string;
		id: string;
		games: number;
	}[];
	delay: number;
}> = ({ theme, characters, delay }) => {
	const { width, fps } = useVideoConfig();
	const frame = useCurrentFrame();

	const offset = new Array(characters.length - 1)
		.fill(true)
		.map((_, i) => {
			return spring({
				fps,
				frame: frame - (i + 1) * 40 - delay,
				config: {
					damping: 200
				}
			});
		})
		.reduce((a, b) => a + b);

	const paragraphStyles = useMemo<React.CSSProperties>(
		() => ({
			fontSize: 80,
			lineHeight: 1,
			color: 'transparent',
			WebkitTextStroke: `6px ${theme.colors.black}`,
			WebkitFilter: `drop-shadow(6px 6px 0px ${theme.colors.black})`,
			WebkitBackgroundClip: 'text',
			WebkitTextFillColor: 'transparent',
			textAlign: 'center',
			textWrap: 'nowrap',
			backgroundClip: 'text'
		}),
		[theme.colors.black]
	);

	return (
		<AbsoluteFill
			style={{
				marginLeft: -offset * width
			}}
		>
			{characters.map((character, i) => {
				const perspective = interpolate(character.games, [0, 3000], [800, 200]);
				return (
					<AbsoluteFill
						key={i}
						style={{
							left: i * width
						}}
					>
						<Img src={staticFile(`images/${character.id}/chara_1_trail_00.png`)} />

						<div
							style={{
								position: 'absolute',
								bottom: 0,
								right: 40,
								transform: `perspective(${perspective}px) rotateX(0deg) rotateY(-30deg) rotateZ(-3deg) translateY(-50px)`
							}}
						>
							<p
								style={{
									...paragraphStyles,
									backgroundImage: 'linear-gradient(0deg, #FBFFFE 26.9%, #ACACAC 50.0%)'
								}}
							>
								{character.name}
							</p>
							<p
								style={{
									...paragraphStyles,
									backgroundImage: 'linear-gradient(0deg, #FFB027, #FDE40D)',
									paddingBottom: 20
								}}
							>
								{character.games} games
							</p>
						</div>
					</AbsoluteFill>
				);
			})}
		</AbsoluteFill>
	);
};

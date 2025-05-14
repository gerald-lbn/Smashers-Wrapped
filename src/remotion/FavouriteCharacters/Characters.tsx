import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Character } from './Character';
import type { Theme } from '../constants';

export const Characters: React.FC<{
	characters: {
		name: string;
		image: string;
		games: number;
	}[];
	theme: Theme;
}> = ({ characters, theme }) => {
	const frame = useCurrentFrame();
	const { fps, width } = useVideoConfig();

	const DELAY = 60;

	const offset = Array(characters.length - 1)
		.fill(0)
		.map((_, i) =>
			spring({
				fps,
				frame: frame - (i + 1) * 70 - DELAY,
				config: {
					damping: 200
				}
			})
		);

	return (
		<AbsoluteFill
			style={{
				marginLeft: Math.floor(-offset.reduce((acc, curr) => acc + curr, 0) * width)
			}}
			id="characters"
		>
			{characters.map((character, i) => {
				const delay = i * 30;

				return (
					<AbsoluteFill
						key={i}
						style={{
							left: i * width
						}}
					>
						<Character character={character} theme={theme} offsetDelay={delay} />
					</AbsoluteFill>
				);
			})}
		</AbsoluteFill>
	);
};

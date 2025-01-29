import React from 'react';
import { type Theme } from '../constants';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const DELAY = 60;

export const TournamentCard: React.FC<{
	index: number;
	image: string;
	name: string;
	attendees: number;
	startAt: number;
	theme: Theme;
}> = ({ index, image, name, attendees, startAt, theme }) => {
	const { fps, height, width } = useVideoConfig();
	const frame = useCurrentFrame();

	const TEXT_HEIGHT = height / 3;
	const SPACING = 64;

	const top = interpolate(index, [0, 3], [TEXT_HEIGHT, TEXT_HEIGHT + SPACING]);

	const offsetProg = spring({
		fps,
		frame: frame - DELAY - index * 2,
		config: {
			damping: 200
		}
	});

	const offset = interpolate(offsetProg, [0, 1], [height, 0]);

	return (
		<div
			className="fot-rodin"
			style={{
				display: 'flex',
				alignItems: 'center',
				border: `4px solid ${theme.colors.black}`,
				backgroundColor: theme.colors.white,
				width: '100%',
				maxHeight: 96,

				transform: `translateY(${top + offset}px)`,
				maxWidth: width - 100
			}}
		>
			<div style={{ position: 'relative', width: 96, height: 96 }}>
				<img
					src={image}
					alt=""
					style={{
						width: 96,
						height: 96,
						position: 'absolute',
						inset: 0,
						left: -4,
						display: 'block',
						aspectRatio: '1 / 1',
						maxHeight: 96,
						objectFit: 'contain',
						objectPosition: 'center',
						backgroundColor: theme.colors.black,
						border: `4px solid ${theme.colors.black}`
					}}
				/>
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 12,
					padding: 12,
					paddingRight: 24
				}}
			>
				<p
					style={{
						fontSize: 20,
						lineHeight: 1.2,
						color: theme.colors.black
					}}
				>
					{name}
				</p>
				<span style={{ fontSize: 12, lineHeight: 1, color: theme.colors.black }}>
					{attendees} attendee{attendees > 1 && 's'} —{' '}
					{new Date(startAt).toLocaleDateString('en-US', {
						month: 'long',
						day: 'numeric',
						year: 'numeric'
					})}
				</span>
			</div>
		</div>
	);
};

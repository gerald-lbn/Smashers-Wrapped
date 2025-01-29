import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const transitionDuration = 15;

type SlideDirection = 'left' | 'right' | 'up' | 'down';

export const Slide: React.FC<{ children: React.ReactNode; direction: SlideDirection }> = ({
	children,
	direction
}) => {
	const { fps, width, height, durationInFrames } = useVideoConfig();
	const frame = useCurrentFrame();

	const spr = spring({
		fps,
		frame:
			direction === 'left' || direction === 'down'
				? frame - (durationInFrames - transitionDuration)
				: frame,
		config: { damping: 200 },
		durationInFrames: transitionDuration
	});

	const getTransform = () => {
		switch (direction) {
			case 'left':
				return `translateX(${interpolate(spr, [0, 1], [0, -width])}px)`;
			case 'right':
				return `translateX(${interpolate(spr, [0, 1], [width, 0])}px)`;
			case 'up':
				return `translateY(${interpolate(spr, [0, 1], [height, 0])}px)`;
			case 'down':
				return `translateY(${interpolate(spr, [0, 1], [0, -height])}px)`;
			default:
				return '';
		}
	};

	return (
		<AbsoluteFill
			style={{
				transform: getTransform()
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

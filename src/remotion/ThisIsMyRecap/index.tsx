import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { InGameProfile } from '../_components/InGameProfile';
import { Title } from '../_components/Title';
import { type Theme } from '../constants';

export const ThisIsMyRecap: React.FC<{
	name: string;
	image?: string;
	country?: string;
	theme: Theme;
}> = ({ theme, name, image, country }) => {
	const frame = useCurrentFrame();
	const { fps, height } = useVideoConfig();

	const spr = spring({
		fps,
		frame,
		config: {
			damping: 200
		}
	});
	const translateYTitle = interpolate(spr, [0, 1], [-300, 34]);
	const translateYProfile = interpolate(spr, [0, 1], [height, -62]);

	return (
		<AbsoluteFill
			style={{
				display: 'flex',
				alignItems: 'center'
			}}
		>
			{/* Title */}
			<Title
				theme={theme}
				style={{
					transform: `translateY(${translateYTitle}px)`
				}}
			>
				This is my Smash Recap
			</Title>

			{/* In-Game Profile */}
			<InGameProfile
				name={name}
				image={image}
				country={country}
				theme={theme}
				style={{
					position: 'absolute',
					bottom: -translateYProfile,
					left: '50%',
					transform: 'translateX(calc(-50% + 56px))'
				}}
			/>
		</AbsoluteFill>
	);
};

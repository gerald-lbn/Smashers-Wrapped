import React from 'react';
import {
	AbsoluteFill,
	Easing,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig
} from 'remotion';
import type { Theme } from '../constants';

export const FavouriteCharacters: React.FC<{
	theme: Theme;
	characters: {
		name: string;
		id: string;
		games: number;
	}[];
}> = ({ theme, characters }) => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	const ANGLE = -5;
	const MAX_BG_HEIGHT = 530;

	const spr = spring({
		fps,
		frame: frame - 60,
		config: {
			damping: 200
		}
	});

	const sprHeight = spring({
		fps,
		frame: frame - 85,
		config: {
			damping: 200,
			stiffness: 200
		}
	});

	const sprFilters = spring({
		fps,
		frame: frame - 85,
		config: {
			mass: 0.3,
			damping: 200,
			stiffness: 200
		},
		delay: 10
	});

	const sprScale = spring({
		fps,
		frame: frame - 85,
		config: {
			damping: 200,
			stiffness: 200
		}
	});

	const translateX = interpolate(spr, [0, 1], [0, -width * characters.length]);
	const translateX2 = interpolate(spr, [0, 1], [width, 0]);

	const bgHeight = interpolate(sprHeight, [0, 1], [0, MAX_BG_HEIGHT]);
	const brightness = interpolate(sprFilters, [0, 1], [0, 1]);
	const grayscale = interpolate(sprFilters, [0, 1], [1, 0]);
	const scale = interpolate(sprScale, [0, 1], [0.75, 1]);
	const opacity = interpolate(sprHeight, [0, 1], [0, 1], {
		easing: Easing.in(Easing.bezier(1, 0, 0, 0))
	});
	const translateXImage = interpolate(spr, [0, 1], [0, -25]);

	const paragraphStyles: React.CSSProperties = {
		fontSize: 64,
		lineHeight: 1,
		textAlign: 'center',
		letterSpacing: '-0.04em',
		filter: `drop-shadow(-6px 6px 0 ${theme.colors.black})`
	};

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
					transform: `translateX(${translateX2}px)`,
					overflow: 'hidden',
					position: 'relative'
				}}
			>
				<AbsoluteFill
					style={{
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<div
						style={{
							background: `linear-gradient(to bottom left, #414BC3, #5075DA)`,
							transform: `rotate(${ANGLE}deg) translateX(${translateXImage}px)`,
							height: bgHeight,
							width: width + 100,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							clipPath: 'inset(-50% 0 5px 0)' // Makes the top of the image visible
						}}
					>
						<Img
							src={staticFile('images/sora/chara_1_trail_00.png')}
							alt=""
							width={width}
							height={height}
							style={{
								transform: `rotate(${-ANGLE}deg) scale(${scale})`,
								filter: `grayscale(${grayscale}) brightness(${brightness})`,
								transformOrigin: 'bottom right',
								placeSelf: 'center'
							}}
						/>
					</div>
				</AbsoluteFill>

				<div
					style={{
						position: 'absolute',
						left: 50,
						bottom: 10,
						transform: `perspective(500px) rotateX(0deg) rotateY(30deg) rotateZ(-3deg) translateY(-50px)`,
						opacity
					}}
				>
					<p
						style={{
							...paragraphStyles,
							color: theme.colors.white,
							fontSize: 80
						}}
					>
						Sora
					</p>
					<p
						style={{
							...paragraphStyles,
							backgroundImage: 'linear-gradient(#FDE40D, #FFB027)',
							color: 'transparent',
							backgroundClip: 'text',
							paddingBottom: 10
						}}
					>
						127 games
					</p>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

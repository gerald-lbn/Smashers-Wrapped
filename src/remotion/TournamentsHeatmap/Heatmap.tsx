import React from 'react';
import { type Theme } from '../constants';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type HeatmapData = {
	label: string;
	heats: number[];
}[];

export const HeatmapCell: React.FC<{
	heat: number;
	size: number;
	theme: Theme;
	style?: React.CSSProperties;
	index: number;
	animate?: boolean;
}> = ({ heat, size, style, theme, index, animate = true }) => {
	const { fps } = useVideoConfig();
	const frame = useCurrentFrame();

	const spr = spring({
		fps,
		frame: frame - index / 2.5,
		config: {}
	});

	const opacity = interpolate(spr, [0, 1], [0, 1]);

	return (
		<div
			style={{
				...style,
				width: size,
				height: size,
				border: `4px solid ${theme.colors.black}`,
				// FIXME: fix this type error
				// @ts-expect-error heat might not be in [0, 7]
				backgroundColor: heat <= 7 && heat >= 0 ? theme.colors.heatmap[heat] : theme.colors.black,
				opacity: animate ? opacity : 1
			}}
		></div>
	);
};

export const HeatmapColumn: React.FC<{
	label: string;
	heats: number[];
	size: number;
	theme: Theme;
	index: number;
	maxIndex: number;
}> = ({ label, heats, size, theme, index, maxIndex }) => {
	return (
		<div>
			<div style={{ marginBottom: 8, textAlign: 'center' }}>
				<span
					className="fot-rodin"
					style={{
						fontSize: 12,
						lineHeight: 1,
						color: theme.colors.white,
						WebkitTextStroke: `4px ${theme.colors.black}`
					}}
				>
					{label}
				</span>
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
				{heats.map((heat, i) => (
					<HeatmapCell key={i} heat={heat} size={size} theme={theme} index={i + index * maxIndex} />
				))}
			</div>
		</div>
	);
};

export const HeatmapRowLabel: React.FC<{
	label: string;
	theme: Theme;
}> = ({ label, theme }) => {
	return (
		<span
			className="fot-rodin"
			style={{
				fontSize: 12,
				lineHeight: 3,
				color: theme.colors.white,

				WebkitTextStroke: `4px ${theme.colors.black}`
			}}
		>
			{label}
		</span>
	);
};

export const Heatmap: React.FC<{
	data: HeatmapData;
	rowLabels: string[];
	size: number;
	theme: Theme;
}> = ({ data, rowLabels, size, theme }) => {
	return (
		<div>
			<div style={{ display: 'flex', gap: 4 }}>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 4,
						alignSelf: 'flex-end',
						marginRight: 8
					}}
				>
					{rowLabels.map((label, i) => (
						<HeatmapRowLabel key={i} label={label} theme={theme} />
					))}
				</div>
				{data.map((d, i) => (
					<HeatmapColumn
						key={i}
						label={d.label}
						heats={d.heats}
						size={size}
						theme={theme}
						index={i}
						maxIndex={data.length}
					/>
				))}
			</div>

			<div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
				<HeatmapScale theme={theme} />
			</div>
		</div>
	);
};

export const HeatmapScale: React.FC<{
	theme: Theme;
}> = ({ theme }) => {
	const SIZE = 36;

	const scale = Array.from({ length: 8 }).map((_, i) => i);

	const style: React.CSSProperties = {
		color: theme.colors.white,

		WebkitTextStroke: `6px ${theme.colors.black}`
	};

	return (
		<div
			className="fot-rodin"
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 16
			}}
		>
			<span style={style}>0</span>
			<div style={{ display: 'flex', gap: 4 }}>
				{scale.map((sc, idx) => (
					<HeatmapCell key={idx} heat={sc} size={SIZE} index={sc} theme={theme} animate={false} />
				))}
			</div>
			<span style={style}>7</span>
		</div>
	);
};

import React from 'react';
import { type Theme } from '../constants';

export type Heat = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const FAKE_DATA: {
	label: string;
	heats: Heat[];
}[] = [
	{ label: 'Jan', heats: [7, 4, 5, 1, 5] },
	{ label: 'Feb', heats: [1, 0, 3, 0] },
	{ label: 'Mar', heats: [3, 3, 5, 1] },
	{ label: 'Apr', heats: [6, 6, 3, 7] },
	{ label: 'May', heats: [0, 0, 3, 7, 1] },
	{ label: 'Jun', heats: [6, 6, 3, 7] },
	{ label: 'Jul', heats: [6, 6, 0, 5, 7] },
	{ label: 'Aug', heats: [5, 2, 3, 7] },
	{ label: 'Sep', heats: [6, 4, 4, 1] },
	{ label: 'Oct', heats: [5, 2, 7, 7, 0] },
	{ label: 'Nov', heats: [6, 4, 7, 0] },
	{ label: 'Dec', heats: [6, 3, 4, 5] }
];

export const HeatmapCell: React.FC<{
	heat: Heat;
	size: number;
	theme: Theme;
}> = ({ heat, size, theme }) => {
	return (
		<div
			style={{
				width: size,
				height: size,
				border: `4px solid ${theme.colors.black}`,
				backgroundColor: theme.colors.heatmap[heat]
			}}
		></div>
	);
};

export const HeatmapColumn: React.FC<{
	label: string;
	heats: Heat[];
	size: number;
	theme: Theme;
}> = ({ label, heats, size, theme }) => {
	return (
		<div>
			<div style={{ marginBottom: 8, textAlign: 'center' }}>
				<span
					className="fot-rodin"
					style={{
						fontSize: 12,
						lineHeight: 1,
						color: theme.colors.white,
						// @ts-expect-error -webkit-text-stroke is not in the types
						'-webkit-text-stroke': `4px ${theme.colors.black}`
					}}
				>
					{label}
				</span>
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
				{heats.map((heat, i) => (
					<HeatmapCell key={i} heat={heat} size={size} theme={theme} />
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
				// @ts-expect-error -webkit-text-stroke is not in the types
				'-webkit-text-stroke': `4px ${theme.colors.black}`
			}}
		>
			{label}
		</span>
	);
};

export const Heatmap: React.FC<{
	weeks: { label: string; heats: Heat[] }[];
	rowLabels: string[];
	size: number;
	theme: Theme;
}> = ({ weeks, rowLabels, size, theme }) => {
	return (
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
			{weeks.map((week, i) => (
				<HeatmapColumn key={i} label={week.label} heats={week.heats} size={size} theme={theme} />
			))}
		</div>
	);
};

import type { Theme } from '$remotion/constants';
import React from 'react';

const Chip: React.FC<{
	label: string;
	theme: Theme;
}> = ({ label, theme }) => {
	return (
		<div
			style={{
				border: `4px solid ${theme.colors.black}`,
				backgroundColor: theme.colors.primary,
				padding: '6.8px 13.6px'
			}}
		>
			<span
				className="fot-rodin"
				style={{
					fontSize: '13.6px',
					lineHeight: '20px',
					color: theme.colors.white,
					// @ts-expect-error -webkit-text-stroke is not in the types
					'-webkit-text-stroke': `1.5px ${theme.colors.black}`
				}}
			>
				{label}
			</span>
		</div>
	);
};

export const InGameProfile: React.FC<{
	image?: string;
	name: string;
	country?: string;
	theme: Theme;
	style?: React.CSSProperties;
}> = ({ image, name, country, theme, style }) => {
	return (
		<div style={style}>
			{/* Informations */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-end',
					gap: 8,
					position: 'relative',
					width: 354
				}}
			>
				{/* Chips */}
				<div style={{ display: 'flex', gap: 8 }}>
					{country && <Chip label={'France'} theme={theme} />}
				</div>

				{/* Name */}
				<div
					style={{
						width: '100%',
						backgroundColor: theme.colors.black,
						borderTop: `8px solid ${theme.colors.primary}`,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						padding: 8
					}}
				>
					<h1
						className="fot-rodin"
						style={{
							fontSize: '28px',
							lineHeight: '32px',
							color: theme.colors.white
						}}
					>
						{name}
					</h1>
				</div>

				{/* Avatar */}
				<div
					style={{
						position: 'absolute',
						transform: 'rotate(30deg)',
						border: `4px solid ${theme.colors.black}`,
						width: 161.5,
						height: 161.5,
						overflow: 'hidden',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						transformOrigin: 'bottom right',
						left: -162,
						bottom: 0
					}}
				>
					<img
						src={image}
						style={{
							transform: 'rotate(-30deg)',
							width: 224.4,
							height: 224.4
						}}
					/>
				</div>
			</div>
		</div>
	);
};

import type { Theme } from '../constants';
import { Chip } from './Chip';
import React from 'react';

export const InGameProfile: React.FC<{
	image?: string;
	name: string;
	country?: string;
	genderPronouns?: string;
	theme: Theme;
	style?: React.CSSProperties;
}> = ({ image, name, country, genderPronouns, theme, style }) => {
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
					{country && <Chip label={country} theme={theme} />}
					{genderPronouns && <Chip label={genderPronouns} theme={theme} />}
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

import React from 'react';
import { type Theme } from '../constants';

export const Chip: React.FC<{
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
					'-webkit-text-stroke': `6px ${theme.colors.black}`,
					textShadow: `4px 4px ${theme.colors.black}`
				}}
			>
				{label}
			</span>
		</div>
	);
};

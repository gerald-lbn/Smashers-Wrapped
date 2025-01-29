import React from 'react';
import type { Theme } from '../constants';

export const Title: React.FC<{
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	theme: Theme;
}> = ({ children, className, style, theme }) => {
	return (
		<div
			className={className}
			style={{
				...style,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: 78,
				backgroundColor: theme.colors.primary,
				border: `8px solid ${theme.colors.black}`,
				paddingLeft: 32,
				paddingRight: 32,
				paddingTop: 8,
				paddingBottom: 8
			}}
		>
			<h1
				className="fot-rodin"
				style={{
					color: theme.colors.white,
					// @ts-expect-error -webkit-text-stroke is not in the types
					'-webkit-text-stroke': `8px ${theme.colors.black}`,
					textShadow: `6px 6px ${theme.colors.black}`,
					letterSpacing: '-0.04em'
				}}
			>
				{children}
			</h1>
		</div>
	);
};

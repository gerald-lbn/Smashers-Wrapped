import React from 'react';
import type { Theme } from '../constants';

export const Title: React.FC<{
	children: React.ReactNode;
	className?: string;
	fontSize?: number;
	lineHeight?: number;
	style?: React.CSSProperties;
	theme: Theme;
}> = ({ children, className, fontSize, lineHeight, style, theme }) => {
	return (
		<div
			className={className}
			style={{
				...style,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: 78,
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
					fontSize: fontSize ?? 32,
					lineHeight: lineHeight ?? 1.4,
					letterSpacing: '-0.04em',
					textAlign: 'center',
					color: theme.colors.white,
					// @ts-expect-error -webkit-text-stroke is not in the types
					'-webkit-text-stroke': `8px ${theme.colors.black}`,
					textShadow: `6px 6px ${theme.colors.black}`
				}}
			>
				{children}
			</h1>
		</div>
	);
};

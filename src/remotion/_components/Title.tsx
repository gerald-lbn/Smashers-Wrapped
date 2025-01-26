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
				width: 436,
				height: 78,
				backgroundColor: theme.colors.primary,
				border: `8px solid ${theme.colors.black}`
			}}
		>
			{children}
		</div>
	);
};

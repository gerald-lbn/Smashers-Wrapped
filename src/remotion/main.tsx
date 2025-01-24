import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { CompositionProps } from './types';

export const Main: React.FC<CompositionProps> = ({ stats, type }) => {
	return <AbsoluteFill style={{ backgroundColor: 'white' }}></AbsoluteFill>;
};

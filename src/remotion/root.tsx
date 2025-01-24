import { Composition } from 'remotion';
import { Main } from './main';
import React from 'react';
import { COMPOSITION_HEIGHT, COMPOSITION_WIDTH, DURATION, FPS } from './components/constants';
import { fakeData } from './fake-data';

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="Main"
				component={Main}
				durationInFrames={DURATION}
				fps={FPS}
				width={COMPOSITION_WIDTH}
				height={COMPOSITION_HEIGHT}
				// You can override these props for each render:
				// https://www.remotion.dev/docs/parametrized-rendering
				defaultProps={{
					stats: fakeData,
					type: 'square'
				}}
			/>
		</>
	);
};

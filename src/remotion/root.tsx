import { Composition } from 'remotion';
import { HelloWorld, myCompSchema } from './hello-world';
import { Logo, myCompSchema2 } from './components/logo';
import React from 'react';
import { COMPOSITION_HEIGHT, COMPOSITION_WIDTH } from './components/constants';

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.ts <id> out/video.mp4
				id="HelloWorld"
				component={HelloWorld}
				durationInFrames={150}
				fps={30}
				width={COMPOSITION_WIDTH}
				height={COMPOSITION_HEIGHT}
				// You can override these props for each render:
				// https://www.remotion.dev/docs/parametrized-rendering
				schema={myCompSchema}
				defaultProps={{
					titleText: 'Welcome to Remotion',
					titleColor: '#000000',
					logoColor1: '#91EAE4',
					logoColor2: '#86A8E7'
				}}
			/>

			{/* Mount any React component to make it show up in the sidebar and work on it individually! */}
			<Composition
				id="OnlyLogo"
				component={Logo}
				durationInFrames={150}
				fps={30}
				width={COMPOSITION_WIDTH}
				height={COMPOSITION_HEIGHT}
				schema={myCompSchema2}
				defaultProps={{
					logoColor1: '#91dAE2' as const,
					logoColor2: '#86A8E7' as const
				}}
			/>
		</>
	);
};

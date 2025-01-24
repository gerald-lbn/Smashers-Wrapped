import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { HelloWorld } from './hello-world';
import { COMPOSITION_HEIGHT, COMPOSITION_WIDTH } from './components/constants';

export interface PlayerSchema {
	titleText: string;
	titleColor: string;
	logoColor1: string;
	logoColor2: string;
}

export const PlayerView = forwardRef(
	(props: { data: PlayerSchema; onPaused?: () => void }, ref) => {
		const playerRef: React.RefObject<PlayerRef | null> = React.createRef();

		useEffect(() => {
			if (playerRef.current) {
				// add callback when player pauses
				playerRef.current.addEventListener('pause', () => {
					props.onPaused?.();
				});
			}
		}, []);

		useImperativeHandle(ref, () => ({
			get playerRef() {
				return playerRef.current;
			}
		}));

		return (
			<Player
				ref={playerRef}
				component={HelloWorld}
				durationInFrames={150}
				fps={30}
				compositionHeight={COMPOSITION_HEIGHT}
				compositionWidth={COMPOSITION_WIDTH}
				inputProps={props.data}
				style={{ width: '100%' }}
				controls
			/>
		);
	}
);

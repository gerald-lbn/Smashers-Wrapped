import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { Main } from './main';
import { config, findTheme, type ThemeId } from './constants';

export interface PlayerSchema {
	stats: unknown;
	themeId: ThemeId;
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
				component={Main}
				durationInFrames={config.duration}
				fps={config.fps}
				compositionHeight={config.compositionHeight}
				compositionWidth={config.compositionWidth}
				inputProps={{
					// @ts-expect-error I'll add the types later
					stats: props.data.stats,
					theme: findTheme(props.data.themeId)
				}}
				autoPlay
				controls={true}
				showVolumeControls={false}
				allowFullscreen={false}
				doubleClickToFullscreen={false}
				style={{ width: '100%' }}
			/>
		);
	}
);

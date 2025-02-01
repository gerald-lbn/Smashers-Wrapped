<script lang="ts">
	import PlayerViewWrapper from '$remotion/player-view-wrapper.svelte';
	import { fakeData } from '$remotion/all';
	import { type PlayerRef } from '@remotion/player';

	let { data } = $props();

	let player = $state<PlayerRef | undefined>();

	const onPaused = () => {
		console.log('paused');
	};
</script>

<div class="player-container">
	<PlayerViewWrapper
		bind:player
		{onPaused}
		data={{
			stats: fakeData,
			themeId: 'player1'
		}}
	/>
</div>

<style>
	.player-container {
		height: 100svh;
		display: flex;
		justify-content: center;
		align-items: center;

		:global(& > div) {
			width: 600px;
			height: 600px;
		}
	}
</style>

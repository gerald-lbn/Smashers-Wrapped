<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import React from 'react';
	import { createRoot, type Root } from 'react-dom/client';
	import { type PlayerSchema, PlayerView } from './player-view';
	import { type PlayerRef } from '@remotion/player';

	let {
		data,
		player = $bindable<PlayerRef>(),
		onPaused
	} = $props<{ data: PlayerSchema; player?: PlayerRef; onPaused: () => void }>();

	let containerRef: HTMLDivElement;
	let root: Root;

	// used to rerender the player when changes made
	$effect(() => {
		// we need to access the property in the $effect, because Svelte doesn't automatically detect deep changes. Use flat structure or Svelte Store instead.
		console.log(data.titleText);
		render();
	});

	function render() {
		if (!containerRef || !root) return;
		root.render(
			React.createElement(PlayerView, {
				ref: (ref) => {
					// @ts-expect-error - Svelte doesn't support React refs
					player = ref?.playerRef;
				},
				data,
				onPaused
			})
		);
	}

	onMount(() => {
		root = createRoot(containerRef);
		render();
	});

	onDestroy(() => {
		root?.unmount();
	});
</script>

<div bind:this={containerRef} style="user-select: none;"></div>

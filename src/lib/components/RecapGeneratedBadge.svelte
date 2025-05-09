<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		count: number;
	}

	let { count, class: className, ...props }: Props = $props();
</script>

<div class={className} {...props}>
	{#if count === 0}
		<span>No players have generated their recap yet. Be the first to generate your recap!</span>
	{:else if count === 1}
		<span>{count} player has generated their recap 🔥</span>
	{:else if count > 1}
		<span>{count} players have generated their recap 🔥</span>
	{/if}
</div>

<style>
	div {
		background-color: hsl(var(--color-background-surface));
		color: hsl(var(--color-text-muted-on-surface));
		border: 2px solid hsl(var(--color-border));
		border-radius: 0.5rem;
		font-size: 1rem;
		line-height: 1.125rem;
		padding: 0.75rem 1.25rem;
		width: fit-content;
	}
</style>

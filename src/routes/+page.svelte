<script>
	import LoginWithStartGg from '$lib/components/LoginWithStartGG.svelte';
	import RecapGeneratedBadge from '$lib/components/RecapGeneratedBadge.svelte';
</script>

<main>
	<section id="hero">
		<RecapGeneratedBadge count={123456} class="recap-badge" />
		<h1>Your smash year in review</h1>
		<p>
			Unwrap your journey through the tournaments, battles, and triumphs that made your Smash year
			unforgettable.
		</p>
		<LoginWithStartGg />
	</section>
</main>

<style>
	section#hero {
		min-height: 100svh;
		max-width: 48rem;
		margin: 0 auto;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;

		:global(.recap-badge) {
			margin: 0 auto;
			margin-bottom: 1.5rem;
		}

		h1 {
			font-size: 4rem;
			line-height: 4.5rem;
			text-align: center;
			color: white;
			font-family: var(--font-heading);
			margin-bottom: 1rem;
			-webkit-text-stroke: 15px black;
			text-shadow: 10px 10px 0 black;
		}

		p {
			color: hsl(var(--color-text-muted-on-surface));
			text-align: center;
			margin-bottom: 1.5rem;
		}
	}
</style>

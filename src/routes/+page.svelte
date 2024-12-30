<script>
	import MainDialog from '$lib/components/MainDialog.svelte';
</script>

<main class="container">
	<section id="hero">
		<MainDialog />
	</section>
</main>

<style>
	.container {
		max-width: 75rem;
		margin: 0 auto;
		padding: 0 1rem;
	}

	#hero {
		display: flex;
		align-items: center;
		justify-content: center;

		height: 80svh;
	}
</style>

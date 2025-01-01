<svg width="80" height="80" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" class="tail">
	<circle
		class="spin glow"
		cx="400"
		cy="400"
		fill="none"
		r="200"
		stroke-width="10"
		stroke="#ffffff"
		stroke-dasharray="438 1400"
		stroke-linecap="round"
	/>
</svg>

<style>
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.glow {
		filter: drop-shadow(0 0 5px #fff);
	}

	.tail {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.spin {
		transform-origin: center;
		animation: spin 1s linear infinite;
	}
</style>

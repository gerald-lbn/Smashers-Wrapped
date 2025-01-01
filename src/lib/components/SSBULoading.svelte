<div class="spinner">
	<!-- Logo -->
	<svg width="40" height="42" viewBox="0 0 74 78" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M13.7324 68.9238V53.9806H2.95389C5.29408 59.7552 8.99125 64.8809 13.7324 68.9238ZM0.000735302 38.78C0.000720117 41.33 0.240329 43.8745 0.716402 46.3797H13.7324V8.63619C9.39382 12.3637 5.91834 16.9907 3.54713 22.196C1.17593 27.4012 -0.0341971 33.0602 0.000735302 38.78ZM37.0004 0C35.4851 0.00397018 33.9716 0.104059 32.469 0.299664V46.3785H73.2843C73.7603 43.8737 73.9999 41.3297 74 38.78C74 17.3629 57.4327 0 37.0004 0ZM32.4678 77.2591C33.9707 77.4558 35.4847 77.5563 37.0004 77.56C52.2856 77.56 65.4049 67.8426 71.048 53.9806H32.4678V77.2591Z"
			fill="white"
		/>
	</svg>

	<!-- Tail -->
	<svg
		width="120"
		height="120"
		viewBox="0 0 800 800"
		xmlns="http://www.w3.org/2000/svg"
		class="tail"
	>
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
</div>

<style>
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.glow {
		filter: drop-shadow(0 0 5px #fff);
	}

	.spinner {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
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

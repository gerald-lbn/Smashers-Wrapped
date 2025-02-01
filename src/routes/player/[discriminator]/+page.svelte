<script lang="ts">
	import ThemeSelector from '$lib/components/ThemeSelector.svelte';
	import { fakeData } from '$remotion/all';
	import type { Theme, ThemeId } from '$remotion/constants';
	import PlayerViewWrapper from '$remotion/player-view-wrapper.svelte';
	import { type PlayerRef } from '@remotion/player';

	let { data } = $props();

	let player = $state<PlayerRef | undefined>();
	let themeId = $state<ThemeId>('player1');

	const onPaused = () => {
		console.log('paused');
	};
</script>

<main class="container">
	<div class="dialog">
		<div class="dialog-content">
			<div class="player-container">
				<PlayerViewWrapper
					bind:player
					{onPaused}
					data={{
						stats: fakeData,
						themeId
					}}
				/>
			</div>
			<div class="dialog-controls">
				<div class="upper">
					<ol>
						<li class="controls">
							<span>Choose a theme</span>
							<ThemeSelector bind:themeId style="margin-top: 0.75rem;" />
						</li>
						<li>
							<span>Download your video as MP4</span>
							<button class="download link center">
								<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
									<path
										d="M228,144v64a12,12,0,0,1-12,12H40a12,12,0,0,1-12-12V144a12,12,0,0,1,24,0v52H204V144a12,12,0,0,1,24,0Zm-108.49,8.49a12,12,0,0,0,17,0l40-40a12,12,0,0,0-17-17L140,115V32a12,12,0,0,0-24,0v83L96.49,95.51a12,12,0,0,0-17,17Z"
									></path>
								</svg>
								<span>Download</span>
							</button>
						</li>
						<li>Share your video on social media using <span class="hashtag">#SmashRecap</span></li>
					</ol>

					<div class="socials">
						<a href="#TODO" class="link social center">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
								<path
									d="M214.75,211.71l-62.6-98.38,61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.34,102.75,35.71A8,8,0,0,0,96,32H48a8,8,0,0,0-6.75,12.3l62.6,98.37-61.77,68a8,8,0,1,0,11.84,10.76l58.84-64.72,40.49,63.63A8,8,0,0,0,160,224h48a8,8,0,0,0,6.75-12.29ZM164.39,208,62.57,48h29L193.43,208Z"
								></path>
							</svg>
							<span>Make a tweet</span>
						</a>

						<a href="#TODO" class="link social center">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 568 501">
								<path
									fill="currentColor"
									d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.89-129.52 80.986-149.071-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.659 0 75.291 0 57.946 0-28.906 76.135-1.612 123.121 33.664Z"
								></path>
							</svg>
							<span>Share on BlueSky</span>
						</a>
					</div>
				</div>

				<div class="lower">
					<!-- TODO: Add about route -->
					<a href="#about" class="link">
						<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
							<path
								d="M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-11.55,39.29c-4.79,5-9.75,10.17-12.38,16.52-2.52,6.1-2.63,13.07-2.73,19.82-.1,7-.21,14.33-3.32,17.43s-10.39,3.22-17.43,3.32c-6.75.1-13.72.21-19.82,2.73-6.35,2.63-11.52,7.59-16.52,12.38S132,224,128,224s-9.15-4.92-14.11-9.69-10.17-9.75-16.52-12.38c-6.1-2.52-13.07-2.63-19.82-2.73-7-.1-14.33-.21-17.43-3.32s-3.22-10.39-3.32-17.43c-.1-6.75-.21-13.72-2.73-19.82-2.63-6.35-7.59-11.52-12.38-16.52S32,132,32,128s4.92-9.15,9.69-14.11,9.75-10.17,12.38-16.52c2.52-6.1,2.63-13.07,2.73-19.82.1-7,.21-14.33,3.32-17.43S70.51,56.9,77.55,56.8c6.75-.1,13.72-.21,19.82-2.73,6.35-2.63,11.52-7.59,16.52-12.38S124,32,128,32s9.15,4.92,14.11,9.69,10.17,9.75,16.52,12.38c6.1,2.52,13.07,2.63,19.82,2.73,7,.1,14.33.21,17.43,3.32s3.22,10.39,3.32,17.43c.1,6.75.21,13.72,2.73,19.82,2.63,6.35,7.59,11.52,12.38,16.52S224,124,224,128,219.08,137.15,214.31,142.11ZM140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180Zm28-72c0,17.38-13.76,31.93-32,35.28V144a8,8,0,0,1-16,0v-8a8,8,0,0,1,8-8c13.23,0,24-9,24-20s-10.77-20-24-20-24,9-24,20v4a8,8,0,0,1-16,0v-4c0-19.85,17.94-36,40-36S168,88.15,168,108Z"
							></path>
						</svg>
						<span>Learn more about this project</span>
					</a>
					<a href="/" class="link">
						<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
							<path
								d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z"
							></path>
						</svg>
						<span>Recap another user</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	.hashtag {
		font-weight: 900;
	}

	.container {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100svh;
	}

	.dialog {
		max-width: 62.5rem; /* 1000px */
		width: 100%;
		border-radius: 0.5rem;
		background-color: hsl(var(--color-background-surface));
		border: 2px solid hsl(var(--color-border));

		color: hsl(var(--color-text-muted-on-surface));

		.dialog-content {
			padding: 2rem;
			display: grid;
			grid-template-columns: 1fr 20rem;
			gap: 1.5rem;
		}

		.dialog-controls {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.upper {
				display: grid;
				gap: 1.5rem;

				ol {
					list-style-position: inside;
					display: grid;
					gap: 1.5rem;
				}
			}

			.lower {
				display: grid;
			}
		}
	}

	.socials {
		display: grid;
		gap: 1rem;
	}

	.social {
		background-color: hsl(var(--color-background-element));
	}

	.link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border-radius: 0.5rem;
		padding-left: 1rem;
		padding-right: 1rem;
		height: 3rem;

		& > svg {
			width: 1.5rem;
			height: 1.5rem;
		}
	}

	.link.center {
		justify-content: center;
	}

	button.download {
		background-color: hsl(var(--color-background-element));
		color: hsl(var(--color-text-muted-on-surface));
		font-family: inherit;
		font-size: inherit;
		border: none;

		margin-top: 0.75rem;
		width: 100%;
		cursor: pointer;
	}

	.player-container {
		max-width: 600px;
		max-height: 600px;
		aspect-ratio: 1 / 1;
	}

	@media screen and (max-width: 1024px) {
		.container {
			height: auto;
			padding-top: 2rem;
			padding-bottom: 2rem;
		}

		.dialog {
			max-width: 30rem;

			.dialog-content {
				padding: 1rem;
				grid-template-columns: 1fr;

				.dialog-controls {
					gap: 1.5rem;
				}
			}
		}
	}
</style>

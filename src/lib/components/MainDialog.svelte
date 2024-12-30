<div class="dialog">
	<div class="dialog-header">
		<span>#smashers-wrapped</span>

		<div>
			<a href="https://github.com/gerald-lbn/smashers-wrapped">Source code</a>
			<a href="/about">About this project</a>
		</div>
	</div>
	<div class="dialog-content">
		<h1>Your smash year in review</h1>
		<p>
			Unwrap your journey through the tournaments, battles, and triumphs that made your Smash year
			unforgettable.
		</p>

		<input type="text" placeholder="Enter your start.gg username" />

		<span class="separator">Or</span>

		<a class="startgg-oauth" href="http://start.gg/oath/...">
			<svg
				width="24"
				height="24"
				viewBox="0 0 40 40"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1.25 20h7.5A1.25 1.25 0 0 0 10 18.75v-7.5A1.25 1.25 0 0 1 11.25 10h27.5A1.25 1.25 0 0 0 40 8.75V1.25A1.25 1.25 0 0 0 38.75 0H10A10 10 0 0 0 0 10v8.75A1.25 1.25 0 0 0 1.25 20Z"
					fill="#3f80ff"
				></path>
				<path
					d="M38.75 20h-7.5A1.25 1.25 0 0 0 30 21.25v7.5A1.25 1.25 0 0 1 28.75 30H1.25A1.25 1.25 0 0 0 0 31.25v7.5A1.25 1.25 0 0 0 1.25 40H30A10 10 0 0 0 40 30V21.25A1.25 1.25 0 0 0 38.75 20Z"
					fill="#ff2768"
				></path>
			</svg>
			<span>Continue with my start.gg account</span>
		</a>
	</div>
</div>

<style>
	.dialog {
		max-width: 50rem; /* 800px */
		width: 100%;
		border-radius: 0.5rem;
		background-color: hsl(var(--color-background-surface));
		border: 2px solid hsl(var(--color-border));

		color: hsl(var(--color-text-muted-on-surface));

		.dialog-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 1rem 2rem;
			border-bottom: 2px solid hsl(var(--color-border));

			a {
				padding: 0.5rem 1rem;
				border-radius: 0.25rem;

				font-size: 1rem;
				line-height: 1.5;
			}
		}

		.dialog-content {
			padding: 2rem;
			display: grid;
			gap: 1.5rem;

			h1 {
				font-family: hsl(var(--font-headline));
				font-size: 2.25rem; /* 36px */
				line-height: 3.375rem; /* 54px */
				font-weight: 800;
				color: white;
			}

			p {
				max-width: 33.5rem; /* 536px */
			}

			input {
				background-color: hsl(var(--color-background-element));
				height: 3.5rem; /* 56px */
				padding: 0 1.5rem;
				border: 2px solid hsl(var(--color-border));
				border-radius: 0.5rem;
			}

			.separator {
				display: flex;
				align-items: center;
				text-align: center;
				color: hsl(var(--color-border));
				text-transform: uppercase;

				&::before,
				&::after {
					content: '';
					flex: 1;
					border-bottom: 2px solid hsl(var(--color-border));
				}

				&:not(:empty)::before {
					margin-right: 0.5rem;
				}

				&:not(:empty)::after {
					margin-left: 0.5rem;
				}
			}

			.startgg-oauth {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				gap: 0.75rem;
				height: 3.5rem;
				border-radius: 0.5rem;
				background-color: hsl(var(--color-background-element));
			}
		}
	}
</style>

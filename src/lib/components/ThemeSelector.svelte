<script lang="ts">
	import { type ThemeId, findTheme, themes } from '$remotion/constants';

	interface Props {
		themeId: ThemeId;
		style?: string;
	}

	let { themeId = $bindable(), style }: Props = $props();

	const selectedThemeName = $derived.by(() => {
		return findTheme(themeId).displayName;
	});

	const onThemeChange = (newThemeId: ThemeId) => {
		themeId = newThemeId;
	};
</script>

<div class="theme-selector" {style}>
	<div>
		<span>Theme</span>
		<p class="selected-theme">{selectedThemeName}</p>
	</div>

	<div class="themes">
		{#each themes as theme}
			<label class="theme">
				<input
					type="radio"
					name="theme"
					value={theme.name}
					checked={theme.name === themeId}
					onchange={() => onThemeChange(theme.name)}
					aria-label={theme.displayName}
				/>
				<span style="--_bg_theme: {theme.colors.primary};" class:active={theme.name === themeId}
				></span>
			</label>
		{/each}
	</div>
</div>

<style>
	.theme-selector {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 3.5rem;
		padding-left: 1rem;
		padding-right: 1rem;
		background-color: hsl(var(--color-background-element));
		border-radius: 0.5rem;

		span {
			font-size: 0.75rem;
			line-height: 1;
		}

		.selected-theme {
			font-size: 1rem;
			line-height: 1.5rem;
		}

		.themes {
			display: flex;
			gap: 0.5rem;
			align-items: center;

			.theme {
				input {
					display: none;
				}
				span {
					display: block;
					width: 1.5rem;
					height: 1.5rem;
					border-radius: 9999px;
					cursor: pointer;
					background-color: var(--_bg_theme);
				}
			}
		}

		.theme:has(input:checked) span {
			border: 2px solid white;
		}
	}
</style>

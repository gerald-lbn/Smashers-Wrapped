<script lang="ts" generics="T">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import SsbuLoading from '$lib/components/SSBULoading.svelte';

	interface Props<T> extends Partial<HTMLInputAttributes> {
		options: T[];
		getText: (t: T) => string | number;
		getValue: (t: T) => string | number;
		selected: T;
		loading: boolean;
	}

	let {
		options = $bindable([]),
		getText,
		getValue,
		selected = $bindable<T>(),
		loading,

		value = $bindable(),
		...rest
	}: Props<T> = $props();

	let isListOpen = $state(false);

	let ulElement: HTMLUListElement;
	let inputElement: HTMLInputElement;

	const onListClick = (event: MouseEvent) => {
		const option = event.target as HTMLElement;
		const dataValue = option.getAttribute('data-value');
		if (dataValue) {
			selected = options.find((option) => getValue(option) === dataValue) as T;
			value = getText(selected);
		}
		isListOpen = false;
	};
	const onListKeyDown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'Enter':
				const option = event.target as HTMLElement;
				const dataValue = option.getAttribute('data-value');
				if (dataValue) {
					selected = options.find((option) => getValue(option) === dataValue) as T;
					value = getText(selected);
				}
				isListOpen = false;
				break;
			case 'ArrowUp':
				let prevOption = (event.target as HTMLElement).previousElementSibling as HTMLElement | null;
				if (!prevOption) prevOption = ulElement.lastElementChild as HTMLElement;

				prevOption.focus();
				prevOption.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'center'
				});
				break;
			case 'ArrowDown':
				let nextOption = (event.target as HTMLElement).nextElementSibling as HTMLElement | null;
				if (!nextOption) nextOption = ulElement.firstElementChild as HTMLElement;

				nextOption.focus();
				nextOption.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'center'
				});
				break;
			case 'Tab':
			case 'Escape':
				isListOpen = false;
				break;
			default:
				inputElement.focus();
		}
	};

	const onInputKeyup = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'Escape':
			case 'ArrowUp':
			case 'ArrowLeft':
			case 'ArrowRight':
			case 'Enter':
			case 'Tab':
			case 'Shift':
			case 'Control':
				break;
			case 'ArrowDown':
				if (filteredOptions.length > 0) {
					isListOpen = true;
					const option = ulElement.querySelector('[role="option"]') as HTMLElement | null;
					if (option) option.focus();
				}
				break;
			default:
				isListOpen = true;
				break;
		}
	};
	const onInputKeydown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				event.stopPropagation();
				isListOpen = false;
				break;
			default:
				break;
		}
	};

	const filteredOptions = $derived.by(() =>
		options.filter((option) =>
			getText(option).toString().toLowerCase().includes(value.toString().toLowerCase())
		)
	);
</script>

<div class="combobox">
	<input
		bind:this={inputElement}
		bind:value
		onkeyup={onInputKeyup}
		onkeydown={onInputKeydown}
		type="text"
		autocomplete="off"
		autocapitalize="none"
		spellcheck="false"
		role="combobox"
		aria-controls="combobox-list"
		aria-expanded={isListOpen}
		autocorrect="off"
		aria-autocomplete="list"
		{...rest}
	/>

	<ul
		style={`display: ${value ? '' : 'none'};`}
		bind:this={ulElement}
		role="listbox"
		hidden={!isListOpen}
		onclick={onListClick}
		onkeydown={onListKeyDown}
	>
		{#if value}
			{#if loading}
				<li class="ssbu-loading">
					<SsbuLoading />
				</li>
			{:else if filteredOptions.length > 0}
				{#each filteredOptions as option (option)}
					<li
						role="option"
						tabindex={-1}
						data-text={getText(option)}
						data-value={getValue(option)}
						aria-selected={value === getValue(option)}
						aria-disabled={false}
					>
						{getText(option)}
					</li>
				{/each}
			{/if}
		{/if}
	</ul>
</div>

<style>
	.combobox {
		position: relative;

		input {
			background-color: hsl(var(--color-background-element));
			height: 3.5rem; /* 56px */
			padding: 0 1.5rem;
			border: 2px solid hsl(var(--color-border));
			border-radius: 0.5rem;

			width: 100%;
		}

		ul {
			position: absolute;
			top: calc(100% + 1rem);

			background-color: hsl(var(--color-background-element));
			border: 2px solid hsl(var(--color-border));
			border-radius: 0.5rem;

			width: 100%;

			max-height: 384px;
			overflow: auto;
			overscroll-behavior: contain;
			scroll-behavior: smooth;
			transition: 100ms ease;
			transition-property: height;
		}

		ul:has(.ssbu-loading) {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 12rem;
		}

		li {
			user-select: none;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 48px;
			white-space: pre-wrap;
			color: hsl(var(--color-text-muted-on-surface));

			&:focus,
			&:hover {
				outline: none;
				background: hsla(var(--color-background-surface), 0.8);
			}
		}
	}

	@media screen and (max-width: 768px) {
		input {
			height: 2.5rem; /* 40px */
			padding: 0 1rem;
		}
	}
</style>

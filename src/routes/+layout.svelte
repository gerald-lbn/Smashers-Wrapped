<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import MetaTags from '$lib/components/MetaTags/MetaTags.svelte';
	import { metaConfig } from '$lib';
	import '../styles/app.css';

	let { children } = $props();
</script>

<MetaTags {...metaConfig} />

<ParaglideJS {i18n}>
	{@render children()}
</ParaglideJS>

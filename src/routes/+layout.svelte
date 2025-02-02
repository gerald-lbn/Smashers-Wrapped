<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../styles/app.css';

	let { children, data } = $props();

	const siteName = 'Smasher Wrapped';
	const title = 'Smasher Wrapped - Your Smash year in review';
	const description =
		'Unwrap your journey through the tournaments, battles, and triumphs that made your Smash year unforgettable.';
	const image = data.canonicalUrl + '/og.png';
</script>

<svelte:head>
	<!-- Base Meta Tags -->
	<link rel="icon" href="/favicon.png" />
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content="SSBU,Start.gg" />
	<meta name="author" content="Gérald Leban" />
	<meta name="theme-color" content="#0f0f0f" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={data.canonicalUrl} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={title} />
	<meta name="twitter:creator" content="grlddev" />

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={data.canonicalUrl} />
	<meta property="og:image" content={image} />
	<meta property="og:image:alt" content={title} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- Analytics -->
	<script
		defer
		src="https://analytics.grld.dev/script.js"
		data-website-id="299754b2-67be-42b3-b3ab-15bec27322f5"
	></script>
</svelte:head>

<ParaglideJS {i18n}>
	{@render children()}
</ParaglideJS>

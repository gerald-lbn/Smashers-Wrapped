<script lang="ts">
	import type { IMetaTags } from './types';

	let { icon, title, description, keywords, author, twitter, openGraph }: IMetaTags = $props();
</script>

<svelte:head>
	{#if icon}
		<link rel="icon" href={icon} />
	{/if}

	{#if title}
		<title>{title}</title>
	{/if}

	{#if description}
		<meta name="description" content={description} />
	{/if}

	{#if keywords}
		<meta name="keywords" content={keywords.join(',')} />
	{/if}

	{#if author}
		<meta name="author" content={author} />
	{/if}

	{#if twitter}
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:site" content={twitter.site} />
		<meta name="twitter:title" content={twitter.title} />
		<meta name="twitter:description" content={twitter.description} />
		<meta name="twitter:image" content={twitter.image.src} />
		<meta name="twitter:image:alt" content={twitter.image.alt} />
		<meta name="twitter:creator" content={twitter.creator} />
	{/if}

	{#if openGraph}
		<meta property="og:title" content={openGraph.title} />
		<meta property="og:description" content={openGraph.description} />
		<meta property="og:site_name" content={openGraph.siteName} />
		<meta property="og:type" content={openGraph.type} />
		<meta property="og:url" content={openGraph.url} />
		<meta property="og:image" content={openGraph.image.src} />
		<meta property="og:image:alt" content={openGraph.image.alt} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta property="og:locale" content={openGraph.locale} />
	{/if}
</svelte:head>

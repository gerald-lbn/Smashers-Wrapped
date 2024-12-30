import type { IMetaTags } from '$lib/components/MetaTags/types';

export const metaConfig: IMetaTags = {
	icon: '/favicon.ico',
	title: 'Smasher Wrapped - Your Smash year in review',
	description:
		'Unwrap your journey through the tournaments, battles, and triumphs that made your Smash year unforgettable.',
	keywords: ['svelte', 'sveltekit', 'template'],
	author: 'Gérald Leban',
	themeColor: '#0f0f0f',
	twitter: {
		title: 'Smasher Wrapped - Your Smash year in review',
		description:
			'Unwrap your journey through the tournaments, battles, and triumphs that made your Smash year unforgettable.',
		image: {
			src: '/og.png',
			alt: 'Smasher Wrapped - Your Smash year in review'
		},
		creator: 'grlddev'
	},
	openGraph: {
		title: 'Smasher Wrapped - Your Smash year in review',
		description:
			'Unwrap your journey through the tournaments, battles, and triumphs that made your Smash year unforgettable.',
		siteName: 'Smasher Wrapped',
		locale: 'en_US',
		type: 'website',
		image: {
			src: '/og.png',
			alt: 'Smasher Wrapped - Your Smash year in review'
		}
	}
};

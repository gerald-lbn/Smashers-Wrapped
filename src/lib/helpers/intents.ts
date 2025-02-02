interface XIntent {
	platform: 'twitter';
	text: string;
	url?: string;
	hashtags?: string[];
}

interface BlueSkyIntent {
	platform: 'bluesky';
	text: string;
	isMobile: boolean;
}

export const createIntent = (intent: XIntent | BlueSkyIntent) => {
	let url: URL;

	switch (intent.platform) {
		case 'twitter':
			url = new URL('https://twitter.com/intent/tweet');

			if (intent.hashtags) url.searchParams.append('hashtags', intent.hashtags.join(','));
			if (intent.url) url.searchParams.append('url', new URL(intent.url).href);

			break;
		case 'bluesky':
			if (intent.isMobile) url = new URL('bluesky://intent/compose');
			else url = new URL('https://bsky.app/intent/compose');

			break;
		default:
			throw new Error('Invalid platform');
	}

	if (url) {
		url.searchParams.append('text', intent.text);
	}

	return url;
};

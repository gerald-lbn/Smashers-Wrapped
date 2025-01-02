import { STARTGG_BEARER_TOKEN } from '$env/static/private';
import { cacheExchange, Client, fetchExchange, ssrExchange } from '@urql/svelte';

const isServerSide = typeof window === 'undefined';

const ENDPOINT = 'https://api.start.gg/gql/alpha';

const ssr = ssrExchange({
	isClient: !isServerSide,
	initialState: !isServerSide ? {} : undefined
});

const client = new Client({
	url: ENDPOINT,
	exchanges: [cacheExchange, ssr, fetchExchange],
	fetchOptions: () => {
		return {
			headers: {
				Authorization: `Bearer ${STARTGG_BEARER_TOKEN}`
			}
		};
	}
});

export default client;

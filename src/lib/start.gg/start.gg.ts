import { cacheExchange } from '@urql/exchange-graphcache';
import { Client, fetchExchange, ssrExchange } from '@urql/svelte';
import { getRandomToken } from './helper';
import {
	STARTGG_BEARER_TOKEN_1,
	STARTGG_BEARER_TOKEN_2,
	STARTGG_BEARER_TOKEN_3,
	STARTGG_BEARER_TOKEN_4,
	STARTGG_BEARER_TOKEN_5
} from '$env/static/private';

const isServerSide = typeof window === 'undefined';

const ENDPOINT = 'https://api.start.gg/gql/alpha';

const ssr = ssrExchange({
	isClient: !isServerSide,
	initialState: !isServerSide ? {} : undefined
});

const client = new Client({
	url: ENDPOINT,
	exchanges: [cacheExchange(), ssr, fetchExchange],
	fetchOptions: () => {
		const token = getRandomToken([
			STARTGG_BEARER_TOKEN_1,
			STARTGG_BEARER_TOKEN_2,
			STARTGG_BEARER_TOKEN_3,
			STARTGG_BEARER_TOKEN_4,
			STARTGG_BEARER_TOKEN_5
		]);
		console.log('Selected token: ', token);
		return {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};
	}
});

export default client;

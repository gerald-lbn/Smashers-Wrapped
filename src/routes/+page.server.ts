import { findPlayerResultSchema } from '$lib/validation/find-players';

const ENDPOINT = 'https://api.smash.gg';

export const load = async ({ fetch, url }) => {
	const gamerTag = url.searchParams.get('gamerTag');
	if (!gamerTag)
		return {
			players: []
		};

	const reqUrl = new URL(ENDPOINT + '/players');
	reqUrl.searchParams.set('filter', JSON.stringify({ gamerTag }));
	reqUrl.searchParams.set('page', '1');
	reqUrl.searchParams.set('per_page', '25');

	const req = await fetch(reqUrl.toString(), {
		method: 'get'
	});

	if (!req.ok)
		return {
			players: []
		};

	const data = await req.json();
	const result = findPlayerResultSchema.safeParse(data);

	if (!result.success)
		return {
			players: []
		};

	const players = result.data.items.entities.player.filter((player) => player.hasUser);

	return {
		players
	};
};

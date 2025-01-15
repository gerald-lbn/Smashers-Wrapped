import { PlayerSeachInfo } from '$lib/start.gg/queries';
import client from '$lib/start.gg/start.gg';
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

	const playersIds = result.data.items.entities.player.map((player) => player.id.toString());

	const playersSearchInfoPromise = Array.from(playersIds).map((id) => {
		return client.query(PlayerSeachInfo, {
			id
		});
	});

	const players = await Promise.all(playersSearchInfoPromise);

	return {
		search: players.map((player) => player.data?.player)
	};
};

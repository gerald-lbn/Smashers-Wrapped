import { findPlayerResultSchema } from '$lib/validation/find-players';
import { json } from '@sveltejs/kit';

const ENDPOINT = 'https://api.smash.gg/players';

export const GET = async ({ fetch, url }) => {
	const gamerTag = url.searchParams.get('gamerTag');
	if (!gamerTag) return json([]);

	const reqUrl = new URL(ENDPOINT);
	reqUrl.searchParams.set('filter', JSON.stringify({ gamerTag }));
	reqUrl.searchParams.set('page', '1');
	reqUrl.searchParams.set('per_page', '25');

	const req = await fetch(reqUrl.toString(), {
		method: 'get'
	});

	if (!req.ok) return json([]);

	const data = await req.json();
	const result = findPlayerResultSchema.safeParse(data);

	if (!result.success) return json([]);

	const players = result.data.items.entities.player.filter(
		(player) => player.hasUser && player.playerType === 1
	);

	return json(players);
};

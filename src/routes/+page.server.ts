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

	// Fetching users profile image
	const playerIds = players.map((player) => player.id);
	const playersImages = Promise.all(
		playerIds.map(async (playerId) => {
			const req = await fetch(`${ENDPOINT}/player/${playerId}`);
			if (!req.ok) return '';

			const data = await req.json();
			// @ts-expect-error - To lazy to make a schema
			const image = data?.entities?.player?.images?.find((image) => image?.type === 'profile');
			if (image) return image?.url;
		})
	);

	return {
		players,
		images: playersImages
	};
};

import { findPlayerResultSchema } from '$lib/validation/find-players';
import { json } from '@sveltejs/kit';

const ENDPOINT = 'https://api.smash.gg/players';
const PLAYER_ENDPOINT = 'https://api.smash.gg/player';

export type ApiResponse = {
	id: number;
	prefix: string;
	gamerTag: string;
	image: string;
}[];

export const GET = async ({ fetch, setHeaders, url }) => {
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

	const players = result.data.items.entities.player.filter((player) => player.hasUser);
	const sortedResults = result.data.items.result;

	// Sort players based on sortedResults
	players.sort((a, b) => {
		return sortedResults.indexOf(a.id) - sortedResults.indexOf(b.id);
	});

	// Fetch player image profile
	const playerIds = players.map((player) => player.id);
	const playerImages = await Promise.all(
		playerIds.map(async (id) => {
			const req = await fetch(`${PLAYER_ENDPOINT}/${id}`, {
				method: 'get'
			});

			if (!req.ok) return null;

			const data = await req.json();
			// @ts-expect-error - filter images by type
			return data.images.filter((image) => image.type === 'profile');
		})
	);

	const response = players.map((player, index) => {
		return {
			id: player.id,
			prefix: player.prefix,
			gamerTag: player.gamerTag,
			image: playerImages[index]?.[0]?.url
		};
	});

	//
	setHeaders({
		'Cache-Control': 'max-age=600' // 10 minutes
	});

	return json(response);
};

import { json } from '@sveltejs/kit';
import { SearchPlayerByGamerTag, SearchPlayerByGamerTagQuery } from '$lib/start.gg/queries';
import { getDataFromStartGG } from '$lib/start.gg/start.gg';

export const GET = async ({ url }) => {
	const userId = url.searchParams.get('userId');
	if (!userId) return json([]);

	const { data: playerData } = await getDataFromStartGG<typeof SearchPlayerByGamerTag>(
		SearchPlayerByGamerTagQuery,
		{
			search: {
				filter: {
					id: userId,
					isUser: true,
					hideTest: true
				}
			}
		}
	);

	const player = playerData?.players?.nodes?.[0];
	if (!player) return json([]);

	return json(player);
};

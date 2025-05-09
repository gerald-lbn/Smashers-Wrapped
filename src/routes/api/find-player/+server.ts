import { json } from '@sveltejs/kit';
import { SearchPlayerByGamerTag, SearchPlayerByGamerTagQuery } from '$lib/start.gg/queries';
import { getDataFromStartGG } from '$lib/start.gg/start.gg';

export const GET = async ({ url }) => {
	const gamerTag = url.searchParams.get('gamerTag');
	if (!gamerTag) return json([]);

	const res = await getDataFromStartGG<typeof SearchPlayerByGamerTag>(SearchPlayerByGamerTagQuery, {
		search: {
			filter: {
				gamerTag,
				isUser: true,
				hideTest: true
			}
		}
	});

	return json(res);
};

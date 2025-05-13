import { json } from '@sveltejs/kit';
import { SearchPlayerByGamerTag, SearchPlayerByGamerTagQuery } from '$lib/start.gg/queries';
import { getDataFromStartGG } from '$lib/start.gg/start.gg';
import {
	aggregateByMonth,
	getThisYearEvents,
	getTop3Occurrences,
	notNullNorUndefined,
	parseMatch
} from '$lib/start.gg/helper';

export const GET = async ({ url }) => {
	const userId = url.searchParams.get('userId');
	if (!userId) return json([]);

	/*******************************************************************************
	 * Get basic user info (gamerTag, location, profilePic)
	 *******************************************************************************/
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
	if (!player)
		return json({
			error: 'Player not found'
		});

	const thisYear = new Date().getFullYear();

	/********************************************************************************
	 * Get attended events
	 ********************************************************************************/
	const events = await getThisYearEvents(player.user!.id!, thisYear);

	// Group tournaments by month
	const tournaments = events.map((e) => ({
		...e?.tournament,
		startAt: e?.startAt
	}));
	const tournamentsStartAt = tournaments.map((t) => t.startAt).filter(notNullNorUndefined);
	const tournamentsByMonth = aggregateByMonth(tournamentsStartAt);

	// Get the tournaments with the most entrants
	const tournamentsWithMostEntrants = events
		.map((e) => ({
			...e?.tournament,
			numEntrants: e?.numEntrants
		}))
		.sort((a, b) => (b.numEntrants ?? 0) - (a.numEntrants ?? 0))
		.slice(0, 3)
		.map((t) => ({
			name: t.name,
			countryCode: t.countryCode,
			entrants: t.numEntrants,
			image: t.images?.[0]?.url
		}));

	// Get the aliases used by the player
	const aliases = events.map((e) => e?.userEntrant?.name).filter(notNullNorUndefined);
	const aliasesSet = new Set(aliases);

	// Compute global winrate, wins and losses
	type Record = {
		wins: number;
		losses: number;
	};
	const eventsRecord = events
		.map((e) => e?.userEntrant?.record)
		.filter(notNullNorUndefined) as Record[];

	const numberOfWins = eventsRecord.reduce((acc, record) => acc + record.wins, 0);
	const numberOfLosses = eventsRecord.reduce((acc, record) => acc + record.losses, 0);
	const winrate = Math.round((numberOfWins / (numberOfLosses + numberOfWins)) * 100);

	// Paginated sets
	const paginatedSets = events
		.flatMap((e) => e?.userEntrant?.paginatedSets?.nodes ?? [])
		.filter(notNullNorUndefined);

	// Games
	const games = paginatedSets.flatMap((set) => set?.games ?? []).filter(notNullNorUndefined);

	// Most played maps
	const mapsPlayed = games.map((game) => game?.stage?.name);
	const mapsPlayedTop3 = getTop3Occurrences(mapsPlayed);

	// Most played characters
	const charactersPlayed = games
		.flatMap((game) => game?.selections ?? [])
		.filter((selection) => selection?.entrant?.name && aliasesSet.has(selection?.entrant?.name))
		.map((selection) => selection?.character?.name);
	const charactersPlayedTop3 = getTop3Occurrences(charactersPlayed);

	const parsedMatches = paginatedSets
		.map((set) => set?.displayScore)
		.filter(notNullNorUndefined)
		.map(parseMatch)
		.filter((match) => match !== 'DQ');

	// Shutouts dealt and taken
	const shutouts = parsedMatches.reduce(
		(acc, player) => {
			const playerIndex = player.findIndex((p) => aliasesSet.has(p.name));
			if (playerIndex === -1) return acc;

			const otherPlayerScore = player[(playerIndex + 1) % 2].score;
			const playerScore = player[playerIndex].score;

			return {
				taken: acc.taken + (otherPlayerScore === 0 ? 1 : 0),
				given: acc.given + (playerScore === 0 ? 1 : 0)
			};
		},
		{ taken: 0, given: 0 }
	);

	return json({
		me: player,
		tournaments: {
			attended: tournaments.length,
			perMonth: tournamentsByMonth,
			mostEntrants: tournamentsWithMostEntrants
		},
		selections: {
			characters: charactersPlayedTop3,
			maps: mapsPlayedTop3
		},
		stats: {
			aliases: Array.from(aliasesSet),
			sets: {
				winrate,
				wins: numberOfWins,
				losses: numberOfLosses
			},
			shutouts
		},
		raw: events
	});
};

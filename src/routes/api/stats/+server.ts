import { json } from '@sveltejs/kit';
import { SearchPlayerByGamerTag, SearchPlayerByGamerTagQuery } from '$lib/start.gg/queries';
import { getDataFromStartGG } from '$lib/start.gg/start.gg';
import {
	aggregateByMonth,
	computeShutouts,
	computeUpsets,
	computeWinrateInfo,
	getThisYearEvents,
	getTop3Occurrences,
	getUserAliases,
	notNullNorUndefined,
	numberOfTops,
	parseMatch,
	type BracketType,
	type UserEntrantRecord
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
	const entrantNames = events.map((e) => e?.userEntrant?.name);
	const aliasesSet = getUserAliases(entrantNames);

	// Compute global winrate, wins and losses
	const eventsRecord = events
		.map((e) => e?.userEntrant?.record)
		.filter(notNullNorUndefined) as UserEntrantRecord[];

	const { numberOfWins, numberOfLosses, winrate } = computeWinrateInfo(eventsRecord);

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

	// Top 3 characters played against
	const charactersPlayedAgainst = games
		.flatMap((game) => game?.selections ?? [])
		.filter((selection) => selection?.entrant?.name && !aliasesSet.has(selection?.entrant?.name))
		.map((selection) => selection?.character?.name);
	const charactersPlayedAgainstTop3 = getTop3Occurrences(charactersPlayedAgainst);

	const parsedMatches = paginatedSets
		.map((set) => set?.displayScore)
		.filter(notNullNorUndefined)
		.map(parseMatch);

	// Shutouts given and taken
	const shutouts = computeShutouts(parsedMatches, aliasesSet);

	const setsWithFirstGameSelection = paginatedSets.filter(notNullNorUndefined).map((set) => ({
		...set,
		set: {
			phaseGroup: {
				...set.phaseGroup,
				bracketType: set.phaseGroup?.bracketType as BracketType | null
			}
		},
		games: undefined,
		firstGame: set.games?.[0]?.selections
	}));

	// Highest upset factor inflicted and received
	const upsets = computeUpsets(setsWithFirstGameSelection, aliasesSet);

	// Number of tops
	const playerPlacements = events
		.map((e) => e?.userEntrant?.checkInSeed?.placement)
		.filter(notNullNorUndefined);
	const playerTops = numberOfTops(playerPlacements);

	return json({
		me: player,
		tournaments: {
			attended: tournaments.length,
			perMonth: tournamentsByMonth,
			mostEntrants: tournamentsWithMostEntrants
		},
		selections: {
			characters: {
				played: charactersPlayedTop3,
				playedAgainst: charactersPlayedAgainstTop3
			},
			maps: mapsPlayedTop3
		},
		stats: {
			aliases: Array.from(aliasesSet),
			sets: {
				winrate,
				wins: numberOfWins,
				losses: numberOfLosses
			},
			shutouts,
			upsets,
			tops: playerTops
		},
		raw: events
	});
};

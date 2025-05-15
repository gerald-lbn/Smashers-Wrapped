import { json } from '@sveltejs/kit';
import { SearchPlayerByGamerTag, SearchPlayerByGamerTagQuery } from '$lib/start.gg/queries';
import { getDataFromStartGG } from '$lib/start.gg/start.gg';
import {
	aggregateByMonth,
	computeShutouts,
	computeWinrateInfo,
	getThisYearEvents,
	getTop3Occurrences,
	notNullNorUndefined,
	parseMatch,
	upsetFactor,
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
	const aliases = events.map((e) => e?.userEntrant?.name).filter(notNullNorUndefined);
	const aliasesSet = new Set(aliases);

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

	/**
	 * Only consider sets with a bracket type of SINGLE_ELIMINATION or DOUBLE_ELIMINATION
	 * because they are the only ones where the initial seed matters. (I think)
	 */
	const setsWithSingleOrDoubleEliminations = paginatedSets
		.filter(
			(set) =>
				set.phaseGroup?.bracketType === 'SINGLE_ELIMINATION' ||
				set.phaseGroup?.bracketType === 'DOUBLE_ELIMINATION'
		)
		.filter(notNullNorUndefined)
		.map((set) => ({
			...set,
			games: undefined,
			firstGame: set.games?.[0]?.selections
		}));

	// Highest upset factor inflicted and received
	const upsets = {
		inflicted: {
			against: '',
			factor: -Infinity
		},
		received: {
			against: '',
			factor: Infinity
		},
		count: {
			inflicted: 0,
			received: 0
		}
	};

	// Iterate over the sets and compute the upset factor
	setsWithSingleOrDoubleEliminations.forEach((set) => {
		// Search for the player in the set
		const playerIndex = set.firstGame?.findIndex((p) => aliasesSet.has(p?.entrant?.name || ''));
		// If the player is not in the set, skip it
		if (playerIndex === -1 || playerIndex === undefined) return;

		// Get the other player
		const opponentIndex = (playerIndex + 1) % 2;

		// Get players initial seeds
		const playerInitialSeed = set.firstGame?.[playerIndex]?.entrant?.checkInSeed?.seedNum;
		const opponentInitialSeed = set.firstGame?.[opponentIndex]?.entrant?.checkInSeed?.seedNum;

		// If the player or opponent don't have an initial seed, skip it
		if (!playerInitialSeed || !opponentInitialSeed) return;

		// Compute upset factor
		const bracketType = set.phaseGroup?.bracketType;
		// Enforce the type to be either SINGLE_ELIMINATION or DOUBLE_ELIMINATION be
		// sets are filtered above
		const UF = upsetFactor(playerInitialSeed, opponentInitialSeed, bracketType as BracketType);

		// If the player won the set
		if (set.winnerId === set.firstGame?.[playerIndex]?.entrant?.id) {
			// Check if player "upsetted" the opponent i.e UpsetFactor > 0
			if (UF > 0) {
				upsets.count.inflicted++;
				// Update the highest upset factor given if the current one is higher
				if (UF > upsets.inflicted.factor) {
					upsets.inflicted.factor = UF;
					upsets.inflicted.against = set.firstGame?.[opponentIndex]?.entrant?.name || '';
				}
			}
		} else {
			// If the player lost the set, check if the opponent "upsetted" the player i.e UpsetFactor < 0
			if (UF < 0) {
				upsets.count.received++;
				// Update the highest upset factor taken if the current one is lower
				if (UF < upsets.received.factor) {
					upsets.received.factor = UF;
					upsets.received.against = set.firstGame?.[opponentIndex]?.entrant?.name || '';
				}
			}
		}
	});

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
			upsets
		},
		raw: events
	});
};

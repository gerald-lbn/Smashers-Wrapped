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

	// Recurring opponents
	const opponents = setsWithFirstGameSelection
		.flatMap((set) => set.firstGame)
		.filter((selection) => !aliasesSet.has(selection?.entrant?.name ?? ''))
		.flatMap((selection) => selection?.entrant?.players)
		.map((player) => player?.gamerTag);
	const recurringOpponents = getTop3Occurrences(opponents);

	/********************************************************************************
	 * Achievements
	 ********************************************************************************/
	// 1. ThroneBreaker
	const throneBreaker = paginatedSets
		.map((set) => {
			const displayScore = set?.displayScore;
			if (!displayScore) return false;

			const parsedScore = parseMatch(displayScore);
			if (parsedScore === 'DQ') return false;

			const playerIndex = parsedScore.findIndex((p) => aliasesSet.has(p.name));
			if (playerIndex === -1) return false;
			const opponentIndex = playerIndex === 0 ? 1 : 0;

			// Early return if the player is not the winner
			if (parsedScore[playerIndex].score < parsedScore[opponentIndex].score) return false;

			const firstGame = set?.games?.[0]?.selections;
			if (!firstGame) return false;

			// Check if the opponent is seed 1
			const opponent = firstGame.find((s) => s?.entrant?.name && !aliasesSet.has(s?.entrant?.name));
			if (!opponent) return false;
			if (opponent.entrant?.checkInSeed?.seedNum !== 1) return false;
			return true;
		})
		.filter(Boolean).length;

	// 2. Back from the Dead
	const backFromTheDead = undefined;

	// 3. Upset King
	const upsetKing = upsets.count.inflicted;

	/**
	 * 4. Defender - "Never lost to a lower seed in a tournament"
	 *
	 * NOTE: Only applicable for the entire tournament and not all sets (this would be less impressive)
	 */
	const defender = events
		.map((e) => {
			// Only get the 1st set to get the set result and seed info
			const set = e?.userEntrant?.paginatedSets?.nodes?.filter(
				(set) =>
					set?.phaseGroup?.bracketType === 'DOUBLE_ELIMINATION' ||
					set?.phaseGroup?.bracketType === 'SINGLE_ELIMINATION'
			)?.[0];
			if (!set) return false;

			// Parse match score
			const displayScore = set?.displayScore;
			if (!displayScore) return false;
			const parsedScore = parseMatch(displayScore);
			if (parsedScore === 'DQ') return false;

			// Get each player's score
			const playerIndex = parsedScore.findIndex((p) => aliasesSet.has(p.name));
			if (playerIndex === -1) return false;
			const opponentIndex = playerIndex === 0 ? 1 : 0;
			const playerScore = parsedScore[playerIndex].score;
			const opponentScore = parsedScore[opponentIndex].score;

			// Get each player's seed
			const firstGame = set?.games?.[0]?.selections;
			if (!firstGame) return false;
			const entrants = firstGame.flatMap((s) => s?.entrant);
			if (!entrants) return false;
			const playerSeed = entrants.find((e) => e?.name && aliasesSet.has(e.name))?.checkInSeed
				?.seedNum;
			const opponentSeed = entrants.find((e) => e?.name && !aliasesSet.has(e.name))?.checkInSeed
				?.seedNum;
			if (!playerSeed || !opponentSeed) return false;

			// Check if the player won and against a lower seed
			return playerScore > opponentScore && playerSeed < opponentSeed;
		})
		.filter(Boolean).length;

	// 5. Top 8 Finisher
	const top8Finisher = playerTops.top1 + playerTops.top4 + playerTops.top8;

	// 6. The Comeback kid
	const comebackKid = undefined;

	// 7. The regular
	const theRegular = undefined;

	// 8. The underdog
	const underdog = setsWithFirstGameSelection.filter((set) => {
		const displayScore = set?.displayScore;
		if (!displayScore) return false;

		const parsedScore = parseMatch(displayScore);
		if (parsedScore === 'DQ') return false;

		const playerIndex = parsedScore.findIndex((p) => aliasesSet.has(p.name));
		if (playerIndex === -1) return false;

		// Check if the player is placed 1 while been seed 8+
		const playerSeedInfo = set?.firstGame?.find(
			(selection) => selection?.entrant?.name && aliasesSet.has(selection?.entrant?.name)
		)?.entrant?.checkInSeed;
		return playerSeedInfo?.seedNum === 1 && playerSeedInfo?.seedNum >= 8;
	}).length;

	// 9 GlobeTrotter
	const globeTrotter = new Set(tournaments.map((t) => t.countryCode).filter(notNullNorUndefined))
		.size;

	// 10. Killing Machine
	const killingMachine = undefined;

	return json({
		achievemts: {
			throneBreaker,
			backFromTheDead,
			upsetKing,
			defender,
			top8Finisher,
			comebackKid,
			theRegular,
			underdog,
			globeTrotter,
			killingMachine
		},
		me: player,
		recurringOpponents,
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

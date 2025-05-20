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
	isPerfectRun,
	notNullNorUndefined,
	numberOfTops,
	parseMatch,
	whoReversedSweep,
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
		startAt: e?.startAt,
		numEntrants: e?.numEntrants
	}));
	const tournamentsStartAt = tournaments.map((t) => t.startAt).filter(notNullNorUndefined);
	const tournamentsByMonth = aggregateByMonth(tournamentsStartAt);

	// Get the tournaments with the most entrants
	const tournamentsWithMostEntrants = tournaments
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

	// Selections
	const selections = games.reduce(
		(accGame, game) => {
			// Map selection
			if (game.stage?.name)
				accGame.maps.set(game.stage.name, (accGame.maps.get(game.stage.name) ?? 0) + 1);

			// Character selections
			game.selections?.forEach((selection) => {
				if (!selection?.entrant?.name) return;
				if (!selection.character?.name) return;
				const isPlayer = aliasesSet.has(selection.entrant.name);
				const characterName = selection.character.name;

				const target = isPlayer ? accGame.charactersPlayed : accGame.charactersPlayedAgainst;
				target.set(characterName, (target.get(characterName) ?? 0) + 1);
			});
			return accGame;
		},
		{
			maps: new Map<string, number>(),
			charactersPlayed: new Map<string, number>(),
			charactersPlayedAgainst: new Map<string, number>()
		}
	);
	// Most played maps
	const mapsPlayedTop3 = [...selections.maps.entries()]
		.sort((a, b) => b[1] - a[1])
		.map(([name, count]) => ({
			name,
			count
		}))
		.slice(0, 3);

	// Most played characters
	const charactersPlayedTop3 = [...selections.charactersPlayed.entries()]
		.sort((a, b) => b[1] - a[1])
		.map(([name, count]) => ({
			name,
			count
		}))
		.slice(0, 3);

	// Top 3 characters played against
	const charactersPlayedAgainstTop3 = [...selections.charactersPlayedAgainst.entries()]
		.sort((a, b) => b[1] - a[1])
		.map(([name, count]) => ({
			name,
			count
		}))
		.slice(0, 3);

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

	// Number of reverse sweeps inflicted and received
	const reverseSweeps = events.reduce(
		(acc, e) => {
			const sets = e?.userEntrant?.paginatedSets?.nodes;
			if (!sets) return acc;

			const playerEntrantId = e.userEntrant?.id;
			const opponentEntrantId = sets[0]?.games?.[0]?.selections?.find(
				(selection) => selection?.entrant?.id !== playerEntrantId
			)?.entrant?.id;
			const winnerIds = sets.map((set) => String(set?.winnerId));

			if (!playerEntrantId || !opponentEntrantId || !winnerIds) return acc;

			const reverseSweepPerson = whoReversedSweep(playerEntrantId, opponentEntrantId, winnerIds);
			if (reverseSweepPerson === 'player') acc.inflicted += 1;
			else if (reverseSweepPerson === 'opponent') acc.received += 1;

			return acc;
		},
		{
			inflicted: 0,
			received: 0
		}
	);

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

	// 6. Game 4 MKLeo
	const game4MKLeo = reverseSweeps.inflicted;

	// 7. The underdog
	const underdog = setsWithFirstGameSelection.reduce((count, set) => {
		if (!set.displayScore) return count;
		const parsedScore = parseMatch(set.displayScore);
		if (parsedScore === 'DQ') return count;

		const playerIndex = parsedScore.findIndex((p) => aliasesSet.has(p.name));
		if (playerIndex === -1) return count;

		const playerSeedInfo = set?.firstGame?.find(
			(selection) => selection?.entrant?.name && aliasesSet.has(selection?.entrant?.name)
		)?.entrant?.checkInSeed;

		return playerSeedInfo?.seedNum === 1 && playerSeedInfo?.seedNum >= 8 ? count + 1 : count;
	}, 0);

	// 8 GlobeTrotter
	const globeTrotter = new Set(tournaments.map((t) => t.countryCode).filter(notNullNorUndefined))
		.size;

	// 9. Perfect Run
	const perfectRun = events
		.filter((e) =>
			// Perfect run only applies to double elimination brackets
			e?.userEntrant?.paginatedSets?.nodes?.some(
				(set) => set?.phaseGroup?.bracketType === 'DOUBLE_ELIMINATION'
			)
		)
		.map((e) => {
			const placement = e?.userEntrant?.checkInSeed?.placement;
			const roundTexts = e?.userEntrant?.paginatedSets?.nodes
				?.map((set) => set?.fullRoundText)
				.filter(notNullNorUndefined);
			if (!placement || !roundTexts) return false;

			return isPerfectRun(roundTexts, placement);
		})
		.filter(Boolean).length;

	return json({
		achievements: {
			throneBreaker,
			backFromTheDead,
			upsetKing,
			defender,
			top8Finisher,
			game4MKLeo,
			underdog,
			globeTrotter,
			perfectRun
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
			reverseSweeps,
			tops: playerTops
		},
		raw: events
	});
};

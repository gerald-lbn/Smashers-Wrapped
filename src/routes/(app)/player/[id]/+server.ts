import { parseMatch } from '$lib/start.gg/helper';
import {
	WrappedSelections,
	WrappedSets,
	WrappedTournamentsAndSetsOnStream
} from '$lib/start.gg/queries';
import client from '$lib/start.gg/start.gg';
import { json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
	const playerId = params.id;
	const res = await client.query(WrappedTournamentsAndSetsOnStream, {
		playerId,
		videoGameId: '1386'
	});

	const thisYear = 2024;
	const tournamentsThisYear =
		res.data?.player?.user?.tournaments?.nodes
			?.filter((tournament) => {
				if (!tournament?.startAt) return false;
				const year = new Date(parseInt(tournament.startAt) * 1000).getFullYear();
				return year === thisYear;
			})
			.filter((tournament) => tournament !== null) || [];

	// Tournaments attended
	const onlineTournaments = tournamentsThisYear.filter(
		(tournament) => tournament?.hasOnlineEvents && !tournament?.hasOfflineEvents
	);
	const offlineTournaments = tournamentsThisYear.filter(
		(tournament) => tournament?.hasOfflineEvents
	);

	const tournamentsPerMonth = Array.from({ length: 12 }, (_, i) => {
		const month = i + 1;
		return {
			month,
			total: tournamentsThisYear.filter((tournament) => {
				if (!tournament?.startAt) return false;

				const tournamentDate = new Date(parseInt(tournament.startAt) * 1000);
				const tournamentMonth = tournamentDate.getMonth() + 1;
				return tournamentMonth === month;
			}).length
		};
	});

	const tournamentWithMostAttendees = offlineTournaments.reduce(
		(previousTournament, tournament) => {
			if ((tournament.numAttendees ?? 0) > (previousTournament.numAttendees ?? 0)) {
				return tournament;
			}
			return previousTournament;
		},
		offlineTournaments[0] ?? {}
	);

	// Cities and countries visited by the player
	const citiesAttended = offlineTournaments
		.map((tournament) => tournament?.city)
		.filter((city) => city !== null);
	const citiesCount = citiesAttended.reduce(
		(acc, city) => {
			acc[city] = (acc[city] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>
	);
	const countriesAttended = offlineTournaments
		.map((tournament) => tournament?.countryCode)
		.filter((country) => country !== null);
	const countriesCount = countriesAttended.reduce(
		(acc, country) => {
			acc[country] = (acc[country] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>
	);

	// Sets on stream
	const setsOnStream = res.data?.player?.sets?.pageInfo?.total ?? 0;

	const offlineTournamentsIds = offlineTournaments
		.map((tournament) => tournament.id)
		.filter((id) => id !== null);

	const resSets1stPage = await client.query(WrappedSets, {
		playerId,
		tournamentsIds: offlineTournamentsIds,
		page: 1,
		perPage: 50
	});

	const recurringOpponents = {} as Record<
		string,
		{
			name: string;
			count: number;
		}
	>;

	const totalPages = resSets1stPage.data?.player?.sets?.pageInfo?.totalPages ?? 0;

	// Fetch all sets pages
	const allPagesPromises = Array.from({ length: totalPages - 1 }, (_, i) => {
		return client.query(WrappedSets, {
			playerId,
			tournamentsIds: offlineTournamentsIds,
			page: i + 2,
			perPage: 50
		});
	});

	const allPagesResults = await Promise.all(allPagesPromises);
	let shutoutsDealt = 0;
	// Used later to get the player's selections
	const playerEntrantIds = [] as string[];

	// Process all sets from all pages
	allPagesResults.forEach((page) => {
		page.data?.player?.sets?.nodes?.forEach((set) => {
			const winnerId = set?.winnerId;
			if (!winnerId) return;

			if (!set.game) return;
			if (!set.game.selections) return;

			const opponent = set.game.selections.find((selection) => {
				const participants = selection?.entrant?.participants;
				if (!participants) return false;
				return !participants.map((p) => String(p?.player?.id)).includes(playerId);
			});

			const playerEntrant = set.game.selections.find((selection) => {
				const participants = selection?.entrant?.participants;
				if (!participants) return false;
				return participants.map((p) => String(p?.player?.id)).includes(playerId);
			});

			if (playerEntrant && playerEntrant.entrant && playerEntrant.entrant.id)
				playerEntrantIds.push(playerEntrant.entrant.id);

			if (!opponent) return;
			if (!opponent.entrant) return;
			if (!opponent.entrant.participants) return;
			if (opponent.entrant.participants.length > 1) return;
			if (!opponent.entrant.participants[0]?.player) return;

			const opponentPlayerId = opponent.entrant.participants[0].player.id;
			if (!opponentPlayerId) return;

			const prefix = opponent.entrant.participants[0].player.prefix;
			const gamerTag = opponent.entrant.participants[0].player.gamerTag;

			const name = prefix ? `${prefix} ${gamerTag}` : (gamerTag as string);

			if (!recurringOpponents[opponentPlayerId]) {
				recurringOpponents[opponentPlayerId] = {
					name,
					count: 0
				};
			}

			recurringOpponents[opponentPlayerId].count++;

			// Check for shutouts
			if (!set.displayScore) return;
			const score = parseMatch(set.displayScore);
			if (score === 'DQ') return;

			const opponentScore = score.find((s) => s.name === name);
			if (!opponentScore) return;

			if (opponentScore.score === 0) shutoutsDealt++;
		});
	});

	// Sort recurring opponents by count
	const sortedRecurringOpponents = Object.entries(recurringOpponents)
		.sort(([, a], [, b]) => b.count - a.count)
		.map(([id, data]) => ({
			id,
			...data
		}))
		.slice(0, 3);

	/********************** Selections **********************/
	const playedStages = {} as Record<string, number>;
	const characters = {} as Record<string, number>;
	const resSelections1stPage = await client.query(WrappedSelections, {
		playerId,
		tournamentsIds: offlineTournamentsIds,
		page: 1,
		perPage: 50
	});

	const totalPagesSelections = resSelections1stPage.data?.player?.sets?.pageInfo?.totalPages ?? 0;
	const allSelectionsPromises = Array.from({ length: totalPagesSelections - 1 }, (_, i) => {
		return client.query(WrappedSelections, {
			playerId,
			tournamentsIds: offlineTournamentsIds,
			page: i + 2,
			perPage: 50
		});
	});

	const allSelectionsResults = await Promise.all(allSelectionsPromises);

	// Process all selections from all pages
	allSelectionsResults.forEach((page) => {
		page.data?.player?.sets?.nodes?.forEach((set) => {
			const games = set?.games;
			if (!games) return;

			games.forEach((game) => {
				// Add the stage to the playedStages
				if (!game?.stage) return;
				if (!game.stage.name) return;

				playedStages[game.stage.name] = (playedStages[game.stage.name] || 0) + 1;

				const playerSelection = game.selections?.find((selection) => {
					if (!selection) return false;
					if (!selection.entrant) return false;
					if (!selection.entrant.id) return false;
					return playerEntrantIds.includes(selection.entrant.id);
				});
				if (playerSelection) {
					const character = playerSelection.character;
					if (!character) return;
					if (!character.name) return;

					characters[character.name] = (characters[character.name] || 0) + 1;
				}
			});
		});
	});

	return json({
		player: {
			id: res.data?.player?.id,
			name: res.data?.player?.prefix
				? `${res.data.player.prefix} | ${res.data.player.gamerTag}`
				: res.data?.player?.gamerTag,
			image: res.data?.player?.user?.images?.[0]?.url,
			selection: {
				stages: playedStages,
				characters
			},
			achievements: {
				shutoutsDealt
			}
		},
		tournament: {
			cities: citiesCount,
			countries: countriesCount,
			perMonth: tournamentsPerMonth,
			mostAttendees: tournamentWithMostAttendees,
			total: tournamentsThisYear.length,
			online: onlineTournaments.length,
			offline: offlineTournaments.length
		},
		set: {
			total: resSets1stPage.data?.player?.sets?.pageInfo?.total ?? 0,
			setsOnStream,
			recurringOpponents: sortedRecurringOpponents
		}
	});
};

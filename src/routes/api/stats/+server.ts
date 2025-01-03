import client from '$lib/start.gg';
import { json } from '@sveltejs/kit';
import { WrappedSets, WrappedTournamentsAndSetsOnStream } from './queries';

export const GET = async () => {
	const playerId = '1960701';
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

	const setsOnStream = res.data?.player?.sets?.pageInfo?.total ?? 0;

	const offlineTournamentsIds = offlineTournaments
		.map((tournament) => tournament.id)
		.filter((id) => id !== null);

	console.log('Tournaments this year:', tournamentsThisYear.length);
	console.log('Online tournaments:', onlineTournaments.length);
	console.log('Offline tournaments:', offlineTournaments.length);
	console.log('Tournaments per month:', tournamentsPerMonth);
	console.log('Tournament with most attendees:', tournamentWithMostAttendees);
	console.log('Cities attended:');
	console.table({ ...citiesCount });
	console.log('Countries attended:');
	console.table({ ...countriesCount });
	console.log('Sets on stream:', setsOnStream);

	console.log('********************************************');

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

	// Fetch all pages in parallel
	const allPagesPromises = Array.from({ length: totalPages - 1 }, (_, i) => {
		return client.query(WrappedSets, {
			playerId,
			tournamentsIds: offlineTournamentsIds,
			page: i + 2,
			perPage: 50
		});
	});

	const allPagesResults = await Promise.all(allPagesPromises);

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

	console.log('Number of sets this year:', resSets1stPage.data?.player?.sets?.pageInfo?.total ?? 0);
	console.log('Top 3 recurring opponents:');
	console.table(sortedRecurringOpponents);
	console.log('');

	return json({
		res: {
			...res
		},
		resSets1stPage: {
			...resSets1stPage
		},
		allPagesResults,
		ids: offlineTournamentsIds
	});
};

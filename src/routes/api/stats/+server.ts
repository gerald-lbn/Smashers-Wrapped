import client from '$lib/start.gg';
import { json } from '@sveltejs/kit';
import { WrappedTournamentsAndSetsOnStream } from './queries';

export const GET = async () => {
	const id = '1960701';
	const res = await client.query(WrappedTournamentsAndSetsOnStream, {
		playerId: id,
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

	return json({
		...res
	});
};

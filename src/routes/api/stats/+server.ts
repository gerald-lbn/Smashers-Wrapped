import { json } from '@sveltejs/kit';
import {
	GetPaginatedTournamentsEvents,
	GetPaginatedTournamentsEventsQuery,
	GetTournamentsEventsPageInfo,
	GetTournamentsEventsPageInfoQuery,
	SearchPlayerByGamerTag,
	SearchPlayerByGamerTagQuery
} from '$lib/start.gg/queries';
import { getDataFromStartGG } from '$lib/start.gg/start.gg';
import {
	aggregateByMonth,
	countOccurrences,
	notNullNorUndefined,
	unixToDate
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
	const { data: eventsPageInfoData } = await getDataFromStartGG<
		typeof GetTournamentsEventsPageInfo
	>(GetTournamentsEventsPageInfoQuery, {
		userID: player.user!.id!
	});
	const eventsPageInfo = eventsPageInfoData.user?.events?.pageInfo;
	if (!eventsPageInfo)
		return json({
			error: 'No events page info found'
		});

	// TODO: Filter events by year to prevent fetching all events
	const pages = eventsPageInfo.totalPages as number;
	const eventsPromises = Array.from({ length: pages }).map((_, index) => {
		return getDataFromStartGG<typeof GetPaginatedTournamentsEvents>(
			GetPaginatedTournamentsEventsQuery,
			{
				userID: player.user!.id!,
				page: index + 1
			}
		);
	});
	const eventsData = await Promise.all(eventsPromises);
	const events = eventsData
		.flatMap((events) => events.data.user?.events?.nodes || [])
		.filter((e) => {
			if (!e || !e.startAt) return false;
			const startAt = parseInt(e.startAt);
			const eventDate = unixToDate(startAt);
			return eventDate.getFullYear() === thisYear;
		});

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

	// Most played maps
	const mapsPlayed = events
		.flatMap((e) => e?.userEntrant?.paginatedSets?.nodes ?? [])
		.flatMap((set) => set?.games ?? [])
		.map((game) => game?.stage?.name)
		.filter((name) => name !== null && name !== undefined);
	const mapsPlayedCount = countOccurrences(mapsPlayed);
	const mapsPlayedTop3 = Object.entries(mapsPlayedCount)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 3)
		.map(([name, count]) => ({
			name,
			count
		}));

	// Most played characters
	const charactersPlayed = events
		.flatMap((e) => e?.userEntrant?.paginatedSets?.nodes ?? [])
		.flatMap((set) => set?.games ?? [])
		.flatMap((game) => game?.selections ?? [])
		.filter((selection) => selection?.entrant?.name && aliasesSet.has(selection?.entrant?.name))
		.map((selection) => selection?.character?.name)
		.filter((name) => name !== null && name !== undefined);
	const charactersPlayedCount = countOccurrences(charactersPlayed);
	const charactersPlayedTop3 = Object.entries(charactersPlayedCount)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 3)
		.map(([name, count]) => ({
			name,
			count
		}));

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
			}
		},
		raw: events
	});
};

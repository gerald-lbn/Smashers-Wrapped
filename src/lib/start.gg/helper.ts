import {
	GetPaginatedTournamentsEvents,
	GetPaginatedTournamentsEventsQuery,
	GetTournamentsEventsPageInfoQuery,
	type GetTournamentsEventsPageInfo
} from './queries';
import { getDataFromStartGG } from './start.gg';

export type ParsedMatch = {
	name: string;
	score: number;
}[];

/**
 * Parse the display score from the match
 * @param match A string containing the match score (e.g. "ARK | Licane 1 - PNS | Clembs 2" or "DQ")
 * @returns An array of objects containing the player name and score (e.g. [{ name: 'ARK | Licane', score: 1 }, { name: 'PNS | Clembs', score: 2 }] or 'DQ')
 */
export const parseMatch = (match: string): ParsedMatch | 'DQ' => {
	if (match.match(/^DQ$/)) return 'DQ';

	const parts = match.split(' - ');
	return parts.map((part) => {
		part = part.trim();
		const lastSpaceIndex = part.lastIndexOf(' ');

		const name = part.slice(0, lastSpaceIndex);
		const score = parseInt(part.slice(lastSpaceIndex + 1, part.length), 10);

		return {
			name,
			score
		};
	});
};

export const characterNameToSlug = (name: string) => {
	switch (name) {
		case 'Banjo-Kazooie':
			return 'banjo';
		case 'Bayonetta':
			return 'bayonetta';
		case 'Bowser':
			return 'bowser';
		case 'Bowser Jr.':
			return 'bowser_jr';
		case 'Byleth':
			return 'byleth';
		case 'Captain Falcon':
			return 'captain_falcon';
		case 'Chrom':
			return 'chrom';
		case 'Cloud':
			return 'cloud';
		case 'Corrin':
			return 'corrin';
		case 'Daisy':
			return 'daisy';
		case 'Dark Pit':
			return 'dark_pit';
		case 'Dark Samus':
			return 'dark_samus';
		case 'Diddy Kong':
			return 'diddy';
		case 'Donkey Kong':
			return 'donkey_kong';
		case 'Dr. Mario':
			return 'dr_mario';
		case 'Duck Hunt':
			return 'duckhunt';
		case 'Falco':
			return 'falco';
		case 'Fox':
			return 'fox';
		case 'Ganondorf':
			return 'ganon';
		case 'Greninja':
			return 'greninja';
		case 'Hero':
			return 'hero';
		case 'Ice Climbers':
			return 'ice_climbers';
		case 'Ike':
			return 'ike';
		case 'Incineroar':
			return 'incineroar';
		case 'Inkling':
			return 'inkling';
		case 'Isabelle':
			return 'isabelle';
		case 'Jigglypuff':
			return 'jigglypuff';
		case 'Joker':
			return 'joker';
		case 'Kazuya':
			return 'kazuya';
		case 'Ken':
			return 'ken';
		case 'King Dedede':
			return 'king_dedede';
		case 'King K. Rool':
			return 'krool';
		case 'Kirby':
			return 'kirby';
		case 'Link':
			return 'link';
		case 'Little Mac':
			return 'little_mac';
		case 'Lucario':
			return 'lucario';
		case 'Lucas':
			return 'lucas';
		case 'Lucina':
			return 'lucina';
		case 'Luigi':
			return 'luigi';
		case 'Mario':
			return 'mario';
		case 'Marth':
			return 'marth';
		case 'Mega Man':
			return 'megaman';
		case 'Meta Knight':
			return 'meta_knight';
		case 'Mewtwo':
			return 'mewtwo';
		case 'Mii Brawler':
			return 'mii_brawler';
		case 'Mii Gunner':
			return 'mii_gunner';
		case 'Mii Swordfighter':
			return 'mii_swordman';
		case 'Min Min':
			return 'minmin';
		case 'Mr. Game & Watch':
			return 'mr_game_&_watch';
		case 'Ness':
			return 'ness';
		case 'Olimar':
			return 'olimar';
		case 'Pacman':
			return 'pacman';
		case 'Palutena':
			return 'palutena';
		case 'Peach':
			return 'peach';
		case 'Pichu':
			return 'pichu';
		case 'Pikachu':
			return 'pikachu';
		case 'Piranha Plant':
			return 'piranha_plant';
		case 'Pit':
			return 'pit';
		case 'Pokémon Trainer':
			return 'pokemon_trainer';
		case 'Pyra/Mythra':
			return 'pyra_mythra';
		case 'Richter':
			return 'richter';
		case 'Ridley':
			return 'ridley';
		case 'R.O.B.':
			return 'rob';
		case 'Robin':
			return 'robin';
		case 'Rosalina & Luma':
			return 'rosalina';
		case 'Roy':
			return 'roy';
		case 'Ryu':
			return 'ryu';
		case 'Samus':
			return 'samus';
		case 'Sephiroth':
			return 'sephiroth';
		case 'Sheik':
			return 'sheik';
		case 'Shulk':
			return 'shulk';
		case 'Simon':
			return 'simon';
		case 'Snake':
			return 'snake';
		case 'Sonic':
			return 'sonic';
		case 'Sora':
			return 'sora';
		case 'Steve':
			return 'steve';
		case 'Terry':
			return 'terry';
		case 'Toon Link':
			return 'toon_link';
		case 'Villager':
			return 'villager';
		case 'Wario':
			return 'wario';
		case 'Wii Fit Trainer':
			return 'wii_fit';
		case 'Wolf':
			return 'wolf';
		case 'Yoshi':
			return 'yoshi';
		case 'Young Link':
			return 'young_link';
		case 'Zelda':
			return 'zelda';
		case 'Zero Suit Samus':
			return 'zss';
		default:
			return '';
	}
};

/**
 * Convert a Unix timestamp to a Date object
 * @param unix Unix timestamp in seconds
 * @returns A Date object representing the date and time corresponding to the Unix timestamp.
 */
export const unixToDate = (unix: number) => new Date(unix * 1000);

/**
 * Given an array of dates, counts the number of occurrences of each month and returns an
 * object with the month names as keys and the counts as values.
 */
export function aggregateByMonth(startAt: string[]) {
	const monthCounts: { [key: string]: number } = {};
	const monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	startAt.forEach((date) => {
		const tournamentDate = unixToDate(parseInt(date));
		const monthName = monthNames[tournamentDate.getMonth()];
		if (monthCounts[monthName]) {
			monthCounts[monthName]++;
		} else {
			monthCounts[monthName] = 1;
		}
	});

	return monthCounts;
}

export const countOccurrences = (items: string[]) => {
	return items.reduce((acc: { [key: string]: number }, item) => {
		acc[item] = (acc[item] || 0) + 1;
		return acc;
	}, {});
};

export const notNullNorUndefined = <T>(value: T | null | undefined) => {
	return value !== null && value !== undefined;
};

/**
 * Given a user ID and a year, fetches all events for that user in the specified year.
 * It retrieves the page info to determine the total number of pages and then fetches
 * each page of events until it reaches events from previous years.
 * @param userId The ID of the user whose events to fetch.
 * @param year The year for which to fetch events.
 * @returns An array of events for the specified user in the specified year.
 */
export const getThisYearEvents = async (userId: string, year: number) => {
	// Get page info
	const { data: eventsPageInfoData } = await getDataFromStartGG<
		typeof GetTournamentsEventsPageInfo
	>(GetTournamentsEventsPageInfoQuery, {
		userID: userId
	});

	const pages = eventsPageInfoData.user?.events?.pageInfo?.totalPages;
	if (!pages) return [];

	const events = [];
	let shouldContinue = true;

	for (let page = 1; page <= pages && shouldContinue; page++) {
		const { data } = await getDataFromStartGG<typeof GetPaginatedTournamentsEvents>(
			GetPaginatedTournamentsEventsQuery,
			{
				userID: userId,
				page: page
			}
		);

		const pageEvents = data.user?.events?.nodes || [];

		// Check if we have reached events from previous years
		const hasOldEvents = pageEvents.some((e) => {
			if (!e?.startAt) return false;
			const startAt = parseInt(e.startAt);
			const eventDate = unixToDate(startAt);
			return eventDate.getFullYear() < year;
		});

		// Filter events from this year
		const thisYearEvents = pageEvents.filter((e) => {
			if (!e?.startAt) return false;
			const startAt = parseInt(e.startAt);
			const eventDate = unixToDate(startAt);
			return eventDate.getFullYear() === year;
		});

		events.push(...thisYearEvents);

		// If we have reached events from previous years, stop fetching more pages
		if (hasOldEvents) shouldContinue = false;
	}

	return events;
};

export const getTop3Occurrences = (items: (string | undefined | null)[]) => {
	const filtered = items.filter((item) => item !== null && item !== undefined);
	const counts = countOccurrences(filtered);
	return Object.entries(counts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 3)
		.map(([name, count]) => ({
			name,
			count
		}));
};

/**
 * Compute the number of Rounds From Victory in a single-elimination bracket.
 * @see https://www.pgstats.com/articles/spr-uf-extra-mathematical-details
 * @see https://www.pgstats.com/articles/introducing-spr-and-uf
 * @param placement - The final placement of the player (1 = 1st place)
 * @returns The number of rounds from victory
 */
export const singleBracketRoundsFromVictory = (placement: number) => {
	return Math.ceil(Math.log2(placement));
};

/**
 * Compute the number of Rounds From Victory in a double-elimination bracket.
 * @see https://www.pgstats.com/articles/spr-uf-extra-mathematical-details
 * @see https://www.pgstats.com/articles/introducing-spr-and-uf
 * @param placement - The final placement of the player (1 = 1st place)
 * @returns The number of rounds from victory
 */
export const doubleBracketRoundsFromVictory = (placement: number) => {
	if (placement === 1) return 0;
	return Math.floor(Math.log2(placement - 1)) + Math.ceil(Math.log2((2 / 3) * placement));
};

export type BracketType = 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION';

/**
 * Measures a player's performance in a bracket relative to their seed.
 * A positive value indicates that the player performed better than expected,
 * while a negative value indicates that the player performed worse than expected.
 * @see https://www.pgstats.com/articles/introducing-spr-and-uf
 * @param seed - The seed of the player
 * @param placement - The final placement of the player (1 = 1st place)
 * @param bracket - The type of bracket (single or double elimination)
 */
export const seedingPerformanceRating = (seed: number, placement: number, bracket: BracketType) => {
	const expectedRFV =
		bracket === 'SINGLE_ELIMINATION'
			? singleBracketRoundsFromVictory(seed)
			: doubleBracketRoundsFromVictory(seed);

	const actualRFV =
		bracket === 'SINGLE_ELIMINATION'
			? singleBracketRoundsFromVictory(placement)
			: doubleBracketRoundsFromVictory(placement);

	return expectedRFV - actualRFV;
};

/**
 * Calculates the upset factor for a match between two players.
 * @param playerSeed - The seed of the player
 * @param opponentSeed - The seed of the opponent
 * @param bracket - The type of bracket (single or double elimination)
 */
export const upsetFactor = (playerSeed: number, opponentSeed: number, bracket: BracketType) => {
	const playerRFV =
		bracket === 'SINGLE_ELIMINATION'
			? singleBracketRoundsFromVictory(playerSeed)
			: doubleBracketRoundsFromVictory(playerSeed);

	const opponentRFV =
		bracket === 'SINGLE_ELIMINATION'
			? singleBracketRoundsFromVictory(opponentSeed)
			: doubleBracketRoundsFromVictory(opponentSeed);

	return playerRFV - opponentRFV;
};

/**
 * Computes the number of shutouts given and taken by a player.
 * @param matches - An array of matches, each match is an array of players with their scores
 * @param aliases - A set of aliases for the player
 * @returns An object containing the number of shutouts given and taken
 */
export const computeShutouts = (matches: (ParsedMatch | 'DQ')[], aliases: Set<string>) => {
	const matchesWithoutDQ = matches.filter((match) => match !== 'DQ');
	const shutouts = matchesWithoutDQ.reduce(
		(acc, player) => {
			const playerIndex = player.findIndex((p) => aliases.has(p.name));
			if (playerIndex === -1) return acc;

			const otherPlayerScore = player[(playerIndex + 1) % 2].score;
			const playerScore = player[playerIndex].score;

			return {
				taken: acc.taken + (playerScore === 0 ? 1 : 0),
				given: acc.given + (otherPlayerScore === 0 ? 1 : 0)
			};
		},
		{ taken: 0, given: 0 }
	);

	return shutouts;
};

export type UserEntrantRecord = {
	wins: number;
	losses: number;
};

export const computeWinrateInfo = (userRecords: UserEntrantRecord[]) => {
	const numberOfWins = userRecords.reduce((acc, record) => acc + record.wins, 0);
	const numberOfLosses = userRecords.reduce((acc, record) => acc + record.losses, 0);
	const winrate = Math.round((numberOfWins / (numberOfLosses + numberOfWins)) * 100);

	return {
		numberOfWins,
		numberOfLosses,
		winrate
	};
};

/**
 * Get a unique set of aliases used by the player
 * @param entrantNames Names used by the player
 * @returns A set of unique aliases
 */
export const getUserAliases = (entrantNames: (string | null | undefined)[]) => {
	const aliases = entrantNames.filter(notNullNorUndefined);
	const aliasesSet = new Set(aliases);

	return aliasesSet;
};

type MinimalSetInfo = {
	firstGame:
		| ({
				entrant:
					| {
							id: string | null | undefined;
							name: string | null | undefined;
							checkInSeed:
								| {
										seedNum: number | null | undefined;
								  }
								| null
								| undefined;
					  }
					| null
					| undefined;
		  } | null)[]
		| null
		| undefined;
	winnerId: number | null;
	phaseGroup:
		| {
				bracketType: string | null;
		  }
		| null
		| undefined;
	displayScore: string | null | undefined;
};

export const computeUpsets = (sets: MinimalSetInfo[], aliases: Set<string>) => {
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

	/**
	 * Only consider sets with a bracket type of SINGLE_ELIMINATION or DOUBLE_ELIMINATION
	 * because they are the only ones where the initial seed matters. (I think)
	 */
	sets
		.filter(
			(set) =>
				set.phaseGroup?.bracketType === 'SINGLE_ELIMINATION' ||
				set.phaseGroup?.bracketType === 'DOUBLE_ELIMINATION'
		)
		.forEach((set) => {
			// Search for the player in the set
			const playerIndex = set.firstGame?.findIndex((p) => aliases.has(p?.entrant?.name || ''));
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

	return upsets;
};

/**
 * Counts the amount of times a player has placed in the top 1, 4, 8
 */
export const numberOfTops = (placements: number[]) => {
	const tops = {
		top1: 0,
		top4: 0,
		top8: 0
	};

	placements.forEach((placement) => {
		if (placement === 1) tops.top1++;
		if (placement <= 4) tops.top4++;
		if (placement <= 8) tops.top8++;
	});

	return tops;
};

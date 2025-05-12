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

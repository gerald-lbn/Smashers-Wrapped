/**
 * Parse the display score from the match
 * @param match A string containing the match score (e.g. "ARK | Licane 1 - PNS | Clembs 2" or "DQ")
 * @returns An array of objects containing the player name and score (e.g. [{ name: 'ARK | Licane', score: 1 }, { name: 'PNS | Clembs', score: 2 }] or 'DQ')
 */
export const parseMatch = (match: string) => {
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

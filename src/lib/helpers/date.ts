type Week = {
	start: number;
	end: number;
	dates: number[];
};

/**
 * Given a year and month, calculate the 1st day, last day, and all days in between for each week.
 * @param year The year to calculate weeks for.
 * @param month The month to calculate weeks for.
 */
export const calculateWeeksInMonth = (year: number, month: number): Week[] => {
	const weeks: number[][] = [];
	const firstDate = new Date(year, month, 1);
	const lastDate = new Date(year, month + 1, 0);
	const numDays = lastDate.getDate();

	let dayOfWeekCounter = firstDate.getDay();

	for (let date = 1; date <= numDays; date++) {
		if (dayOfWeekCounter === 0 || weeks.length === 0) {
			weeks.push([]);
		}
		weeks[weeks.length - 1].push(date);
		dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;
	}

	return weeks.map((week) => ({
		start: week[0],
		end: week[week.length - 1],
		dates: week
	}));
};

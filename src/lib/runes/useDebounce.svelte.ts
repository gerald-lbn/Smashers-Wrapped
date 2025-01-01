/**
 * Creates a debounced version of an input value, only updating after a specified delay of inactivity.
 * Also provides a loading state for use while the value updates.

 * @param initialValue The initial value to debounce.
 * @param delay The delay in milliseconds to wait before updating the value.
 */

export const useDebounce = <T>(initialValue: T, delay: number = 250) => {
	let timeout = $state<NodeJS.Timeout | null>(null);
	let value = $state(initialValue);
	let loading = $state<boolean>(false);

	const update = (newValue: T) => {
		if (timeout) clearTimeout(timeout);
		loading = true;

		timeout = setTimeout(() => {
			value = newValue;
			loading = false;
		}, delay);
	};

	return {
		get value() {
			return value;
		},
		update,
		get loading() {
			return loading;
		}
	};
};

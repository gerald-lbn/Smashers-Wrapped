export const useFetcher = <T>(initialUrl: string | URL, options?: RequestInit) => {
	let url = $state(initialUrl);
	let data = $state<T | null>(null);
	let loading = $state<boolean>(true);
	let error = $state<unknown>();

	const setLoading = (isLoading: boolean = true) => {
		loading = isLoading;
		if (isLoading === true) {
			error = null;
			data = null;
		}
	};

	const fetchData = async (): Promise<[unknown, T | null]> => {
		try {
			const res = await fetch(url, options);
			if (!res.ok) throw new Error(`Unexpected error occurred (status ${res.status})`);

			const data = await res.json();
			return [null, data];
		} catch (e) {
			return [e, null];
		}
	};

	const handleUrlChange = async (currentUrl: string | URL) => {
		setLoading(true);

		const [err, response] = await fetchData();
		if (currentUrl !== url) return;

		if (err) {
			setLoading(false);
			error = err;
			return;
		}

		setLoading(false);
		data = response;
	};

	$effect(() => {
		handleUrlChange(url);
	});

	return {
		get data() {
			return data;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		get url() {
			return url;
		},
		set url(newUrl: string | URL) {
			if (url !== newUrl) url = newUrl;
		}
	};
};

export default useFetcher;

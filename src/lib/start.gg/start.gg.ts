import type { ResultOf, TadaDocumentNode, VariablesOf } from 'gql.tada';

export async function getDataFromStartGG<T = TadaDocumentNode>(
	query: string,
	variables: VariablesOf<T>,
	init?: RequestInit
) {
	const url = `https://www.start.gg/api/-/gql?query=${encodeURIComponent(query)}&variables=${encodeURIComponent(
		JSON.stringify(variables)
	)}`;
	const response = await fetch(url, {
		method: 'GET',
		credentials: 'omit',
		mode: 'cors',
		...init
	});

	const result = await response.json();

	return result as {
		data: ResultOf<T>;
	};
}

import { initGraphQLTada } from 'gql.tada';
import type { introspection } from '../graphql-env';

export const graphql = initGraphQLTada<{
	introspection: introspection;
	scalars: {
		Boolean: boolean;
		Float: number;
		ID: string;
		Int: number;
		JSON: Record<string, unknown>;
		String: string;
		Timestamp: string;
	};
}>();

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
export { readFragment } from 'gql.tada';

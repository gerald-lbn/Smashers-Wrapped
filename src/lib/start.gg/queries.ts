import { graphql } from '$lib/graphql';

export const SearchPlayerByGamerTagQuery = `
	query SearchByGamerTag($search: PlayerQuery!) {
		players(query: $search) {
			nodes {
				gamerTag
				prefix
				user {
					slug
					location {
						country
					}
					images(type: "profile") {
						url
					}
				}
			}
		}
	}
`;
export const SearchPlayerByGamerTag = graphql(SearchPlayerByGamerTagQuery);

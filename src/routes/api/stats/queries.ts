import { graphql } from '$lib/graphql';

export const WrappedTournamentsAndSetsOnStream = graphql(`
	query WrappedTournamentsAndSetsOnStream($playerId: ID!, $videoGameId: ID!) {
		player(id: $playerId) {
			id
			gamerTag
			prefix

			sets(filters: { hasVod: true, hideEmpty: true }) {
				pageInfo {
					total
				}
			}

			user {
				id
				images(type: "profile") {
					url
					ratio
				}

				tournaments(
					query: {
						perPage: 500
						filter: { past: true, upcoming: false, videogameId: [$videoGameId] }
					}
				) {
					pageInfo {
						total
						totalPages
					}
					nodes {
						id
						name
						startAt
						hasOfflineEvents
						hasOnlineEvents
						numAttendees
						city
						countryCode
					}
				}
			}
		}
	}
`);

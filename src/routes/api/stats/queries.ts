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

export const WrappedSets = graphql(`
	query WrappedSets($playerId: ID!, $tournamentsIds: [ID!], $page: Int, $perPage: Int) {
		player(id: $playerId) {
			id

			sets(
				filters: {
					showByes: false
					tournamentIds: $tournamentsIds
					# Filtering by entrantSize to avoid showing sets with more than 2 entrants is not working
					# https://discord.com/channels/339548254704369677/504697661795074058/930881754326265907
					# entrantSize: [2]
				}
				page: $page
				perPage: $perPage
			) {
				pageInfo {
					page
					total
					totalPages
				}

				nodes {
					id
					displayScore
					winnerId

					game(orderNum: 1) {
						selections {
							entrant {
								id
								name
								initialSeedNum
								participants {
									player {
										id
										gamerTag
										prefix
									}
								}
							}
						}
					}
				}
			}
		}
	}
`);

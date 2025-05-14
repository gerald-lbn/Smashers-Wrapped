import { graphql } from '$lib/graphql';

export const SearchPlayerByGamerTagQuery = `
	query SearchByGamerTag($search: PlayerQuery!) {
		players(query: $search) {
			nodes {
				id
				gamerTag
				user {
					id
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

export const GetAuthenticatedUserQuery = `
	query GetAuthenticatedUser {
		currentUser {
			id
		}
	}
`;

export const GetTournamentsEventsPageInfoQuery = `
	query GetTournamentsEventsPageInfo($userID: ID!) {
		user(id: $userID) {
			events(
				query: { filter: { videogameId: [1386], eventType: 1 }, sortBy: "endAt DESC", perPage: 10 }
			) {
				pageInfo {
					total
					totalPages
				}
			}
		}
	}
`;
export const GetTournamentsEventsPageInfo = graphql(GetTournamentsEventsPageInfoQuery);

export const GetPaginatedTournamentsEventsQuery = `
	query GetTournamentsEvents($userID: ID!, $page: Int!) {
		user(id: $userID) {
			events(query: { filter: { videogameId: [1386], eventType: 1 }, page: $page, perPage: 10 }) {
				nodes {
					name
					numEntrants
					startAt
					tournament {
						name
						countryCode
						images(type: "profile") {
							url
						}
					}
					userEntrant(userId: $userID) {
						name
						lostTo
						record
						checkInSeed {
							placement
							seedNum
						}
						paginatedSets {
							nodes {
								displayScore
								fullRoundText
								totalGames
								games {
									stage {
										name
									}
									selections {
										entrant {
											name
										}
										character {
											name
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
`;
export const GetPaginatedTournamentsEvents = graphql(GetPaginatedTournamentsEventsQuery);

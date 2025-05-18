import { graphql } from '$lib/graphql';

export const SearchPlayerByGamerTagQuery = `
	query SearchByGamerTag($search: PlayerQuery!) {
		players(query: $search) {
			nodes {
				gamerTag
				user {
					id
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
			player {
				id
			}
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
								phaseGroup {
									bracketType
								}
								winnerId
								games {
									stage {
										name
									}
									selections {
										entrant {
											id
											name
											checkInSeed {
												placement
												seedNum
											}
											players {
												gamerTag
											}
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

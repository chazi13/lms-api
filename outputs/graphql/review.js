export const typeDef = `
type Review {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  quiz: Quiz
  token: String!
}
input ReviewFilter {
  AND: [ReviewFilter!]
  OR: [ReviewFilter!]
  id: String
  id_not: String
  id_in: [String]
  id_not_in: [String]
  id_lt: String
  id_lte: String
  id_gt: String
  id_gte: String
  id_contains: String
  id_not_contains: String
  id_starts_with: String
  id_not_starts_with: String
  id_ends_with: String
  id_not_ends_with: String
  createdBy: UserFilter
  createdBy_some: UserFilter
  createdBy_none: UserFilter
  updatedBy: UserFilter
  updatedBy_some: UserFilter
  updatedBy_none: UserFilter
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime]
  createdAt_not_in: [DateTime]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime]
  updatedAt_not_in: [DateTime]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  quiz: QuizFilter
  quiz_some: QuizFilter
  quiz_none: QuizFilter
  token: String
  token_not: String
  token_in: [String]
  token_not_in: [String]
  token_lt: String
  token_lte: String
  token_gt: String
  token_gte: String
  token_contains: String
  token_not_contains: String
  token_starts_with: String
  token_not_starts_with: String
  token_ends_with: String
  token_not_ends_with: String
}
enum ReviewOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  token_ASC
  token_DESC
}
type ReviewConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Review]
}
input CreateReviewInput {
  quizId: String
  token: String!
}
input UpdateReviewInput {
  quizId: String
  token: String
}
extend type Query {
  reviews(
    query: JSON
    where: ReviewFilter
    orderBy: ReviewOrderBy
    skip: Int
    limit: Int
  ): [Review]
  review(id: String!): Review
  reviewsConnection(
    query: JSON
    where: ReviewFilter
    orderBy: ReviewOrderBy
    skip: Int
    limit: Int
  ): ReviewConnection
}
extend type Subscription {
  reviewAdded: Review
  reviewUpdated: Review
  reviewDeleted: Review
}
extend type Mutation {
  createReview(input: CreateReviewInput): Review
  updateReview(input: UpdateReviewInput, id: String!): Review
  deleteReview(id: String!): Review
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        reviews: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.reviewRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        review: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.reviewRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        reviewsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.reviewRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Review: {
        createdBy: async ({ createdBy }, args, { headers, requester }) => {
            try {
                return await requester.userRequester.send({ type: 'get', id: createdBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        updatedBy: async ({ updatedBy }, args, { headers, requester }) => {
            try {
                return await requester.userRequester.send({ type: 'get', id: updatedBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        quiz: async ({ quizId }, args, { headers, requester }) => {
            try {
                return await requester.quizRequester.send({ type: 'get', id: quizId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        reviewAdded: {
            subscribe: () => pubSub.asyncIterator('reviewAdded')
        },
        reviewUpdated: {
            subscribe: () => pubSub.asyncIterator('reviewUpdated')
        },
        reviewDeleted: {
            subscribe: () => pubSub.asyncIterator('reviewDeleted')
        },
    },
    Mutation: {
        createReview: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.reviewRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("reviewAdded", { reviewAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateReview: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.reviewRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("reviewUpdated", { reviewUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteReview: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.reviewRequester.send({ type: 'delete', id, headers })
                pubSub.publish("reviewDeleted", { reviewDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
export const typeDef = `
type Reaction {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  type: String!
  post(query: JSON): Post!
}
input ReactionFilter {
  AND: [ReactionFilter!]
  OR: [ReactionFilter!]
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
  type: String
  type_not: String
  type_in: [String]
  type_not_in: [String]
  type_lt: String
  type_lte: String
  type_gt: String
  type_gte: String
  type_contains: String
  type_not_contains: String
  type_starts_with: String
  type_not_starts_with: String
  type_ends_with: String
  type_not_ends_with: String
  post: PostFilter
  post_some: PostFilter
  post_none: PostFilter
}
enum ReactionOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  type_ASC
  type_DESC
}
type ReactionConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Reaction]
}
input CreateReactionInput {
  type: String!
  postId: String!
}
input UpdateReactionInput {
  type: String
  postId: String
}
extend type Query {
  reactions(
    query: JSON
    where: ReactionFilter
    orderBy: ReactionOrderBy
    skip: Int
    limit: Int
  ): [Reaction]
  reaction(id: String!): Reaction
  reactionsConnection(
    query: JSON
    where: ReactionFilter
    orderBy: ReactionOrderBy
    skip: Int
    limit: Int
  ): ReactionConnection
}
extend type Subscription {
  reactionAdded: Reaction
  reactionUpdated: Reaction
  reactionDeleted: Reaction
}
extend type Mutation {
  createReaction(input: CreateReactionInput): Reaction
  updateReaction(input: UpdateReactionInput, id: String!): Reaction
  deleteReaction(id: String!): Reaction
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        reactions: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.reactionRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        reaction: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.reactionRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        reactionsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.reactionRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Reaction: {
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
        post: async ({ postId }, args, { headers, requester }) => {
            try {
                return await requester.postRequester.send({ type: 'get', id: postId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        reactionAdded: {
            subscribe: () => pubSub.asyncIterator('reactionAdded')
        },
        reactionUpdated: {
            subscribe: () => pubSub.asyncIterator('reactionUpdated')
        },
        reactionDeleted: {
            subscribe: () => pubSub.asyncIterator('reactionDeleted')
        },
    },
    Mutation: {
        createReaction: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.reactionRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("reactionAdded", { reactionAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateReaction: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.reactionRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("reactionUpdated", { reactionUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteReaction: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.reactionRequester.send({ type: 'delete', id, headers })
                pubSub.publish("reactionDeleted", { reactionDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
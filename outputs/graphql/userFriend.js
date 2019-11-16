export const typeDef = `
type UserFriend {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  friend(query: JSON): User!
}
input UserFriendFilter {
  AND: [UserFriendFilter!]
  OR: [UserFriendFilter!]
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
  friend: UserFilter
  friend_some: UserFilter
  friend_none: UserFilter
}
enum UserFriendOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}
type UserFriendConnection {
  total: Int
  limit: Int
  skip: Int
  data: [UserFriend]
}
input CreateUserFriendInput {
  friendId: String!
}
input UpdateUserFriendInput {
  friendId: String
}
extend type Query {
  userFriends(
    query: JSON
    where: UserFriendFilter
    orderBy: UserFriendOrderBy
    skip: Int
    limit: Int
  ): [UserFriend]
  userFriend(id: String!): UserFriend
  userFriendsConnection(
    query: JSON
    where: UserFriendFilter
    orderBy: UserFriendOrderBy
    skip: Int
    limit: Int
  ): UserFriendConnection
}
extend type Subscription {
  userFriendAdded: UserFriend
  userFriendUpdated: UserFriend
  userFriendDeleted: UserFriend
}
extend type Mutation {
  createUserFriend(input: CreateUserFriendInput): UserFriend
  updateUserFriend(input: UpdateUserFriendInput, id: String!): UserFriend
  deleteUserFriend(id: String!): UserFriend
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        userFriends: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.userFriendRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        userFriend: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.userFriendRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        userFriendsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.userFriendRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    UserFriend: {
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
        friend: async ({ friendId }, args, { headers, requester }) => {
            try {
                return await requester.userRequester.send({ type: 'get', id: friendId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        userFriendAdded: {
            subscribe: () => pubSub.asyncIterator('userFriendAdded')
        },
        userFriendUpdated: {
            subscribe: () => pubSub.asyncIterator('userFriendUpdated')
        },
        userFriendDeleted: {
            subscribe: () => pubSub.asyncIterator('userFriendDeleted')
        },
    },
    Mutation: {
        createUserFriend: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.userFriendRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("userFriendAdded", { userFriendAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateUserFriend: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.userFriendRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("userFriendUpdated", { userFriendUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteUserFriend: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.userFriendRequester.send({ type: 'delete', id, headers })
                pubSub.publish("userFriendDeleted", { userFriendDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
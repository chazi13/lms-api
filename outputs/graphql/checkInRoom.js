export const typeDef = `
type CheckInRoom {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  question: String
  users(query: JSON): [User]
  description: String
  messages(query: JSON): [CheckInRoomMessage]
  comments(query: JSON): [Comment]
}
input CheckInRoomFilter {
  AND: [CheckInRoomFilter!]
  OR: [CheckInRoomFilter!]
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
  question: String
  question_not: String
  question_in: [String]
  question_not_in: [String]
  question_lt: String
  question_lte: String
  question_gt: String
  question_gte: String
  question_contains: String
  question_not_contains: String
  question_starts_with: String
  question_not_starts_with: String
  question_ends_with: String
  question_not_ends_with: String
  users: UserFilter
  users_some: UserFilter
  users_none: UserFilter
  description: String
  description_not: String
  description_in: [String]
  description_not_in: [String]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  messages: CheckInRoomMessageFilter
  messages_some: CheckInRoomMessageFilter
  messages_none: CheckInRoomMessageFilter
  comments: CommentFilter
  comments_some: CommentFilter
  comments_none: CommentFilter
}
enum CheckInRoomOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  question_ASC
  question_DESC
  description_ASC
  description_DESC
}
type CheckInRoomConnection {
  total: Int
  limit: Int
  skip: Int
  data: [CheckInRoom]
}
input CreateCheckInRoomInput {
  question: String
  description: String
}
input UpdateCheckInRoomInput {
  question: String
  description: String
}
extend type Query {
  checkInRooms(
    query: JSON
    where: CheckInRoomFilter
    orderBy: CheckInRoomOrderBy
    skip: Int
    limit: Int
  ): [CheckInRoom]
  checkInRoom(id: String!): CheckInRoom
  checkInRoomsConnection(
    query: JSON
    where: CheckInRoomFilter
    orderBy: CheckInRoomOrderBy
    skip: Int
    limit: Int
  ): CheckInRoomConnection
}
extend type Subscription {
  checkInRoomAdded: CheckInRoom
  checkInRoomUpdated: CheckInRoom
  checkInRoomDeleted: CheckInRoom
}
extend type Mutation {
  createCheckInRoom(input: CreateCheckInRoomInput): CheckInRoom
  updateCheckInRoom(input: UpdateCheckInRoomInput, id: String!): CheckInRoom
  deleteCheckInRoom(id: String!): CheckInRoom
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        checkInRooms: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.checkInRoomRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        checkInRoom: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.checkInRoomRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        checkInRoomsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.checkInRoomRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    CheckInRoom: {
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
        users: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.userRequester.send({ type: 'find', where: Object.assign({ checkInRoomId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        messages: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.checkInRoomMessageRequester.send({ type: 'find', where: Object.assign({ checkInRoomId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        comments: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.commentRequester.send({ type: 'find', where: Object.assign({ checkInRoomId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        checkInRoomAdded: {
            subscribe: () => pubSub.asyncIterator('checkInRoomAdded')
        },
        checkInRoomUpdated: {
            subscribe: () => pubSub.asyncIterator('checkInRoomUpdated')
        },
        checkInRoomDeleted: {
            subscribe: () => pubSub.asyncIterator('checkInRoomDeleted')
        },
    },
    Mutation: {
        createCheckInRoom: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.checkInRoomRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("checkInRoomAdded", { checkInRoomAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateCheckInRoom: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.checkInRoomRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("checkInRoomUpdated", { checkInRoomUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteCheckInRoom: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.checkInRoomRequester.send({ type: 'delete', id, headers })
                pubSub.publish("checkInRoomDeleted", { checkInRoomDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
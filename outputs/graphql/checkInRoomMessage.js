export const typeDef = `
type CheckInRoomMessage {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  text: String
  MessageType: String
  parentMessage: String
  isDeleted: Boolean
  checkInRoom(query: JSON): CheckInRoom!
}
input CheckInRoomMessageFilter {
  AND: [CheckInRoomMessageFilter!]
  OR: [CheckInRoomMessageFilter!]
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
  text: String
  text_not: String
  text_in: [String]
  text_not_in: [String]
  text_lt: String
  text_lte: String
  text_gt: String
  text_gte: String
  text_contains: String
  text_not_contains: String
  text_starts_with: String
  text_not_starts_with: String
  text_ends_with: String
  text_not_ends_with: String
  MessageType: String
  MessageType_not: String
  MessageType_in: [String]
  MessageType_not_in: [String]
  MessageType_lt: String
  MessageType_lte: String
  MessageType_gt: String
  MessageType_gte: String
  MessageType_contains: String
  MessageType_not_contains: String
  MessageType_starts_with: String
  MessageType_not_starts_with: String
  MessageType_ends_with: String
  MessageType_not_ends_with: String
  parentMessage: String
  parentMessage_not: String
  parentMessage_in: [String]
  parentMessage_not_in: [String]
  parentMessage_lt: String
  parentMessage_lte: String
  parentMessage_gt: String
  parentMessage_gte: String
  parentMessage_contains: String
  parentMessage_not_contains: String
  parentMessage_starts_with: String
  parentMessage_not_starts_with: String
  parentMessage_ends_with: String
  parentMessage_not_ends_with: String
  isDeleted: Boolean
  isDeleted_not: Boolean
  checkInRoom: CheckInRoomFilter
  checkInRoom_some: CheckInRoomFilter
  checkInRoom_none: CheckInRoomFilter
}
enum CheckInRoomMessageOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  text_ASC
  text_DESC
  messageType_ASC
  messageType_DESC
  parentMessage_ASC
  parentMessage_DESC
  isDeleted_ASC
  isDeleted_DESC
}
type CheckInRoomMessageConnection {
  total: Int
  limit: Int
  skip: Int
  data: [CheckInRoomMessage]
}
input CreateCheckInRoomMessageInput {
  text: String
  MessageType: String
  parentMessage: String
  isDeleted: Boolean
  checkInRoomId: String!
}
input UpdateCheckInRoomMessageInput {
  text: String
  MessageType: String
  parentMessage: String
  isDeleted: Boolean
  checkInRoomId: String
}
extend type Query {
  checkInRoomMessages(
    query: JSON
    where: CheckInRoomMessageFilter
    orderBy: CheckInRoomMessageOrderBy
    skip: Int
    limit: Int
  ): [CheckInRoomMessage]
  checkInRoomMessage(id: String!): CheckInRoomMessage
  checkInRoomMessagesConnection(
    query: JSON
    where: CheckInRoomMessageFilter
    orderBy: CheckInRoomMessageOrderBy
    skip: Int
    limit: Int
  ): CheckInRoomMessageConnection
}
extend type Subscription {
  checkInRoomMessageAdded: CheckInRoomMessage
  checkInRoomMessageUpdated: CheckInRoomMessage
  checkInRoomMessageDeleted: CheckInRoomMessage
}
extend type Mutation {
  createCheckInRoomMessage(
    input: CreateCheckInRoomMessageInput
  ): CheckInRoomMessage
  updateCheckInRoomMessage(
    input: UpdateCheckInRoomMessageInput
    id: String!
  ): CheckInRoomMessage
  deleteCheckInRoomMessage(id: String!): CheckInRoomMessage
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        checkInRoomMessages: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.checkInRoomMessageRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        checkInRoomMessage: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.checkInRoomMessageRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        checkInRoomMessagesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.checkInRoomMessageRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    CheckInRoomMessage: {
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
        checkInRoom: async ({ checkInRoomId }, args, { headers, requester }) => {
            try {
                return await requester.checkInRoomRequester.send({ type: 'get', id: checkInRoomId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        checkInRoomMessageAdded: {
            subscribe: () => pubSub.asyncIterator('checkInRoomMessageAdded')
        },
        checkInRoomMessageUpdated: {
            subscribe: () => pubSub.asyncIterator('checkInRoomMessageUpdated')
        },
        checkInRoomMessageDeleted: {
            subscribe: () => pubSub.asyncIterator('checkInRoomMessageDeleted')
        },
    },
    Mutation: {
        createCheckInRoomMessage: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.checkInRoomMessageRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("checkInRoomMessageAdded", { checkInRoomMessageAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateCheckInRoomMessage: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.checkInRoomMessageRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("checkInRoomMessageUpdated", { checkInRoomMessageUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteCheckInRoomMessage: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.checkInRoomMessageRequester.send({ type: 'delete', id, headers })
                pubSub.publish("checkInRoomMessageDeleted", { checkInRoomMessageDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
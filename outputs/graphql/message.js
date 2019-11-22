export const typeDef = `
type Message {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  text: String
  MessageType: String
  user: User
  parentMessage: String
  isDeleted: Boolean
  files(query: JSON): [ChatFileStorage]
  classRoom: ClassRoom
}
input MessageFilter {
  AND: [MessageFilter!]
  OR: [MessageFilter!]
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
  user: UserFilter
  user_some: UserFilter
  user_none: UserFilter
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
  files: ChatFileStorageFilter
  files_some: ChatFileStorageFilter
  files_none: ChatFileStorageFilter
  classRoom: ClassRoomFilter
  classRoom_some: ClassRoomFilter
  classRoom_none: ClassRoomFilter
}
enum MessageOrderBy {
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
type MessageConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Message]
}
input CreateMessageInput {
  text: String
  MessageType: String
  userId: String
  parentMessage: String
  isDeleted: Boolean
  classRoomId: String
}
input UpdateMessageInput {
  text: String
  MessageType: String
  userId: String
  parentMessage: String
  isDeleted: Boolean
  classRoomId: String
}
extend type Query {
  messages(
    query: JSON
    where: MessageFilter
    orderBy: MessageOrderBy
    skip: Int
    limit: Int
  ): [Message]
  message(id: String!): Message
  messagesConnection(
    query: JSON
    where: MessageFilter
    orderBy: MessageOrderBy
    skip: Int
    limit: Int
  ): MessageConnection
}
extend type Subscription {
  messageAdded: Message
  messageUpdated: Message
  messageDeleted: Message
}
extend type Mutation {
  createMessage(input: CreateMessageInput): Message
  updateMessage(input: UpdateMessageInput, id: String!): Message
  deleteMessage(id: String!): Message
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        messages: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.messageRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        message: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.messageRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        messagesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.messageRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Message: {
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
        user: async ({ userId }, args, { headers, requester }) => {
            try {
                return await requester.userRequester.send({ type: 'get', id: userId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        files: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.chatFileStorageRequester.send({ type: 'find', where: Object.assign({ messageId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        classRoom: async ({ classRoomId }, args, { headers, requester }) => {
            try {
                return await requester.classRoomRequester.send({ type: 'get', id: classRoomId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        messageAdded: {
            subscribe: () => pubSub.asyncIterator('messageAdded')
        },
        messageUpdated: {
            subscribe: () => pubSub.asyncIterator('messageUpdated')
        },
        messageDeleted: {
            subscribe: () => pubSub.asyncIterator('messageDeleted')
        },
    },
    Mutation: {
        createMessage: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.messageRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("messageAdded", { messageAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateMessage: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.messageRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("messageUpdated", { messageUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteMessage: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.messageRequester.send({ type: 'delete', id, headers })
                pubSub.publish("messageDeleted", { messageDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
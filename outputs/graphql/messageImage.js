export const typeDef = `
type MessageImage {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  name: String
}
input MessageImageFilter {
  AND: [MessageImageFilter!]
  OR: [MessageImageFilter!]
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
  name: String
  name_not: String
  name_in: [String]
  name_not_in: [String]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
}
enum MessageImageOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
}
type MessageImageConnection {
  total: Int
  limit: Int
  skip: Int
  data: [MessageImage]
}
input CreateMessageImageInput {
  name: String
}
input UpdateMessageImageInput {
  name: String
}
extend type Query {
  messageImages(
    query: JSON
    where: MessageImageFilter
    orderBy: MessageImageOrderBy
    skip: Int
    limit: Int
  ): [MessageImage]
  messageImage(id: String!): MessageImage
  messageImagesConnection(
    query: JSON
    where: MessageImageFilter
    orderBy: MessageImageOrderBy
    skip: Int
    limit: Int
  ): MessageImageConnection
}
extend type Subscription {
  messageImageAdded: MessageImage
  messageImageUpdated: MessageImage
  messageImageDeleted: MessageImage
}
extend type Mutation {
  createMessageImage(input: CreateMessageImageInput): MessageImage
  updateMessageImage(input: UpdateMessageImageInput, id: String!): MessageImage
  deleteMessageImage(id: String!): MessageImage
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        messageImages: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.messageImageRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        messageImage: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.messageImageRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        messageImagesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.messageImageRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    MessageImage: {
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
    },
    Subscription: {
        messageImageAdded: {
            subscribe: () => pubSub.asyncIterator('messageImageAdded')
        },
        messageImageUpdated: {
            subscribe: () => pubSub.asyncIterator('messageImageUpdated')
        },
        messageImageDeleted: {
            subscribe: () => pubSub.asyncIterator('messageImageDeleted')
        },
    },
    Mutation: {
        createMessageImage: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.messageImageRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("messageImageAdded", { messageImageAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateMessageImage: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.messageImageRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("messageImageUpdated", { messageImageUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteMessageImage: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.messageImageRequester.send({ type: 'delete', id, headers })
                pubSub.publish("messageImageDeleted", { messageImageDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
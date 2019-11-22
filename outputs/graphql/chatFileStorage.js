export const typeDef = `
type ChatFileStorage {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  name: String
  url: String!
  message: Message
}
input ChatFileStorageFilter {
  AND: [ChatFileStorageFilter!]
  OR: [ChatFileStorageFilter!]
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
  url: String
  url_not: String
  url_in: [String]
  url_not_in: [String]
  url_lt: String
  url_lte: String
  url_gt: String
  url_gte: String
  url_contains: String
  url_not_contains: String
  url_starts_with: String
  url_not_starts_with: String
  url_ends_with: String
  url_not_ends_with: String
  message: MessageFilter
  message_some: MessageFilter
  message_none: MessageFilter
}
enum ChatFileStorageOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
  url_ASC
  url_DESC
}
type ChatFileStorageConnection {
  total: Int
  limit: Int
  skip: Int
  data: [ChatFileStorage]
}
input CreateChatFileStorageInput {
  name: String
  url: Upload!
  messageId: String
}
input UpdateChatFileStorageInput {
  name: String
  url: Upload
  messageId: String
}
extend type Query {
  chatFileStorages(
    query: JSON
    where: ChatFileStorageFilter
    orderBy: ChatFileStorageOrderBy
    skip: Int
    limit: Int
  ): [ChatFileStorage]
  chatFileStorage(id: String!): ChatFileStorage
  chatFileStoragesConnection(
    query: JSON
    where: ChatFileStorageFilter
    orderBy: ChatFileStorageOrderBy
    skip: Int
    limit: Int
  ): ChatFileStorageConnection
}
extend type Subscription {
  chatFileStorageAdded: ChatFileStorage
  chatFileStorageUpdated: ChatFileStorage
  chatFileStorageDeleted: ChatFileStorage
}
extend type Mutation {
  createChatFileStorage(input: CreateChatFileStorageInput): ChatFileStorage
  updateChatFileStorage(
    input: UpdateChatFileStorageInput
    id: String!
  ): ChatFileStorage
  deleteChatFileStorage(id: String!): ChatFileStorage
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        chatFileStorages: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.chatFileStorageRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        chatFileStorage: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.chatFileStorageRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        chatFileStoragesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.chatFileStorageRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    ChatFileStorage: {
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
        message: async ({ messageId }, args, { headers, requester }) => {
            try {
                return await requester.messageRequester.send({ type: 'get', id: messageId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        chatFileStorageAdded: {
            subscribe: () => pubSub.asyncIterator('chatFileStorageAdded')
        },
        chatFileStorageUpdated: {
            subscribe: () => pubSub.asyncIterator('chatFileStorageUpdated')
        },
        chatFileStorageDeleted: {
            subscribe: () => pubSub.asyncIterator('chatFileStorageDeleted')
        },
    },
    Mutation: {
        createChatFileStorage: async (_, { input = {} }, { requester: { chatFileStorageRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.url) {
                    let imageChatFileStorage = await input.url
                    const key = "chatFileStorage/" + uuid() + "." + imageChatFileStorage.mimetype.split("/")[1]
                    const url = storageUrl + key
                    input.url = url
                    const rs = imageChatFileStorage.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const chatFileStorage = chatFileStorageRequester.send({
                                type: 'create',
                                body: input,
                                headers,
                                file: {
                                    buffer,
                                    key,
                                    mimeType: imageChatFileStorage.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("chatFileStorageAdded", { chatFileStorageAdded: chatFileStorage })
                            resolve(chatFileStorage)
                        })
                    })
                } else {
                    let chatFileStorage = await chatFileStorageRequester.send({ type: 'create', body: input, headers })
                    pubSub.publish("chatFileStorageAdded", { chatFileStorageAdded: chatFileStorage })
                    return chatFileStorage
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        updateChatFileStorage: async (_, { input = {}, id }, { requester: { chatFileStorageRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.url) {
                    let imageChatFileStorage = await input.url
                    delete input.url

                    const rs = imageChatFileStorage.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const chatFileStorage = await chatFileStorageRequester.send({
                                type: 'patch',
                                body: input,
                                id,
                                headers,
                                file: {
                                    buffer,
                                    mimeType: imageChatFileStorage.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("chatFileStorageUpdated", { chatFileStorageUpdated: chatFileStorage })
                            resolve(chatFileStorage)
                        })

                    })
                } else {
                    let chatFileStorage = await chatFileStorageRequester.send({ type: 'patch', body: input, id, headers })
                    pubSub.publish("chatFileStorageUpdated", { chatFileStorageUpdated: chatFileStorage })
                    return chatFileStorage
                }
            } catch (e) {
                throw new Error(e)
            }

        },
        deleteChatFileStorage: async (_, { id }, { requester: { chatFileStorageRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                let chatFileStorage = await chatFileStorageRequester.send({ type: 'delete', id, headers })
                if (chatFileStorage.url) {
                    const key = chatFileStorage.url.split(storageUrl).join("")
                    storageRequester.send({
                        type: "deleteFile",
                        body: {
                            bucket,
                            key
                        }
                    })
                }
                pubSub.publish("chatFileStorageDeleted", { chatFileStorageDeleted: chatFileStorage })
                return chatFileStorage
            } catch (e) {
                throw new Error(e)
            }
        },
    }
})
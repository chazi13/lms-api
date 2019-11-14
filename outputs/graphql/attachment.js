export const typeDef = `
type Attachment {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  name: String!
  url: String!
}
input AttachmentFilter {
  AND: [AttachmentFilter!]
  OR: [AttachmentFilter!]
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
}
enum AttachmentOrderBy {
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
type AttachmentConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Attachment]
}
input CreateAttachmentInput {
  name: String!
  url: Upload!
}
input UpdateAttachmentInput {
  name: String
  url: Upload
}
extend type Query {
  attachments(
    query: JSON
    where: AttachmentFilter
    orderBy: AttachmentOrderBy
    skip: Int
    limit: Int
  ): [Attachment]
  attachment(id: String!): Attachment
  attachmentsConnection(
    query: JSON
    where: AttachmentFilter
    orderBy: AttachmentOrderBy
    skip: Int
    limit: Int
  ): AttachmentConnection
}
extend type Subscription {
  attachmentAdded: Attachment
  attachmentUpdated: Attachment
  attachmentDeleted: Attachment
}
extend type Mutation {
  createAttachment(input: CreateAttachmentInput): Attachment
  updateAttachment(input: UpdateAttachmentInput, id: String!): Attachment
  deleteAttachment(id: String!): Attachment
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        attachments: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.attachmentRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        attachment: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.attachmentRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        attachmentsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.attachmentRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Attachment: {
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
        attachmentAdded: {
            subscribe: () => pubSub.asyncIterator('attachmentAdded')
        },
        attachmentUpdated: {
            subscribe: () => pubSub.asyncIterator('attachmentUpdated')
        },
        attachmentDeleted: {
            subscribe: () => pubSub.asyncIterator('attachmentDeleted')
        },
    },
    Mutation: {
        createAttachment: async (_, { input = {} }, { requester: { attachmentRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.url) {
                    let imageAttachment = await input.url
                    const key = "attachment/" + uuid() + "." + imageAttachment.mimetype.split("/")[1]
                    const url = storageUrl + key
                    input.url = url
                    const rs = imageAttachment.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const attachment = attachmentRequester.send({
                                type: 'create',
                                body: input,
                                headers,
                                file: {
                                    buffer,
                                    key,
                                    mimeType: imageAttachment.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("attachmentAdded", { attachmentAdded: attachment })
                            resolve(attachment)
                        })
                    })
                } else {
                    let attachment = await attachmentRequester.send({ type: 'create', body: input, headers })
                    pubSub.publish("attachmentAdded", { attachmentAdded: attachment })
                    return attachment
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        updateAttachment: async (_, { input = {}, id }, { requester: { attachmentRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.url) {
                    let imageAttachment = await input.url
                    delete input.url

                    const rs = imageAttachment.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const attachment = await attachmentRequester.send({
                                type: 'patch',
                                body: input,
                                id,
                                headers,
                                file: {
                                    buffer,
                                    mimeType: imageAttachment.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("attachmentUpdated", { attachmentUpdated: attachment })
                            resolve(attachment)
                        })

                    })
                } else {
                    let attachment = await attachmentRequester.send({ type: 'patch', body: input, id, headers })
                    pubSub.publish("attachmentUpdated", { attachmentUpdated: attachment })
                    return attachment
                }
            } catch (e) {
                throw new Error(e)
            }

        },
        deleteAttachment: async (_, { id }, { requester: { attachmentRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                let attachment = await attachmentRequester.send({ type: 'delete', id, headers })
                if (attachment.url) {
                    const key = attachment.url.split(storageUrl).join("")
                    storageRequester.send({
                        type: "deleteFile",
                        body: {
                            bucket,
                            key
                        }
                    })
                }
                pubSub.publish("attachmentDeleted", { attachmentDeleted: attachment })
                return attachment
            } catch (e) {
                throw new Error(e)
            }
        },
    }
})
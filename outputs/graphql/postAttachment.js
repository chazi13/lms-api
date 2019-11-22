export const typeDef = `
type PostAttachment {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  post: Post
  name: String!
  url: String!
  type: String
}
input PostAttachmentFilter {
  AND: [PostAttachmentFilter!]
  OR: [PostAttachmentFilter!]
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
  post: PostFilter
  post_some: PostFilter
  post_none: PostFilter
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
}
enum PostAttachmentOrderBy {
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
  type_ASC
  type_DESC
}
type PostAttachmentConnection {
  total: Int
  limit: Int
  skip: Int
  data: [PostAttachment]
}
input CreatePostAttachmentInput {
  postId: String
  name: String!
  url: Upload!
  type: String
}
input UpdatePostAttachmentInput {
  postId: String
  name: String
  url: Upload
  type: String
}
extend type Query {
  postAttachments(
    query: JSON
    where: PostAttachmentFilter
    orderBy: PostAttachmentOrderBy
    skip: Int
    limit: Int
  ): [PostAttachment]
  postAttachment(id: String!): PostAttachment
  postAttachmentsConnection(
    query: JSON
    where: PostAttachmentFilter
    orderBy: PostAttachmentOrderBy
    skip: Int
    limit: Int
  ): PostAttachmentConnection
}
extend type Subscription {
  postAttachmentAdded: PostAttachment
  postAttachmentUpdated: PostAttachment
  postAttachmentDeleted: PostAttachment
}
extend type Mutation {
  createPostAttachment(input: CreatePostAttachmentInput): PostAttachment
  updatePostAttachment(
    input: UpdatePostAttachmentInput
    id: String!
  ): PostAttachment
  deletePostAttachment(id: String!): PostAttachment
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        postAttachments: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.postAttachmentRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        postAttachment: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.postAttachmentRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        postAttachmentsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.postAttachmentRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    PostAttachment: {
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
        postAttachmentAdded: {
            subscribe: () => pubSub.asyncIterator('postAttachmentAdded')
        },
        postAttachmentUpdated: {
            subscribe: () => pubSub.asyncIterator('postAttachmentUpdated')
        },
        postAttachmentDeleted: {
            subscribe: () => pubSub.asyncIterator('postAttachmentDeleted')
        },
    },
    Mutation: {
        createPostAttachment: async (_, { input = {} }, { requester: { postAttachmentRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.url) {
                    let imagePostAttachment = await input.url
                    const key = "postAttachment/" + uuid() + "." + imagePostAttachment.mimetype.split("/")[1]
                    const url = storageUrl + key
                    input.url = url
                    const rs = imagePostAttachment.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const postAttachment = postAttachmentRequester.send({
                                type: 'create',
                                body: input,
                                headers,
                                file: {
                                    buffer,
                                    key,
                                    mimeType: imagePostAttachment.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("postAttachmentAdded", { postAttachmentAdded: postAttachment })
                            resolve(postAttachment)
                        })
                    })
                } else {
                    let postAttachment = await postAttachmentRequester.send({ type: 'create', body: input, headers })
                    pubSub.publish("postAttachmentAdded", { postAttachmentAdded: postAttachment })
                    return postAttachment
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        updatePostAttachment: async (_, { input = {}, id }, { requester: { postAttachmentRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.url) {
                    let imagePostAttachment = await input.url
                    delete input.url

                    const rs = imagePostAttachment.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const postAttachment = await postAttachmentRequester.send({
                                type: 'patch',
                                body: input,
                                id,
                                headers,
                                file: {
                                    buffer,
                                    mimeType: imagePostAttachment.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("postAttachmentUpdated", { postAttachmentUpdated: postAttachment })
                            resolve(postAttachment)
                        })

                    })
                } else {
                    let postAttachment = await postAttachmentRequester.send({ type: 'patch', body: input, id, headers })
                    pubSub.publish("postAttachmentUpdated", { postAttachmentUpdated: postAttachment })
                    return postAttachment
                }
            } catch (e) {
                throw new Error(e)
            }

        },
        deletePostAttachment: async (_, { id }, { requester: { postAttachmentRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                let postAttachment = await postAttachmentRequester.send({ type: 'delete', id, headers })
                if (postAttachment.url) {
                    const key = postAttachment.url.split(storageUrl).join("")
                    storageRequester.send({
                        type: "deleteFile",
                        body: {
                            bucket,
                            key
                        }
                    })
                }
                pubSub.publish("postAttachmentDeleted", { postAttachmentDeleted: postAttachment })
                return postAttachment
            } catch (e) {
                throw new Error(e)
            }
        },
    }
})
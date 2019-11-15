export const typeDef = `
type CommentAttachment {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  name: String!
  url: String!
  comment: Comment
  subComment: SubComment
}
input CommentAttachmentFilter {
  AND: [CommentAttachmentFilter!]
  OR: [CommentAttachmentFilter!]
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
  comment: CommentFilter
  comment_some: CommentFilter
  comment_none: CommentFilter
  subComment: SubCommentFilter
  subComment_some: SubCommentFilter
  subComment_none: SubCommentFilter
}
enum CommentAttachmentOrderBy {
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
type CommentAttachmentConnection {
  total: Int
  limit: Int
  skip: Int
  data: [CommentAttachment]
}
input CreateCommentAttachmentInput {
  name: String!
  url: Upload!
  commentId: String
  subCommentId: String
}
input UpdateCommentAttachmentInput {
  name: String
  url: Upload
  commentId: String
  subCommentId: String
}
extend type Query {
  commentAttachments(
    query: JSON
    where: CommentAttachmentFilter
    orderBy: CommentAttachmentOrderBy
    skip: Int
    limit: Int
  ): [CommentAttachment]
  commentAttachment(id: String!): CommentAttachment
  commentAttachmentsConnection(
    query: JSON
    where: CommentAttachmentFilter
    orderBy: CommentAttachmentOrderBy
    skip: Int
    limit: Int
  ): CommentAttachmentConnection
}
extend type Subscription {
  commentAttachmentAdded: CommentAttachment
  commentAttachmentUpdated: CommentAttachment
  commentAttachmentDeleted: CommentAttachment
}
extend type Mutation {
  createCommentAttachment(
    input: CreateCommentAttachmentInput
  ): CommentAttachment
  updateCommentAttachment(
    input: UpdateCommentAttachmentInput
    id: String!
  ): CommentAttachment
  deleteCommentAttachment(id: String!): CommentAttachment
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        commentAttachments: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.commentAttachmentRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        commentAttachment: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.commentAttachmentRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        commentAttachmentsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.commentAttachmentRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    CommentAttachment: {
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
        comment: async ({ commentId }, args, { headers, requester }) => {
            try {
                return await requester.commentRequester.send({ type: 'get', id: commentId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        subComment: async ({ subCommentId }, args, { headers, requester }) => {
            try {
                return await requester.subCommentRequester.send({ type: 'get', id: subCommentId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        commentAttachmentAdded: {
            subscribe: () => pubSub.asyncIterator('commentAttachmentAdded')
        },
        commentAttachmentUpdated: {
            subscribe: () => pubSub.asyncIterator('commentAttachmentUpdated')
        },
        commentAttachmentDeleted: {
            subscribe: () => pubSub.asyncIterator('commentAttachmentDeleted')
        },
    },
    Mutation: {
        createCommentAttachment: async (_, { input = {} }, { requester: { commentAttachmentRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.url) {
                    let imageCommentAttachment = await input.url
                    const key = "commentAttachment/" + uuid() + "." + imageCommentAttachment.mimetype.split("/")[1]
                    const url = storageUrl + key
                    input.url = url
                    const rs = imageCommentAttachment.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const commentAttachment = commentAttachmentRequester.send({
                                type: 'create',
                                body: input,
                                headers,
                                file: {
                                    buffer,
                                    key,
                                    mimeType: imageCommentAttachment.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("commentAttachmentAdded", { commentAttachmentAdded: commentAttachment })
                            resolve(commentAttachment)
                        })
                    })
                } else {
                    let commentAttachment = await commentAttachmentRequester.send({ type: 'create', body: input, headers })
                    pubSub.publish("commentAttachmentAdded", { commentAttachmentAdded: commentAttachment })
                    return commentAttachment
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        updateCommentAttachment: async (_, { input = {}, id }, { requester: { commentAttachmentRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.url) {
                    let imageCommentAttachment = await input.url
                    delete input.url

                    const rs = imageCommentAttachment.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const commentAttachment = await commentAttachmentRequester.send({
                                type: 'patch',
                                body: input,
                                id,
                                headers,
                                file: {
                                    buffer,
                                    mimeType: imageCommentAttachment.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("commentAttachmentUpdated", { commentAttachmentUpdated: commentAttachment })
                            resolve(commentAttachment)
                        })

                    })
                } else {
                    let commentAttachment = await commentAttachmentRequester.send({ type: 'patch', body: input, id, headers })
                    pubSub.publish("commentAttachmentUpdated", { commentAttachmentUpdated: commentAttachment })
                    return commentAttachment
                }
            } catch (e) {
                throw new Error(e)
            }

        },
        deleteCommentAttachment: async (_, { id }, { requester: { commentAttachmentRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                let commentAttachment = await commentAttachmentRequester.send({ type: 'delete', id, headers })
                if (commentAttachment.url) {
                    const key = commentAttachment.url.split(storageUrl).join("")
                    storageRequester.send({
                        type: "deleteFile",
                        body: {
                            bucket,
                            key
                        }
                    })
                }
                pubSub.publish("commentAttachmentDeleted", { commentAttachmentDeleted: commentAttachment })
                return commentAttachment
            } catch (e) {
                throw new Error(e)
            }
        },
    }
})
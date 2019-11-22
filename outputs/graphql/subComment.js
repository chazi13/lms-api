export const typeDef = `
type SubComment {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  text: String!
  comment: Comment
  attachments(query: JSON): [CommentAttachment]
}
input SubCommentFilter {
  AND: [SubCommentFilter!]
  OR: [SubCommentFilter!]
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
  comment: CommentFilter
  comment_some: CommentFilter
  comment_none: CommentFilter
  attachments: CommentAttachmentFilter
  attachments_some: CommentAttachmentFilter
  attachments_none: CommentAttachmentFilter
}
enum SubCommentOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  text_ASC
  text_DESC
}
type SubCommentConnection {
  total: Int
  limit: Int
  skip: Int
  data: [SubComment]
}
input CreateSubCommentInput {
  text: String!
  commentId: String
}
input UpdateSubCommentInput {
  text: String
  commentId: String
}
extend type Query {
  subComments(
    query: JSON
    where: SubCommentFilter
    orderBy: SubCommentOrderBy
    skip: Int
    limit: Int
  ): [SubComment]
  subComment(id: String!): SubComment
  subCommentsConnection(
    query: JSON
    where: SubCommentFilter
    orderBy: SubCommentOrderBy
    skip: Int
    limit: Int
  ): SubCommentConnection
}
extend type Subscription {
  subCommentAdded: SubComment
  subCommentUpdated: SubComment
  subCommentDeleted: SubComment
}
extend type Mutation {
  createSubComment(input: CreateSubCommentInput): SubComment
  updateSubComment(input: UpdateSubCommentInput, id: String!): SubComment
  deleteSubComment(id: String!): SubComment
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        subComments: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.subCommentRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        subComment: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.subCommentRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        subCommentsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.subCommentRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    SubComment: {
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
        attachments: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.commentAttachmentRequester.send({ type: 'find', where: Object.assign({ subCommentId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        subCommentAdded: {
            subscribe: () => pubSub.asyncIterator('subCommentAdded')
        },
        subCommentUpdated: {
            subscribe: () => pubSub.asyncIterator('subCommentUpdated')
        },
        subCommentDeleted: {
            subscribe: () => pubSub.asyncIterator('subCommentDeleted')
        },
    },
    Mutation: {
        createSubComment: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.subCommentRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("subCommentAdded", { subCommentAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateSubComment: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.subCommentRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("subCommentUpdated", { subCommentUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteSubComment: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.subCommentRequester.send({ type: 'delete', id, headers })
                pubSub.publish("subCommentDeleted", { subCommentDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
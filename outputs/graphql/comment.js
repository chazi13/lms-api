export const typeDef = `
type Comment {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  text: String!
  post: Post
  checkInRoom: CheckInRoom
  lecture: Lecture
  subComments(query: JSON): [SubComment]
  attachments(query: JSON): [CommentAttachment]
}
input CommentFilter {
  AND: [CommentFilter!]
  OR: [CommentFilter!]
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
  post: PostFilter
  post_some: PostFilter
  post_none: PostFilter
  checkInRoom: CheckInRoomFilter
  checkInRoom_some: CheckInRoomFilter
  checkInRoom_none: CheckInRoomFilter
  lecture: LectureFilter
  lecture_some: LectureFilter
  lecture_none: LectureFilter
  subComments: SubCommentFilter
  subComments_some: SubCommentFilter
  subComments_none: SubCommentFilter
  attachments: CommentAttachmentFilter
  attachments_some: CommentAttachmentFilter
  attachments_none: CommentAttachmentFilter
}
enum CommentOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  text_ASC
  text_DESC
}
type CommentConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Comment]
}
input CreateCommentInput {
  text: String!
  postId: String
  checkInRoomId: String
  lectureId: String
}
input UpdateCommentInput {
  text: String
  postId: String
  checkInRoomId: String
  lectureId: String
}
extend type Query {
  comments(
    query: JSON
    where: CommentFilter
    orderBy: CommentOrderBy
    skip: Int
    limit: Int
  ): [Comment]
  comment(id: String!): Comment
  commentsConnection(
    query: JSON
    where: CommentFilter
    orderBy: CommentOrderBy
    skip: Int
    limit: Int
  ): CommentConnection
}
extend type Subscription {
  commentAdded: Comment
  commentUpdated: Comment
  commentDeleted: Comment
}
extend type Mutation {
  createComment(input: CreateCommentInput): Comment
  updateComment(input: UpdateCommentInput, id: String!): Comment
  deleteComment(id: String!): Comment
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        comments: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.commentRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        comment: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.commentRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        commentsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.commentRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Comment: {
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
        checkInRoom: async ({ checkInRoomId }, args, { headers, requester }) => {
            try {
                return await requester.checkInRoomRequester.send({ type: 'get', id: checkInRoomId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        lecture: async ({ lectureId }, args, { headers, requester }) => {
            try {
                return await requester.lectureRequester.send({ type: 'get', id: lectureId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        subComments: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.subCommentRequester.send({ type: 'find', where: Object.assign({ commentId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        attachments: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.commentAttachmentRequester.send({ type: 'find', where: Object.assign({ commentId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        commentAdded: {
            subscribe: () => pubSub.asyncIterator('commentAdded')
        },
        commentUpdated: {
            subscribe: () => pubSub.asyncIterator('commentUpdated')
        },
        commentDeleted: {
            subscribe: () => pubSub.asyncIterator('commentDeleted')
        },
    },
    Mutation: {
        createComment: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.commentRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("commentAdded", { commentAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateComment: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.commentRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("commentUpdated", { commentUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteComment: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.commentRequester.send({ type: 'delete', id, headers })
                pubSub.publish("commentDeleted", { commentDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
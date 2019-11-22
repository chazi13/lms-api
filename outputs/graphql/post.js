export const typeDef = `
type Post {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  text: String
  comments(query: JSON): [Comment]
  reactions(query: JSON): [Reaction]
  attachments(query: JSON): [PostAttachment]
  space: Space
  card: Card
}
input PostFilter {
  AND: [PostFilter!]
  OR: [PostFilter!]
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
  comments: CommentFilter
  comments_some: CommentFilter
  comments_none: CommentFilter
  reactions: ReactionFilter
  reactions_some: ReactionFilter
  reactions_none: ReactionFilter
  attachments: PostAttachmentFilter
  attachments_some: PostAttachmentFilter
  attachments_none: PostAttachmentFilter
  space: SpaceFilter
  space_some: SpaceFilter
  space_none: SpaceFilter
  card: CardFilter
  card_some: CardFilter
  card_none: CardFilter
}
enum PostOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  text_ASC
  text_DESC
}
type PostConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Post]
}
input CreatePostInput {
  text: String
  spaceId: String
  cardId: String
}
input UpdatePostInput {
  text: String
  spaceId: String
  cardId: String
}
extend type Query {
  posts(
    query: JSON
    where: PostFilter
    orderBy: PostOrderBy
    skip: Int
    limit: Int
  ): [Post]
  post(id: String!): Post
  postsConnection(
    query: JSON
    where: PostFilter
    orderBy: PostOrderBy
    skip: Int
    limit: Int
  ): PostConnection
}
extend type Subscription {
  postAdded: Post
  postUpdated: Post
  postDeleted: Post
}
extend type Mutation {
  createPost(input: CreatePostInput): Post
  updatePost(input: UpdatePostInput, id: String!): Post
  deletePost(id: String!): Post
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        posts: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.postRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        post: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.postRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        postsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.postRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Post: {
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
        comments: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.commentRequester.send({ type: 'find', where: Object.assign({ postId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        reactions: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.reactionRequester.send({ type: 'find', where: Object.assign({ postId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        attachments: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.postAttachmentRequester.send({ type: 'find', where: Object.assign({ postId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        space: async ({ spaceId }, args, { headers, requester }) => {
            try {
                return await requester.spaceRequester.send({ type: 'get', id: spaceId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        card: async ({ cardId }, args, { headers, requester }) => {
            try {
                return await requester.cardRequester.send({ type: 'get', id: cardId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        postAdded: {
            subscribe: () => pubSub.asyncIterator('postAdded')
        },
        postUpdated: {
            subscribe: () => pubSub.asyncIterator('postUpdated')
        },
        postDeleted: {
            subscribe: () => pubSub.asyncIterator('postDeleted')
        },
    },
    Mutation: {
        createPost: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.postRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("postAdded", { postAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updatePost: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.postRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("postUpdated", { postUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deletePost: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.postRequester.send({ type: 'delete', id, headers })
                pubSub.publish("postDeleted", { postDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
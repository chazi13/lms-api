export const typeDef = `
type Article {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  markdown: String!
  title: String!
}
input ArticleFilter {
  AND: [ArticleFilter!]
  OR: [ArticleFilter!]
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
  markdown: String
  markdown_not: String
  markdown_in: [String]
  markdown_not_in: [String]
  markdown_lt: String
  markdown_lte: String
  markdown_gt: String
  markdown_gte: String
  markdown_contains: String
  markdown_not_contains: String
  markdown_starts_with: String
  markdown_not_starts_with: String
  markdown_ends_with: String
  markdown_not_ends_with: String
  title: String
  title_not: String
  title_in: [String]
  title_not_in: [String]
  title_lt: String
  title_lte: String
  title_gt: String
  title_gte: String
  title_contains: String
  title_not_contains: String
  title_starts_with: String
  title_not_starts_with: String
  title_ends_with: String
  title_not_ends_with: String
}
enum ArticleOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  markdown_ASC
  markdown_DESC
  title_ASC
  title_DESC
}
type ArticleConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Article]
}
input CreateArticleInput {
  markdown: String!
  title: String!
}
input UpdateArticleInput {
  markdown: String
  title: String
}
extend type Query {
  articles(
    query: JSON
    where: ArticleFilter
    orderBy: ArticleOrderBy
    skip: Int
    limit: Int
  ): [Article]
  article(id: String!): Article
  articlesConnection(
    query: JSON
    where: ArticleFilter
    orderBy: ArticleOrderBy
    skip: Int
    limit: Int
  ): ArticleConnection
}
extend type Subscription {
  articleAdded: Article
  articleUpdated: Article
  articleDeleted: Article
}
extend type Mutation {
  createArticle(input: CreateArticleInput): Article
  updateArticle(input: UpdateArticleInput, id: String!): Article
  deleteArticle(id: String!): Article
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        articles: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.articleRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        article: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.articleRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        articlesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.articleRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Article: {
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
        articleAdded: {
            subscribe: () => pubSub.asyncIterator('articleAdded')
        },
        articleUpdated: {
            subscribe: () => pubSub.asyncIterator('articleUpdated')
        },
        articleDeleted: {
            subscribe: () => pubSub.asyncIterator('articleDeleted')
        },
    },
    Mutation: {
        createArticle: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.articleRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("articleAdded", { articleAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateArticle: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.articleRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("articleUpdated", { articleUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteArticle: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.articleRequester.send({ type: 'delete', id, headers })
                pubSub.publish("articleDeleted", { articleDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
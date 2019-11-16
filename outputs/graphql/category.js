export const typeDef = `
type Category {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  name: String
  date: Date
  time: DateTime
}
input CategoryFilter {
  AND: [CategoryFilter!]
  OR: [CategoryFilter!]
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
  date: Date
  date_not: Date
  date_in: [Date]
  date_not_in: [Date]
  date_lt: Date
  date_lte: Date
  date_gt: Date
  date_gte: Date
  time: DateTime
  time_not: DateTime
  time_in: [DateTime]
  time_not_in: [DateTime]
  time_lt: DateTime
  time_lte: DateTime
  time_gt: DateTime
  time_gte: DateTime
}
enum CategoryOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
  date_ASC
  date_DESC
  time_ASC
  time_DESC
}
type CategoryConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Category]
}
input CreateCategoryInput {
  name: String
  date: Date
  time: DateTime
}
input UpdateCategoryInput {
  name: String
  date: Date
  time: DateTime
}
extend type Query {
  categories(
    query: JSON
    where: CategoryFilter
    orderBy: CategoryOrderBy
    skip: Int
    limit: Int
  ): [Category]
  category(id: String!): Category
  categoriesConnection(
    query: JSON
    where: CategoryFilter
    orderBy: CategoryOrderBy
    skip: Int
    limit: Int
  ): CategoryConnection
}
extend type Subscription {
  categoryAdded: Category
  categoryUpdated: Category
  categoryDeleted: Category
}
extend type Mutation {
  createCategory(input: CreateCategoryInput): Category
  updateCategory(input: UpdateCategoryInput, id: String!): Category
  deleteCategory(id: String!): Category
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        categories: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.categoryRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        category: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.categoryRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        categoriesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.categoryRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Category: {
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
        categoryAdded: {
            subscribe: () => pubSub.asyncIterator('categoryAdded')
        },
        categoryUpdated: {
            subscribe: () => pubSub.asyncIterator('categoryUpdated')
        },
        categoryDeleted: {
            subscribe: () => pubSub.asyncIterator('categoryDeleted')
        },
    },
    Mutation: {
        createCategory: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.categoryRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("categoryAdded", { categoryAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateCategory: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.categoryRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("categoryUpdated", { categoryUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteCategory: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.categoryRequester.send({ type: 'delete', id, headers })
                pubSub.publish("categoryDeleted", { categoryDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
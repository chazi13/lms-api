export const typeDef = `
type Menu {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  title: String!
  description: String!
  url: String
  color: String
}
input MenuFilter {
  AND: [MenuFilter!]
  OR: [MenuFilter!]
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
  description: String
  description_not: String
  description_in: [String]
  description_not_in: [String]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
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
  color: String
  color_not: String
  color_in: [String]
  color_not_in: [String]
  color_lt: String
  color_lte: String
  color_gt: String
  color_gte: String
  color_contains: String
  color_not_contains: String
  color_starts_with: String
  color_not_starts_with: String
  color_ends_with: String
  color_not_ends_with: String
}
enum MenuOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  title_ASC
  title_DESC
  description_ASC
  description_DESC
  url_ASC
  url_DESC
  color_ASC
  color_DESC
}
type MenuConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Menu]
}
input CreateMenuInput {
  title: String!
  description: String!
  url: String
  color: String
}
input UpdateMenuInput {
  title: String
  description: String
  url: String
  color: String
}
extend type Query {
  menus(
    query: JSON
    where: MenuFilter
    orderBy: MenuOrderBy
    skip: Int
    limit: Int
  ): [Menu]
  menu(id: String!): Menu
  menusConnection(
    query: JSON
    where: MenuFilter
    orderBy: MenuOrderBy
    skip: Int
    limit: Int
  ): MenuConnection
}
extend type Subscription {
  menuAdded: Menu
  menuUpdated: Menu
  menuDeleted: Menu
}
extend type Mutation {
  createMenu(input: CreateMenuInput): Menu
  updateMenu(input: UpdateMenuInput, id: String!): Menu
  deleteMenu(id: String!): Menu
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        menus: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.menuRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        menu: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.menuRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        menusConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.menuRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Menu: {
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
        menuAdded: {
            subscribe: () => pubSub.asyncIterator('menuAdded')
        },
        menuUpdated: {
            subscribe: () => pubSub.asyncIterator('menuUpdated')
        },
        menuDeleted: {
            subscribe: () => pubSub.asyncIterator('menuDeleted')
        },
    },
    Mutation: {
        createMenu: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.menuRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("menuAdded", { menuAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateMenu: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.menuRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("menuUpdated", { menuUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteMenu: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.menuRequester.send({ type: 'delete', id, headers })
                pubSub.publish("menuDeleted", { menuDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
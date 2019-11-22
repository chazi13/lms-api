export const typeDef = `
type Addons {
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
input AddonsFilter {
  AND: [AddonsFilter!]
  OR: [AddonsFilter!]
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
enum AddonsOrderBy {
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
type AddonsConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Addons]
}
input CreateAddonsInput {
  title: String!
  description: String!
  url: String
  color: String
}
input UpdateAddonsInput {
  title: String
  description: String
  url: String
  color: String
}
extend type Query {
  addons(
    query: JSON
    where: AddonsFilter
    orderBy: AddonsOrderBy
    skip: Int
    limit: Int
  ): [Addons]
  addon(id: String!): Addons
  addonsConnection(
    query: JSON
    where: AddonsFilter
    orderBy: AddonsOrderBy
    skip: Int
    limit: Int
  ): AddonsConnection
}
extend type Subscription {
  addonAdded: Addon
  addonUpdated: Addon
  addonDeleted: Addon
}
extend type Mutation {
  createAddon(input: CreateAddonInput): Addon
  updateAddon(input: UpdateAddonInput, id: String!): Addon
  deleteAddon(id: String!): Addon
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        addons: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.addonsRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        addon: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.addonsRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        addonsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.addonsRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Addons: {
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
        addonsAdded: {
            subscribe: () => pubSub.asyncIterator('addonsAdded')
        },
        addonsUpdated: {
            subscribe: () => pubSub.asyncIterator('addonsUpdated')
        },
        addonsDeleted: {
            subscribe: () => pubSub.asyncIterator('addonsDeleted')
        },
    },
    Mutation: {
        createAddons: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.addonsRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("addonsAdded", { addonsAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateAddons: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.addonsRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("addonsUpdated", { addonsUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteAddons: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.addonsRequester.send({ type: 'delete', id, headers })
                pubSub.publish("addonsDeleted", { addonsDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
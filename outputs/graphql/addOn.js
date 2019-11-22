export const typeDef = `
type AddOn {
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
input AddOnFilter {
  AND: [AddOnFilter!]
  OR: [AddOnFilter!]
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
enum AddOnOrderBy {
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
type AddOnConnection {
  total: Int
  limit: Int
  skip: Int
  data: [AddOn]
}
input CreateAddOnInput {
  title: String!
  description: String!
  url: String
  color: String
}
input UpdateAddOnInput {
  title: String
  description: String
  url: String
  color: String
}
extend type Query {
  addOns(
    query: JSON
    where: AddOnFilter
    orderBy: AddOnOrderBy
    skip: Int
    limit: Int
  ): [AddOn]
  addOn(id: String!): AddOn
  addOnsConnection(
    query: JSON
    where: AddOnFilter
    orderBy: AddOnOrderBy
    skip: Int
    limit: Int
  ): AddOnConnection
}
extend type Subscription {
  addOnAdded: AddOn
  addOnUpdated: AddOn
  addOnDeleted: AddOn
}
extend type Mutation {
  createAddOn(input: CreateAddOnInput): AddOn
  updateAddOn(input: UpdateAddOnInput, id: String!): AddOn
  deleteAddOn(id: String!): AddOn
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        addOns: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.addOnRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        addOn: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.addOnRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        addOnsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.addOnRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    AddOn: {
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
        addOnAdded: {
            subscribe: () => pubSub.asyncIterator('addOnAdded')
        },
        addOnUpdated: {
            subscribe: () => pubSub.asyncIterator('addOnUpdated')
        },
        addOnDeleted: {
            subscribe: () => pubSub.asyncIterator('addOnDeleted')
        },
    },
    Mutation: {
        createAddOn: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.addOnRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("addOnAdded", { addOnAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateAddOn: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.addOnRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("addOnUpdated", { addOnUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteAddOn: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.addOnRequester.send({ type: 'delete', id, headers })
                pubSub.publish("addOnDeleted", { addOnDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
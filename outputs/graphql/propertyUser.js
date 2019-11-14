export const typeDef = `
type PropertyUser {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  propertyId: String!
  users(query: JSON): User!
}
input PropertyUserFilter {
  AND: [PropertyUserFilter!]
  OR: [PropertyUserFilter!]
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
  propertyId: String
  propertyId_not: String
  propertyId_in: [String]
  propertyId_not_in: [String]
  propertyId_lt: String
  propertyId_lte: String
  propertyId_gt: String
  propertyId_gte: String
  propertyId_contains: String
  propertyId_not_contains: String
  propertyId_starts_with: String
  propertyId_not_starts_with: String
  propertyId_ends_with: String
  propertyId_not_ends_with: String
  users: UserFilter
  users_some: UserFilter
  users_none: UserFilter
}
enum PropertyUserOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  propertyId_ASC
  propertyId_DESC
}
type PropertyUserConnection {
  total: Int
  limit: Int
  skip: Int
  data: [PropertyUser]
}
input CreatePropertyUserInput {
  propertyId: String!
  usersId: String!
}
input UpdatePropertyUserInput {
  propertyId: String
  usersId: String
}
extend type Query {
  propertyUsers(
    query: JSON
    where: PropertyUserFilter
    orderBy: PropertyUserOrderBy
    skip: Int
    limit: Int
  ): [PropertyUser]
  propertyUser(id: String!): PropertyUser
  propertyUsersConnection(
    query: JSON
    where: PropertyUserFilter
    orderBy: PropertyUserOrderBy
    skip: Int
    limit: Int
  ): PropertyUserConnection
}
extend type Subscription {
  propertyUserAdded: PropertyUser
  propertyUserUpdated: PropertyUser
  propertyUserDeleted: PropertyUser
}
extend type Mutation {
  createPropertyUser(input: CreatePropertyUserInput): PropertyUser
  updatePropertyUser(input: UpdatePropertyUserInput, id: String!): PropertyUser
  deletePropertyUser(id: String!): PropertyUser
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        propertyUsers: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.propertyUserRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        propertyUser: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.propertyUserRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        propertyUsersConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.propertyUserRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    PropertyUser: {
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
        users: async ({ usersId }, args, { headers, requester }) => {
            try {
                return await requester.userRequester.send({ type: 'get', id: usersId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        propertyUserAdded: {
            subscribe: () => pubSub.asyncIterator('propertyUserAdded')
        },
        propertyUserUpdated: {
            subscribe: () => pubSub.asyncIterator('propertyUserUpdated')
        },
        propertyUserDeleted: {
            subscribe: () => pubSub.asyncIterator('propertyUserDeleted')
        },
    },
    Mutation: {
        createPropertyUser: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.propertyUserRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("propertyUserAdded", { propertyUserAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updatePropertyUser: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.propertyUserRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("propertyUserUpdated", { propertyUserUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deletePropertyUser: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.propertyUserRequester.send({ type: 'delete', id, headers })
                pubSub.publish("propertyUserDeleted", { propertyUserDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
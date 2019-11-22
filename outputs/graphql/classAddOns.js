export const typeDef = `
type ClassAddOns {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  addOn: AddOn
  classRoom: ClassRoom
}
input ClassAddOnsFilter {
  AND: [ClassAddOnsFilter!]
  OR: [ClassAddOnsFilter!]
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
  addOn: AddOnFilter
  addOn_some: AddOnFilter
  addOn_none: AddOnFilter
  classRoom: ClassRoomFilter
  classRoom_some: ClassRoomFilter
  classRoom_none: ClassRoomFilter
}
enum ClassAddOnsOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}
type ClassAddOnsConnection {
  total: Int
  limit: Int
  skip: Int
  data: [ClassAddOns]
}
input CreateClassAddOnsInput {
  addOnId: String
  classRoomId: String
}
input UpdateClassAddOnsInput {
  addOnId: String
  classRoomId: String
}
extend type Query {
  classAddOns(
    query: JSON
    where: ClassAddOnsFilter
    orderBy: ClassAddOnsOrderBy
    skip: Int
    limit: Int
  ): [ClassAddOns]
  classAddOn(id: String!): ClassAddOns
  classAddOnsConnection(
    query: JSON
    where: ClassAddOnsFilter
    orderBy: ClassAddOnsOrderBy
    skip: Int
    limit: Int
  ): ClassAddOnsConnection
}
extend type Subscription {
  classAddOnAdded: ClassAddOn
  classAddOnUpdated: ClassAddOn
  classAddOnDeleted: ClassAddOn
}
extend type Mutation {
  createClassAddOn(input: CreateClassAddOnInput): ClassAddOn
  updateClassAddOn(input: UpdateClassAddOnInput, id: String!): ClassAddOn
  deleteClassAddOn(id: String!): ClassAddOn
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        classAddOns: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.classAddOnsRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        classAddOn: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.classAddOnsRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        classAddOnsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.classAddOnsRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    ClassAddOns: {
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
        addOn: async ({ addOnId }, args, { headers, requester }) => {
            try {
                return await requester.addOnRequester.send({ type: 'get', id: addOnId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        classRoom: async ({ classRoomId }, args, { headers, requester }) => {
            try {
                return await requester.classRoomRequester.send({ type: 'get', id: classRoomId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        classAddOnsAdded: {
            subscribe: () => pubSub.asyncIterator('classAddOnsAdded')
        },
        classAddOnsUpdated: {
            subscribe: () => pubSub.asyncIterator('classAddOnsUpdated')
        },
        classAddOnsDeleted: {
            subscribe: () => pubSub.asyncIterator('classAddOnsDeleted')
        },
    },
    Mutation: {
        createClassAddOns: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.classAddOnsRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("classAddOnsAdded", { classAddOnsAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateClassAddOns: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.classAddOnsRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("classAddOnsUpdated", { classAddOnsUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteClassAddOns: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.classAddOnsRequester.send({ type: 'delete', id, headers })
                pubSub.publish("classAddOnsDeleted", { classAddOnsDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
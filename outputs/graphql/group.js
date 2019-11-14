export const typeDef = `
type Group {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  name: String!
  classRooms(query: JSON): [ClassRoom]
}
input GroupFilter {
  AND: [GroupFilter!]
  OR: [GroupFilter!]
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
  classRooms: ClassRoomFilter
  classRooms_some: ClassRoomFilter
  classRooms_none: ClassRoomFilter
}
enum GroupOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
}
type GroupConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Group]
}
input CreateGroupInput {
  name: String!
}
input UpdateGroupInput {
  name: String
}
extend type Query {
  groups(
    query: JSON
    where: GroupFilter
    orderBy: GroupOrderBy
    skip: Int
    limit: Int
  ): [Group]
  group(id: String!): Group
  groupsConnection(
    query: JSON
    where: GroupFilter
    orderBy: GroupOrderBy
    skip: Int
    limit: Int
  ): GroupConnection
}
extend type Subscription {
  groupAdded: Group
  groupUpdated: Group
  groupDeleted: Group
}
extend type Mutation {
  createGroup(input: CreateGroupInput): Group
  updateGroup(input: UpdateGroupInput, id: String!): Group
  deleteGroup(id: String!): Group
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        groups: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.groupRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        group: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.groupRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        groupsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.groupRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Group: {
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
        classRooms: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.classRoomRequester.send({ type: 'find', where: Object.assign({ groupId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        groupAdded: {
            subscribe: () => pubSub.asyncIterator('groupAdded')
        },
        groupUpdated: {
            subscribe: () => pubSub.asyncIterator('groupUpdated')
        },
        groupDeleted: {
            subscribe: () => pubSub.asyncIterator('groupDeleted')
        },
    },
    Mutation: {
        createGroup: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.groupRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("groupAdded", { groupAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateGroup: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.groupRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("groupUpdated", { groupUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteGroup: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.groupRequester.send({ type: 'delete', id, headers })
                pubSub.publish("groupDeleted", { groupDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
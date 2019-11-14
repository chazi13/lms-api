export const typeDef = `
type StudentGroup {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  student: Student
  group: Group
}
input StudentGroupFilter {
  AND: [StudentGroupFilter!]
  OR: [StudentGroupFilter!]
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
  student: StudentFilter
  student_some: StudentFilter
  student_none: StudentFilter
  group: GroupFilter
  group_some: GroupFilter
  group_none: GroupFilter
}
enum StudentGroupOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}
type StudentGroupConnection {
  total: Int
  limit: Int
  skip: Int
  data: [StudentGroup]
}
input CreateStudentGroupInput {
  studentId: String
  groupId: String
}
input UpdateStudentGroupInput {
  studentId: String
  groupId: String
}
extend type Query {
  studentGroups(
    query: JSON
    where: StudentGroupFilter
    orderBy: StudentGroupOrderBy
    skip: Int
    limit: Int
  ): [StudentGroup]
  studentGroup(id: String!): StudentGroup
  studentGroupsConnection(
    query: JSON
    where: StudentGroupFilter
    orderBy: StudentGroupOrderBy
    skip: Int
    limit: Int
  ): StudentGroupConnection
}
extend type Subscription {
  studentGroupAdded: StudentGroup
  studentGroupUpdated: StudentGroup
  studentGroupDeleted: StudentGroup
}
extend type Mutation {
  createStudentGroup(input: CreateStudentGroupInput): StudentGroup
  updateStudentGroup(input: UpdateStudentGroupInput, id: String!): StudentGroup
  deleteStudentGroup(id: String!): StudentGroup
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        studentGroups: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.studentGroupRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        studentGroup: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.studentGroupRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        studentGroupsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.studentGroupRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    StudentGroup: {
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
        student: async ({ studentId }, args, { headers, requester }) => {
            try {
                return await requester.studentRequester.send({ type: 'get', id: studentId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        group: async ({ groupId }, args, { headers, requester }) => {
            try {
                return await requester.groupRequester.send({ type: 'get', id: groupId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        studentGroupAdded: {
            subscribe: () => pubSub.asyncIterator('studentGroupAdded')
        },
        studentGroupUpdated: {
            subscribe: () => pubSub.asyncIterator('studentGroupUpdated')
        },
        studentGroupDeleted: {
            subscribe: () => pubSub.asyncIterator('studentGroupDeleted')
        },
    },
    Mutation: {
        createStudentGroup: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.studentGroupRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("studentGroupAdded", { studentGroupAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateStudentGroup: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.studentGroupRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("studentGroupUpdated", { studentGroupUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteStudentGroup: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.studentGroupRequester.send({ type: 'delete', id, headers })
                pubSub.publish("studentGroupDeleted", { studentGroupDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
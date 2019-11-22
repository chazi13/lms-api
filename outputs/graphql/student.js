export const typeDef = `
type Student {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  user: User
}
input StudentFilter {
  AND: [StudentFilter!]
  OR: [StudentFilter!]
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
  user: UserFilter
  user_some: UserFilter
  user_none: UserFilter
}
enum StudentOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}
type StudentConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Student]
}
input CreateStudentInput {
  userId: String
}
input UpdateStudentInput {
  userId: String
}
extend type Query {
  students(
    query: JSON
    where: StudentFilter
    orderBy: StudentOrderBy
    skip: Int
    limit: Int
  ): [Student]
  student(id: String!): Student
  studentsConnection(
    query: JSON
    where: StudentFilter
    orderBy: StudentOrderBy
    skip: Int
    limit: Int
  ): StudentConnection
}
extend type Subscription {
  studentAdded: Student
  studentUpdated: Student
  studentDeleted: Student
}
extend type Mutation {
  createStudent(input: CreateStudentInput): Student
  updateStudent(input: UpdateStudentInput, id: String!): Student
  deleteStudent(id: String!): Student
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        students: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.studentRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        student: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.studentRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        studentsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.studentRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Student: {
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
        user: async ({ userId }, args, { headers, requester }) => {
            try {
                return await requester.userRequester.send({ type: 'get', id: userId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        studentAdded: {
            subscribe: () => pubSub.asyncIterator('studentAdded')
        },
        studentUpdated: {
            subscribe: () => pubSub.asyncIterator('studentUpdated')
        },
        studentDeleted: {
            subscribe: () => pubSub.asyncIterator('studentDeleted')
        },
    },
    Mutation: {
        createStudent: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.studentRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("studentAdded", { studentAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateStudent: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.studentRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("studentUpdated", { studentUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteStudent: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.studentRequester.send({ type: 'delete', id, headers })
                pubSub.publish("studentDeleted", { studentDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
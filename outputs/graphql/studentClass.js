export const typeDef = `
type StudentClass {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  student: Student
  classroom: ClassRoom
}
input StudentClassFilter {
  AND: [StudentClassFilter!]
  OR: [StudentClassFilter!]
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
  classroom: ClassRoomFilter
  classroom_some: ClassRoomFilter
  classroom_none: ClassRoomFilter
}
enum StudentClassOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}
type StudentClassConnection {
  total: Int
  limit: Int
  skip: Int
  data: [StudentClass]
}
input CreateStudentClassInput {
  studentId: String
  classroomId: String
}
input UpdateStudentClassInput {
  studentId: String
  classroomId: String
}
extend type Query {
  studentClasses(
    query: JSON
    where: StudentClassFilter
    orderBy: StudentClassOrderBy
    skip: Int
    limit: Int
  ): [StudentClass]
  studentClass(id: String!): StudentClass
  studentClassesConnection(
    query: JSON
    where: StudentClassFilter
    orderBy: StudentClassOrderBy
    skip: Int
    limit: Int
  ): StudentClassConnection
}
extend type Subscription {
  studentClassAdded: StudentClass
  studentClassUpdated: StudentClass
  studentClassDeleted: StudentClass
}
extend type Mutation {
  createStudentClass(input: CreateStudentClassInput): StudentClass
  updateStudentClass(input: UpdateStudentClassInput, id: String!): StudentClass
  deleteStudentClass(id: String!): StudentClass
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        studentClasses: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.studentClassRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        studentClass: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.studentClassRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        studentClassesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.studentClassRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    StudentClass: {
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
        classroom: async ({ classroomId }, args, { headers, requester }) => {
            try {
                return await requester.classRoomRequester.send({ type: 'get', id: classroomId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        studentClassAdded: {
            subscribe: () => pubSub.asyncIterator('studentClassAdded')
        },
        studentClassUpdated: {
            subscribe: () => pubSub.asyncIterator('studentClassUpdated')
        },
        studentClassDeleted: {
            subscribe: () => pubSub.asyncIterator('studentClassDeleted')
        },
    },
    Mutation: {
        createStudentClass: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.studentClassRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("studentClassAdded", { studentClassAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateStudentClass: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.studentClassRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("studentClassUpdated", { studentClassUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteStudentClass: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.studentClassRequester.send({ type: 'delete', id, headers })
                pubSub.publish("studentClassDeleted", { studentClassDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
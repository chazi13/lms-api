export const typeDef = `
type StudentBoard {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  student: Student
  board: Board
}
input StudentBoardFilter {
  AND: [StudentBoardFilter!]
  OR: [StudentBoardFilter!]
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
  board: BoardFilter
  board_some: BoardFilter
  board_none: BoardFilter
}
enum StudentBoardOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}
type StudentBoardConnection {
  total: Int
  limit: Int
  skip: Int
  data: [StudentBoard]
}
input CreateStudentBoardInput {
  studentId: String
  boardId: String
}
input UpdateStudentBoardInput {
  studentId: String
  boardId: String
}
extend type Query {
  studentBoards(
    query: JSON
    where: StudentBoardFilter
    orderBy: StudentBoardOrderBy
    skip: Int
    limit: Int
  ): [StudentBoard]
  studentBoard(id: String!): StudentBoard
  studentBoardsConnection(
    query: JSON
    where: StudentBoardFilter
    orderBy: StudentBoardOrderBy
    skip: Int
    limit: Int
  ): StudentBoardConnection
}
extend type Subscription {
  studentBoardAdded: StudentBoard
  studentBoardUpdated: StudentBoard
  studentBoardDeleted: StudentBoard
}
extend type Mutation {
  createStudentBoard(input: CreateStudentBoardInput): StudentBoard
  updateStudentBoard(input: UpdateStudentBoardInput, id: String!): StudentBoard
  deleteStudentBoard(id: String!): StudentBoard
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        studentBoards: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.studentBoardRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        studentBoard: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.studentBoardRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        studentBoardsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.studentBoardRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    StudentBoard: {
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
        board: async ({ boardId }, args, { headers, requester }) => {
            try {
                return await requester.boardRequester.send({ type: 'get', id: boardId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        studentBoardAdded: {
            subscribe: () => pubSub.asyncIterator('studentBoardAdded')
        },
        studentBoardUpdated: {
            subscribe: () => pubSub.asyncIterator('studentBoardUpdated')
        },
        studentBoardDeleted: {
            subscribe: () => pubSub.asyncIterator('studentBoardDeleted')
        },
    },
    Mutation: {
        createStudentBoard: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.studentBoardRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("studentBoardAdded", { studentBoardAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateStudentBoard: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.studentBoardRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("studentBoardUpdated", { studentBoardUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteStudentBoard: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.studentBoardRequester.send({ type: 'delete', id, headers })
                pubSub.publish("studentBoardDeleted", { studentBoardDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
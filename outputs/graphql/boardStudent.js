export const typeDef = `
type BoardStudent {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  student: Student
  board: Board
}
input BoardStudentFilter {
  AND: [BoardStudentFilter!]
  OR: [BoardStudentFilter!]
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
enum BoardStudentOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}
type BoardStudentConnection {
  total: Int
  limit: Int
  skip: Int
  data: [BoardStudent]
}
input CreateBoardStudentInput {
  studentId: String
  boardId: String
}
input UpdateBoardStudentInput {
  studentId: String
  boardId: String
}
extend type Query {
  boardStudents(
    query: JSON
    where: BoardStudentFilter
    orderBy: BoardStudentOrderBy
    skip: Int
    limit: Int
  ): [BoardStudent]
  boardStudent(id: String!): BoardStudent
  boardStudentsConnection(
    query: JSON
    where: BoardStudentFilter
    orderBy: BoardStudentOrderBy
    skip: Int
    limit: Int
  ): BoardStudentConnection
}
extend type Subscription {
  boardStudentAdded: BoardStudent
  boardStudentUpdated: BoardStudent
  boardStudentDeleted: BoardStudent
}
extend type Mutation {
  createBoardStudent(input: CreateBoardStudentInput): BoardStudent
  updateBoardStudent(input: UpdateBoardStudentInput, id: String!): BoardStudent
  deleteBoardStudent(id: String!): BoardStudent
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        boardStudents: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.boardStudentRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        boardStudent: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.boardStudentRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        boardStudentsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.boardStudentRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    BoardStudent: {
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
        boardStudentAdded: {
            subscribe: () => pubSub.asyncIterator('boardStudentAdded')
        },
        boardStudentUpdated: {
            subscribe: () => pubSub.asyncIterator('boardStudentUpdated')
        },
        boardStudentDeleted: {
            subscribe: () => pubSub.asyncIterator('boardStudentDeleted')
        },
    },
    Mutation: {
        createBoardStudent: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.boardStudentRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("boardStudentAdded", { boardStudentAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateBoardStudent: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.boardStudentRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("boardStudentUpdated", { boardStudentUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteBoardStudent: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.boardStudentRequester.send({ type: 'delete', id, headers })
                pubSub.publish("boardStudentDeleted", { boardStudentDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
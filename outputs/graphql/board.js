export const typeDef = `
type Board {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  name: String!
  background: String!
  workspace: Workspace
  visible: Visible
  lists(query: JSON): [List]
  studentBoard(query: JSON): [StudentBoard]
}
input BoardFilter {
  AND: [BoardFilter!]
  OR: [BoardFilter!]
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
  background: String
  background_not: String
  background_in: [String]
  background_not_in: [String]
  background_lt: String
  background_lte: String
  background_gt: String
  background_gte: String
  background_contains: String
  background_not_contains: String
  background_starts_with: String
  background_not_starts_with: String
  background_ends_with: String
  background_not_ends_with: String
  workspace: WorkspaceFilter
  workspace_some: WorkspaceFilter
  workspace_none: WorkspaceFilter
  visible: Visible
  visible_not: Visible
  visible_in: [Visible]
  visible_not_in: [Visible]
  visible_lt: Visible
  visible_lte: Visible
  visible_gt: Visible
  visible_gte: Visible
  lists: ListFilter
  lists_some: ListFilter
  lists_none: ListFilter
  studentBoard: StudentBoardFilter
  studentBoard_some: StudentBoardFilter
  studentBoard_none: StudentBoardFilter
}
enum BoardOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
  background_ASC
  background_DESC
}
type BoardConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Board]
}
input CreateBoardInput {
  name: String!
  background: String!
  workspaceId: String
  visible: Visible
}
input UpdateBoardInput {
  name: String
  background: String
  workspaceId: String
  visible: Visible
}
extend type Query {
  boards(
    query: JSON
    where: BoardFilter
    orderBy: BoardOrderBy
    skip: Int
    limit: Int
  ): [Board]
  board(id: String!): Board
  boardsConnection(
    query: JSON
    where: BoardFilter
    orderBy: BoardOrderBy
    skip: Int
    limit: Int
  ): BoardConnection
}
extend type Subscription {
  boardAdded: Board
  boardUpdated: Board
  boardDeleted: Board
}
extend type Mutation {
  createBoard(input: CreateBoardInput): Board
  updateBoard(input: UpdateBoardInput, id: String!): Board
  deleteBoard(id: String!): Board
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        boards: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.boardRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        board: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.boardRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        boardsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.boardRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Board: {
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
        workspace: async ({ workspaceId }, args, { headers, requester }) => {
            try {
                return await requester.workspaceRequester.send({ type: 'get', id: workspaceId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        lists: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.listRequester.send({ type: 'find', where: Object.assign({ boardId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        studentBoards: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.studentBoardRequester.send({ type: 'find', where: Object.assign({ boardId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        boardAdded: {
            subscribe: () => pubSub.asyncIterator('boardAdded')
        },
        boardUpdated: {
            subscribe: () => pubSub.asyncIterator('boardUpdated')
        },
        boardDeleted: {
            subscribe: () => pubSub.asyncIterator('boardDeleted')
        },
    },
    Mutation: {
        createBoard: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.boardRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("boardAdded", { boardAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateBoard: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.boardRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("boardUpdated", { boardUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteBoard: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.boardRequester.send({ type: 'delete', id, headers })
                pubSub.publish("boardDeleted", { boardDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
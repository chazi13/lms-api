export const typeDef = `
type StudentWorkspace {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  student: Student
  workspace: Workspace
}
input StudentWorkspaceFilter {
  AND: [StudentWorkspaceFilter!]
  OR: [StudentWorkspaceFilter!]
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
  workspace: WorkspaceFilter
  workspace_some: WorkspaceFilter
  workspace_none: WorkspaceFilter
}
enum StudentWorkspaceOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}
type StudentWorkspaceConnection {
  total: Int
  limit: Int
  skip: Int
  data: [StudentWorkspace]
}
input CreateStudentWorkspaceInput {
  studentId: String
  workspaceId: String
}
input UpdateStudentWorkspaceInput {
  studentId: String
  workspaceId: String
}
extend type Query {
  studentWorkspaces(
    query: JSON
    where: StudentWorkspaceFilter
    orderBy: StudentWorkspaceOrderBy
    skip: Int
    limit: Int
  ): [StudentWorkspace]
  studentWorkspace(id: String!): StudentWorkspace
  studentWorkspacesConnection(
    query: JSON
    where: StudentWorkspaceFilter
    orderBy: StudentWorkspaceOrderBy
    skip: Int
    limit: Int
  ): StudentWorkspaceConnection
}
extend type Subscription {
  studentWorkspaceAdded: StudentWorkspace
  studentWorkspaceUpdated: StudentWorkspace
  studentWorkspaceDeleted: StudentWorkspace
}
extend type Mutation {
  createStudentWorkspace(input: CreateStudentWorkspaceInput): StudentWorkspace
  updateStudentWorkspace(
    input: UpdateStudentWorkspaceInput
    id: String!
  ): StudentWorkspace
  deleteStudentWorkspace(id: String!): StudentWorkspace
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        studentWorkspaces: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.studentWorkspaceRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        studentWorkspace: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.studentWorkspaceRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        studentWorkspacesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.studentWorkspaceRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    StudentWorkspace: {
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
        workspace: async ({ workspaceId }, args, { headers, requester }) => {
            try {
                return await requester.workspaceRequester.send({ type: 'get', id: workspaceId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        studentWorkspaceAdded: {
            subscribe: () => pubSub.asyncIterator('studentWorkspaceAdded')
        },
        studentWorkspaceUpdated: {
            subscribe: () => pubSub.asyncIterator('studentWorkspaceUpdated')
        },
        studentWorkspaceDeleted: {
            subscribe: () => pubSub.asyncIterator('studentWorkspaceDeleted')
        },
    },
    Mutation: {
        createStudentWorkspace: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.studentWorkspaceRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("studentWorkspaceAdded", { studentWorkspaceAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateStudentWorkspace: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.studentWorkspaceRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("studentWorkspaceUpdated", { studentWorkspaceUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteStudentWorkspace: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.studentWorkspaceRequester.send({ type: 'delete', id, headers })
                pubSub.publish("studentWorkspaceDeleted", { studentWorkspaceDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
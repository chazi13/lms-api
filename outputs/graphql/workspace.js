export const typeDef = `
type Workspace {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  name: String!
  description: String!
  boards(query: JSON): [Board]
  users(query: JSON): [User]
  space: Space
}
input WorkspaceFilter {
  AND: [WorkspaceFilter!]
  OR: [WorkspaceFilter!]
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
  description: String
  description_not: String
  description_in: [String]
  description_not_in: [String]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  boards: BoardFilter
  boards_some: BoardFilter
  boards_none: BoardFilter
  users: UserFilter
  users_some: UserFilter
  users_none: UserFilter
  space: SpaceFilter
  space_some: SpaceFilter
  space_none: SpaceFilter
}
enum WorkspaceOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
  description_ASC
  description_DESC
}
type WorkspaceConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Workspace]
}
input CreateWorkspaceInput {
  name: String!
  description: String!
  spaceId: String
}
input UpdateWorkspaceInput {
  name: String
  description: String
  spaceId: String
}
extend type Query {
  workspaces(
    query: JSON
    where: WorkspaceFilter
    orderBy: WorkspaceOrderBy
    skip: Int
    limit: Int
  ): [Workspace]
  workspace(id: String!): Workspace
  workspacesConnection(
    query: JSON
    where: WorkspaceFilter
    orderBy: WorkspaceOrderBy
    skip: Int
    limit: Int
  ): WorkspaceConnection
}
extend type Subscription {
  workspaceAdded: Workspace
  workspaceUpdated: Workspace
  workspaceDeleted: Workspace
}
extend type Mutation {
  createWorkspace(input: CreateWorkspaceInput): Workspace
  updateWorkspace(input: UpdateWorkspaceInput, id: String!): Workspace
  deleteWorkspace(id: String!): Workspace
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        workspaces: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.workspaceRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        workspace: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.workspaceRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        workspacesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.workspaceRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Workspace: {
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
        boards: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.boardRequester.send({ type: 'find', where: Object.assign({ workspaceId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        users: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.userRequester.send({ type: 'find', where: Object.assign({ workspaceId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        space: async ({ spaceId }, args, { headers, requester }) => {
            try {
                return await requester.spaceRequester.send({ type: 'get', id: spaceId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        workspaceAdded: {
            subscribe: () => pubSub.asyncIterator('workspaceAdded')
        },
        workspaceUpdated: {
            subscribe: () => pubSub.asyncIterator('workspaceUpdated')
        },
        workspaceDeleted: {
            subscribe: () => pubSub.asyncIterator('workspaceDeleted')
        },
    },
    Mutation: {
        createWorkspace: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.workspaceRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("workspaceAdded", { workspaceAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateWorkspace: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.workspaceRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("workspaceUpdated", { workspaceUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteWorkspace: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.workspaceRequester.send({ type: 'delete', id, headers })
                pubSub.publish("workspaceDeleted", { workspaceDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
export const typeDef = `
type Folder {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  name: String!
  files(query: JSON): [UserFile]
}
input FolderFilter {
  AND: [FolderFilter!]
  OR: [FolderFilter!]
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
  files: UserFileFilter
  files_some: UserFileFilter
  files_none: UserFileFilter
}
enum FolderOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
}
type FolderConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Folder]
}
input CreateFolderInput {
  name: String!
}
input UpdateFolderInput {
  name: String
}
extend type Query {
  folders(
    query: JSON
    where: FolderFilter
    orderBy: FolderOrderBy
    skip: Int
    limit: Int
  ): [Folder]
  folder(id: String!): Folder
  foldersConnection(
    query: JSON
    where: FolderFilter
    orderBy: FolderOrderBy
    skip: Int
    limit: Int
  ): FolderConnection
}
extend type Subscription {
  folderAdded: Folder
  folderUpdated: Folder
  folderDeleted: Folder
}
extend type Mutation {
  createFolder(input: CreateFolderInput): Folder
  updateFolder(input: UpdateFolderInput, id: String!): Folder
  deleteFolder(id: String!): Folder
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        folders: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.folderRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        folder: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.folderRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        foldersConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.folderRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Folder: {
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
        files: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.userFileRequester.send({ type: 'find', where: Object.assign({ folderId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        folderAdded: {
            subscribe: () => pubSub.asyncIterator('folderAdded')
        },
        folderUpdated: {
            subscribe: () => pubSub.asyncIterator('folderUpdated')
        },
        folderDeleted: {
            subscribe: () => pubSub.asyncIterator('folderDeleted')
        },
    },
    Mutation: {
        createFolder: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.folderRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("folderAdded", { folderAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateFolder: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.folderRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("folderUpdated", { folderUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteFolder: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.folderRequester.send({ type: 'delete', id, headers })
                pubSub.publish("folderDeleted", { folderDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
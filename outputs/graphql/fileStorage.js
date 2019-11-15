export const typeDef = `
type FileStorage {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  name: String
  folders(query: JSON): [Folder]
  files(query: JSON): [UserFile]
}
input FileStorageFilter {
  AND: [FileStorageFilter!]
  OR: [FileStorageFilter!]
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
  folders: FolderFilter
  folders_some: FolderFilter
  folders_none: FolderFilter
  files: UserFileFilter
  files_some: UserFileFilter
  files_none: UserFileFilter
}
enum FileStorageOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
}
type FileStorageConnection {
  total: Int
  limit: Int
  skip: Int
  data: [FileStorage]
}
input CreateFileStorageInput {
  name: String
}
input UpdateFileStorageInput {
  name: String
}
extend type Query {
  fileStorages(
    query: JSON
    where: FileStorageFilter
    orderBy: FileStorageOrderBy
    skip: Int
    limit: Int
  ): [FileStorage]
  fileStorage(id: String!): FileStorage
  fileStoragesConnection(
    query: JSON
    where: FileStorageFilter
    orderBy: FileStorageOrderBy
    skip: Int
    limit: Int
  ): FileStorageConnection
}
extend type Subscription {
  fileStorageAdded: FileStorage
  fileStorageUpdated: FileStorage
  fileStorageDeleted: FileStorage
}
extend type Mutation {
  createFileStorage(input: CreateFileStorageInput): FileStorage
  updateFileStorage(input: UpdateFileStorageInput, id: String!): FileStorage
  deleteFileStorage(id: String!): FileStorage
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        fileStorages: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.fileStorageRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        fileStorage: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.fileStorageRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        fileStoragesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.fileStorageRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    FileStorage: {
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
        folders: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.folderRequester.send({ type: 'find', where: Object.assign({ fileStorageId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        files: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.userFileRequester.send({ type: 'find', where: Object.assign({ fileStorageId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        fileStorageAdded: {
            subscribe: () => pubSub.asyncIterator('fileStorageAdded')
        },
        fileStorageUpdated: {
            subscribe: () => pubSub.asyncIterator('fileStorageUpdated')
        },
        fileStorageDeleted: {
            subscribe: () => pubSub.asyncIterator('fileStorageDeleted')
        },
    },
    Mutation: {
        createFileStorage: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.fileStorageRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("fileStorageAdded", { fileStorageAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateFileStorage: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.fileStorageRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("fileStorageUpdated", { fileStorageUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteFileStorage: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.fileStorageRequester.send({ type: 'delete', id, headers })
                pubSub.publish("fileStorageDeleted", { fileStorageDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
export const typeDef = `
type File {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  name: String
  type: String
  embedLink: String
  url: String
  folder: Folder
  classRoom: ClassRoom
}
input FileFilter {
  AND: [FileFilter!]
  OR: [FileFilter!]
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
  type: String
  type_not: String
  type_in: [String]
  type_not_in: [String]
  type_lt: String
  type_lte: String
  type_gt: String
  type_gte: String
  type_contains: String
  type_not_contains: String
  type_starts_with: String
  type_not_starts_with: String
  type_ends_with: String
  type_not_ends_with: String
  embedLink: String
  embedLink_not: String
  embedLink_in: [String]
  embedLink_not_in: [String]
  embedLink_lt: String
  embedLink_lte: String
  embedLink_gt: String
  embedLink_gte: String
  embedLink_contains: String
  embedLink_not_contains: String
  embedLink_starts_with: String
  embedLink_not_starts_with: String
  embedLink_ends_with: String
  embedLink_not_ends_with: String
  url: String
  url_not: String
  url_in: [String]
  url_not_in: [String]
  url_lt: String
  url_lte: String
  url_gt: String
  url_gte: String
  url_contains: String
  url_not_contains: String
  url_starts_with: String
  url_not_starts_with: String
  url_ends_with: String
  url_not_ends_with: String
  folder: FolderFilter
  folder_some: FolderFilter
  folder_none: FolderFilter
  classRoom: ClassRoomFilter
  classRoom_some: ClassRoomFilter
  classRoom_none: ClassRoomFilter
}
enum FileOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
  type_ASC
  type_DESC
  embedLink_ASC
  embedLink_DESC
  url_ASC
  url_DESC
}
type FileConnection {
  total: Int
  limit: Int
  skip: Int
  data: [File]
}
input CreateFileInput {
  name: String
  type: String
  embedLink: String
  url: Upload
  folderId: String
  classRoomId: String
}
input UpdateFileInput {
  name: String
  type: String
  embedLink: String
  url: Upload
  folderId: String
  classRoomId: String
}
extend type Query {
  files(
    query: JSON
    where: FileFilter
    orderBy: FileOrderBy
    skip: Int
    limit: Int
  ): [File]
  file(id: String!): File
  filesConnection(
    query: JSON
    where: FileFilter
    orderBy: FileOrderBy
    skip: Int
    limit: Int
  ): FileConnection
}
extend type Subscription {
  fileAdded: File
  fileUpdated: File
  fileDeleted: File
}
extend type Mutation {
  createFile(input: CreateFileInput): File
  updateFile(input: UpdateFileInput, id: String!): File
  deleteFile(id: String!): File
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        files: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.fileRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        file: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.fileRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        filesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.fileRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    File: {
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
        folder: async ({ folderId }, args, { headers, requester }) => {
            try {
                return await requester.folderRequester.send({ type: 'get', id: folderId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        classRoom: async ({ classRoomId }, args, { headers, requester }) => {
            try {
                return await requester.classRoomRequester.send({ type: 'get', id: classRoomId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        fileAdded: {
            subscribe: () => pubSub.asyncIterator('fileAdded')
        },
        fileUpdated: {
            subscribe: () => pubSub.asyncIterator('fileUpdated')
        },
        fileDeleted: {
            subscribe: () => pubSub.asyncIterator('fileDeleted')
        },
    },
    Mutation: {
        createFile: async (_, { input = {} }, { requester: { fileRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.url) {
                    let imageFile = await input.url
                    const key = "file/" + uuid() + "." + imageFile.mimetype.split("/")[1]
                    const url = storageUrl + key
                    input.url = url
                    const rs = imageFile.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const file = fileRequester.send({
                                type: 'create',
                                body: input,
                                headers,
                                file: {
                                    buffer,
                                    key,
                                    mimeType: imageFile.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("fileAdded", { fileAdded: file })
                            resolve(file)
                        })
                    })
                } else {
                    let file = await fileRequester.send({ type: 'create', body: input, headers })
                    pubSub.publish("fileAdded", { fileAdded: file })
                    return file
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        updateFile: async (_, { input = {}, id }, { requester: { fileRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.url) {
                    let imageFile = await input.url
                    delete input.url

                    const rs = imageFile.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const file = await fileRequester.send({
                                type: 'patch',
                                body: input,
                                id,
                                headers,
                                file: {
                                    buffer,
                                    mimeType: imageFile.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("fileUpdated", { fileUpdated: file })
                            resolve(file)
                        })

                    })
                } else {
                    let file = await fileRequester.send({ type: 'patch', body: input, id, headers })
                    pubSub.publish("fileUpdated", { fileUpdated: file })
                    return file
                }
            } catch (e) {
                throw new Error(e)
            }

        },
        deleteFile: async (_, { id }, { requester: { fileRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                let file = await fileRequester.send({ type: 'delete', id, headers })
                if (file.url) {
                    const key = file.url.split(storageUrl).join("")
                    storageRequester.send({
                        type: "deleteFile",
                        body: {
                            bucket,
                            key
                        }
                    })
                }
                pubSub.publish("fileDeleted", { fileDeleted: file })
                return file
            } catch (e) {
                throw new Error(e)
            }
        },
    }
})
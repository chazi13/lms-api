export const typeDef = `
type UserFile {
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
  space: Space
}
input UserFileFilter {
  AND: [UserFileFilter!]
  OR: [UserFileFilter!]
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
  space: SpaceFilter
  space_some: SpaceFilter
  space_none: SpaceFilter
}
enum UserFileOrderBy {
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
type UserFileConnection {
  total: Int
  limit: Int
  skip: Int
  data: [UserFile]
}
input CreateUserFileInput {
  name: String
  type: String
  embedLink: String
  url: Upload
  folderId: String
  spaceId: String
}
input UpdateUserFileInput {
  name: String
  type: String
  embedLink: String
  url: Upload
  folderId: String
  spaceId: String
}
extend type Query {
  userFiles(
    query: JSON
    where: UserFileFilter
    orderBy: UserFileOrderBy
    skip: Int
    limit: Int
  ): [UserFile]
  userFile(id: String!): UserFile
  userFilesConnection(
    query: JSON
    where: UserFileFilter
    orderBy: UserFileOrderBy
    skip: Int
    limit: Int
  ): UserFileConnection
}
extend type Subscription {
  userFileAdded: UserFile
  userFileUpdated: UserFile
  userFileDeleted: UserFile
}
extend type Mutation {
  createUserFile(input: CreateUserFileInput): UserFile
  updateUserFile(input: UpdateUserFileInput, id: String!): UserFile
  deleteUserFile(id: String!): UserFile
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        userFiles: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.userFileRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        userFile: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.userFileRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        userFilesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.userFileRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    UserFile: {
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
        space: async ({ spaceId }, args, { headers, requester }) => {
            try {
                return await requester.spaceRequester.send({ type: 'get', id: spaceId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        userFileAdded: {
            subscribe: () => pubSub.asyncIterator('userFileAdded')
        },
        userFileUpdated: {
            subscribe: () => pubSub.asyncIterator('userFileUpdated')
        },
        userFileDeleted: {
            subscribe: () => pubSub.asyncIterator('userFileDeleted')
        },
    },
    Mutation: {
        createUserFile: async (_, { input = {} }, { requester: { userFileRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.url) {
                    let imageUserFile = await input.url
                    const key = "userFile/" + uuid() + "." + imageUserFile.mimetype.split("/")[1]
                    const url = storageUrl + key
                    input.url = url
                    const rs = imageUserFile.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const userFile = userFileRequester.send({
                                type: 'create',
                                body: input,
                                headers,
                                file: {
                                    buffer,
                                    key,
                                    mimeType: imageUserFile.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("userFileAdded", { userFileAdded: userFile })
                            resolve(userFile)
                        })
                    })
                } else {
                    let userFile = await userFileRequester.send({ type: 'create', body: input, headers })
                    pubSub.publish("userFileAdded", { userFileAdded: userFile })
                    return userFile
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        updateUserFile: async (_, { input = {}, id }, { requester: { userFileRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.url) {
                    let imageUserFile = await input.url
                    delete input.url

                    const rs = imageUserFile.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const userFile = await userFileRequester.send({
                                type: 'patch',
                                body: input,
                                id,
                                headers,
                                file: {
                                    buffer,
                                    mimeType: imageUserFile.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("userFileUpdated", { userFileUpdated: userFile })
                            resolve(userFile)
                        })

                    })
                } else {
                    let userFile = await userFileRequester.send({ type: 'patch', body: input, id, headers })
                    pubSub.publish("userFileUpdated", { userFileUpdated: userFile })
                    return userFile
                }
            } catch (e) {
                throw new Error(e)
            }

        },
        deleteUserFile: async (_, { id }, { requester: { userFileRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                let userFile = await userFileRequester.send({ type: 'delete', id, headers })
                if (userFile.url) {
                    const key = userFile.url.split(storageUrl).join("")
                    storageRequester.send({
                        type: "deleteFile",
                        body: {
                            bucket,
                            key
                        }
                    })
                }
                pubSub.publish("userFileDeleted", { userFileDeleted: userFile })
                return userFile
            } catch (e) {
                throw new Error(e)
            }
        },
    }
})
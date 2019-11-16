export const typeDef = `
type Image {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  name: String
  url: String!
}
input ImageFilter {
  AND: [ImageFilter!]
  OR: [ImageFilter!]
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
}
enum ImageOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
  url_ASC
  url_DESC
}
type ImageConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Image]
}
input CreateImageInput {
  name: String
  url: Upload!
}
input UpdateImageInput {
  name: String
  url: Upload
}
extend type Query {
  images(
    query: JSON
    where: ImageFilter
    orderBy: ImageOrderBy
    skip: Int
    limit: Int
  ): [Image]
  image(id: String!): Image
  imagesConnection(
    query: JSON
    where: ImageFilter
    orderBy: ImageOrderBy
    skip: Int
    limit: Int
  ): ImageConnection
}
extend type Subscription {
  imageAdded: Image
  imageUpdated: Image
  imageDeleted: Image
}
extend type Mutation {
  createImage(input: CreateImageInput): Image
  updateImage(input: UpdateImageInput, id: String!): Image
  deleteImage(id: String!): Image
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        images: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.imageRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        image: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.imageRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        imagesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.imageRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Image: {
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
    },
    Subscription: {
        imageAdded: {
            subscribe: () => pubSub.asyncIterator('imageAdded')
        },
        imageUpdated: {
            subscribe: () => pubSub.asyncIterator('imageUpdated')
        },
        imageDeleted: {
            subscribe: () => pubSub.asyncIterator('imageDeleted')
        },
    },
    Mutation: {
        createImage: async (_, { input = {} }, { requester: { imageRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.url) {
                    let imageImage = await input.url
                    const key = "image/" + uuid() + "." + imageImage.mimetype.split("/")[1]
                    const url = storageUrl + key
                    input.url = url
                    const rs = imageImage.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const image = imageRequester.send({
                                type: 'create',
                                body: input,
                                headers,
                                file: {
                                    buffer,
                                    key,
                                    mimeType: imageImage.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("imageAdded", { imageAdded: image })
                            resolve(image)
                        })
                    })
                } else {
                    let image = await imageRequester.send({ type: 'create', body: input, headers })
                    pubSub.publish("imageAdded", { imageAdded: image })
                    return image
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        updateImage: async (_, { input = {}, id }, { requester: { imageRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.url) {
                    let imageImage = await input.url
                    delete input.url

                    const rs = imageImage.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const image = await imageRequester.send({
                                type: 'patch',
                                body: input,
                                id,
                                headers,
                                file: {
                                    buffer,
                                    mimeType: imageImage.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("imageUpdated", { imageUpdated: image })
                            resolve(image)
                        })

                    })
                } else {
                    let image = await imageRequester.send({ type: 'patch', body: input, id, headers })
                    pubSub.publish("imageUpdated", { imageUpdated: image })
                    return image
                }
            } catch (e) {
                throw new Error(e)
            }

        },
        deleteImage: async (_, { id }, { requester: { imageRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                let image = await imageRequester.send({ type: 'delete', id, headers })
                if (image.url) {
                    const key = image.url.split(storageUrl).join("")
                    storageRequester.send({
                        type: "deleteFile",
                        body: {
                            bucket,
                            key
                        }
                    })
                }
                pubSub.publish("imageDeleted", { imageDeleted: image })
                return image
            } catch (e) {
                throw new Error(e)
            }
        },
    }
})
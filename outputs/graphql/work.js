export const typeDef = `
type Work {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  title: String!
  company: String!
  address: String!
  startDate: Date!
  endDate: Date
  present: Boolean
  description: String
  thumbnail: String
}
input WorkFilter {
  AND: [WorkFilter!]
  OR: [WorkFilter!]
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
  title: String
  title_not: String
  title_in: [String]
  title_not_in: [String]
  title_lt: String
  title_lte: String
  title_gt: String
  title_gte: String
  title_contains: String
  title_not_contains: String
  title_starts_with: String
  title_not_starts_with: String
  title_ends_with: String
  title_not_ends_with: String
  company: String
  company_not: String
  company_in: [String]
  company_not_in: [String]
  company_lt: String
  company_lte: String
  company_gt: String
  company_gte: String
  company_contains: String
  company_not_contains: String
  company_starts_with: String
  company_not_starts_with: String
  company_ends_with: String
  company_not_ends_with: String
  address: String
  address_not: String
  address_in: [String]
  address_not_in: [String]
  address_lt: String
  address_lte: String
  address_gt: String
  address_gte: String
  address_contains: String
  address_not_contains: String
  address_starts_with: String
  address_not_starts_with: String
  address_ends_with: String
  address_not_ends_with: String
  startDate: Date
  startDate_not: Date
  startDate_in: [Date]
  startDate_not_in: [Date]
  startDate_lt: Date
  startDate_lte: Date
  startDate_gt: Date
  startDate_gte: Date
  endDate: Date
  endDate_not: Date
  endDate_in: [Date]
  endDate_not_in: [Date]
  endDate_lt: Date
  endDate_lte: Date
  endDate_gt: Date
  endDate_gte: Date
  present: Boolean
  present_not: Boolean
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
  thumbnail: String
  thumbnail_not: String
  thumbnail_in: [String]
  thumbnail_not_in: [String]
  thumbnail_lt: String
  thumbnail_lte: String
  thumbnail_gt: String
  thumbnail_gte: String
  thumbnail_contains: String
  thumbnail_not_contains: String
  thumbnail_starts_with: String
  thumbnail_not_starts_with: String
  thumbnail_ends_with: String
  thumbnail_not_ends_with: String
}
enum WorkOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  title_ASC
  title_DESC
  company_ASC
  company_DESC
  address_ASC
  address_DESC
  startDate_ASC
  startDate_DESC
  endDate_ASC
  endDate_DESC
  present_ASC
  present_DESC
  description_ASC
  description_DESC
  thumbnail_ASC
  thumbnail_DESC
}
type WorkConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Work]
}
input CreateWorkInput {
  title: String!
  company: String!
  address: String!
  startDate: Date!
  endDate: Date
  present: Boolean
  description: String
  thumbnail: Upload
}
input UpdateWorkInput {
  title: String
  company: String
  address: String
  startDate: Date
  endDate: Date
  present: Boolean
  description: String
  thumbnail: Upload
}
extend type Query {
  works(
    query: JSON
    where: WorkFilter
    orderBy: WorkOrderBy
    skip: Int
    limit: Int
  ): [Work]
  work(id: String!): Work
  worksConnection(
    query: JSON
    where: WorkFilter
    orderBy: WorkOrderBy
    skip: Int
    limit: Int
  ): WorkConnection
}
extend type Subscription {
  workAdded: Work
  workUpdated: Work
  workDeleted: Work
}
extend type Mutation {
  createWork(input: CreateWorkInput): Work
  updateWork(input: UpdateWorkInput, id: String!): Work
  deleteWork(id: String!): Work
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        works: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.workRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        work: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.workRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        worksConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.workRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Work: {
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
        workAdded: {
            subscribe: () => pubSub.asyncIterator('workAdded')
        },
        workUpdated: {
            subscribe: () => pubSub.asyncIterator('workUpdated')
        },
        workDeleted: {
            subscribe: () => pubSub.asyncIterator('workDeleted')
        },
    },
    Mutation: {
        createWork: async (_, { input = {} }, { requester: { workRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.thumbnail) {
                    let imageWork = await input.thumbnail
                    const key = "work/" + uuid() + "." + imageWork.mimetype.split("/")[1]
                    const url = storageUrl + key
                    input.thumbnail = url
                    const rs = imageWork.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const work = workRequester.send({
                                type: 'create',
                                body: input,
                                headers,
                                file: {
                                    buffer,
                                    key,
                                    mimeType: imageWork.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("workAdded", { workAdded: work })
                            resolve(work)
                        })
                    })
                } else {
                    let work = await workRequester.send({ type: 'create', body: input, headers })
                    pubSub.publish("workAdded", { workAdded: work })
                    return work
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        updateWork: async (_, { input = {}, id }, { requester: { workRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.thumbnail) {
                    let imageWork = await input.thumbnail
                    delete input.thumbnail

                    const rs = imageWork.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const work = await workRequester.send({
                                type: 'patch',
                                body: input,
                                id,
                                headers,
                                file: {
                                    buffer,
                                    mimeType: imageWork.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("workUpdated", { workUpdated: work })
                            resolve(work)
                        })

                    })
                } else {
                    let work = await workRequester.send({ type: 'patch', body: input, id, headers })
                    pubSub.publish("workUpdated", { workUpdated: work })
                    return work
                }
            } catch (e) {
                throw new Error(e)
            }

        },
        deleteWork: async (_, { id }, { requester: { workRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                let work = await workRequester.send({ type: 'delete', id, headers })
                if (work.url) {
                    const key = work.url.split(storageUrl).join("")
                    storageRequester.send({
                        type: "deleteFile",
                        body: {
                            bucket,
                            key
                        }
                    })
                }
                pubSub.publish("workDeleted", { workDeleted: work })
                return work
            } catch (e) {
                throw new Error(e)
            }
        },
    }
})
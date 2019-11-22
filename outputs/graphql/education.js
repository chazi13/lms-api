export const typeDef = `
type Education {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  school: String!
  degree: String!
  study: String!
  yearStart: Int!
  yearEnd: Int
  description: String
  thumbnail: String
}
input EducationFilter {
  AND: [EducationFilter!]
  OR: [EducationFilter!]
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
  school: String
  school_not: String
  school_in: [String]
  school_not_in: [String]
  school_lt: String
  school_lte: String
  school_gt: String
  school_gte: String
  school_contains: String
  school_not_contains: String
  school_starts_with: String
  school_not_starts_with: String
  school_ends_with: String
  school_not_ends_with: String
  degree: String
  degree_not: String
  degree_in: [String]
  degree_not_in: [String]
  degree_lt: String
  degree_lte: String
  degree_gt: String
  degree_gte: String
  degree_contains: String
  degree_not_contains: String
  degree_starts_with: String
  degree_not_starts_with: String
  degree_ends_with: String
  degree_not_ends_with: String
  study: String
  study_not: String
  study_in: [String]
  study_not_in: [String]
  study_lt: String
  study_lte: String
  study_gt: String
  study_gte: String
  study_contains: String
  study_not_contains: String
  study_starts_with: String
  study_not_starts_with: String
  study_ends_with: String
  study_not_ends_with: String
  yearStart: Int
  yearStart_not: Int
  yearStart_in: [Int]
  yearStart_not_in: [Int]
  yearStart_lt: Int
  yearStart_lte: Int
  yearStart_gt: Int
  yearStart_gte: Int
  yearEnd: Int
  yearEnd_not: Int
  yearEnd_in: [Int]
  yearEnd_not_in: [Int]
  yearEnd_lt: Int
  yearEnd_lte: Int
  yearEnd_gt: Int
  yearEnd_gte: Int
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
enum EducationOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  school_ASC
  school_DESC
  degree_ASC
  degree_DESC
  study_ASC
  study_DESC
  yearStart_ASC
  yearStart_DESC
  yearEnd_ASC
  yearEnd_DESC
  description_ASC
  description_DESC
  thumbnail_ASC
  thumbnail_DESC
}
type EducationConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Education]
}
input CreateEducationInput {
  school: String!
  degree: String!
  study: String!
  yearStart: Int!
  yearEnd: Int
  description: String
  thumbnail: Upload
}
input UpdateEducationInput {
  school: String
  degree: String
  study: String
  yearStart: Int
  yearEnd: Int
  description: String
  thumbnail: Upload
}
extend type Query {
  educations(
    query: JSON
    where: EducationFilter
    orderBy: EducationOrderBy
    skip: Int
    limit: Int
  ): [Education]
  education(id: String!): Education
  educationsConnection(
    query: JSON
    where: EducationFilter
    orderBy: EducationOrderBy
    skip: Int
    limit: Int
  ): EducationConnection
}
extend type Subscription {
  educationAdded: Education
  educationUpdated: Education
  educationDeleted: Education
}
extend type Mutation {
  createEducation(input: CreateEducationInput): Education
  updateEducation(input: UpdateEducationInput, id: String!): Education
  deleteEducation(id: String!): Education
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        educations: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.educationRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        education: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.educationRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        educationsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.educationRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Education: {
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
        educationAdded: {
            subscribe: () => pubSub.asyncIterator('educationAdded')
        },
        educationUpdated: {
            subscribe: () => pubSub.asyncIterator('educationUpdated')
        },
        educationDeleted: {
            subscribe: () => pubSub.asyncIterator('educationDeleted')
        },
    },
    Mutation: {
        createEducation: async (_, { input = {} }, { requester: { educationRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.thumbnail) {
                    let imageEducation = await input.thumbnail
                    const key = "education/" + uuid() + "." + imageEducation.mimetype.split("/")[1]
                    const url = storageUrl + key
                    input.thumbnail = url
                    const rs = imageEducation.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const education = educationRequester.send({
                                type: 'create',
                                body: input,
                                headers,
                                file: {
                                    buffer,
                                    key,
                                    mimeType: imageEducation.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("educationAdded", { educationAdded: education })
                            resolve(education)
                        })
                    })
                } else {
                    let education = await educationRequester.send({ type: 'create', body: input, headers })
                    pubSub.publish("educationAdded", { educationAdded: education })
                    return education
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        updateEducation: async (_, { input = {}, id }, { requester: { educationRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.thumbnail) {
                    let imageEducation = await input.thumbnail
                    delete input.thumbnail

                    const rs = imageEducation.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const education = await educationRequester.send({
                                type: 'patch',
                                body: input,
                                id,
                                headers,
                                file: {
                                    buffer,
                                    mimeType: imageEducation.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("educationUpdated", { educationUpdated: education })
                            resolve(education)
                        })

                    })
                } else {
                    let education = await educationRequester.send({ type: 'patch', body: input, id, headers })
                    pubSub.publish("educationUpdated", { educationUpdated: education })
                    return education
                }
            } catch (e) {
                throw new Error(e)
            }

        },
        deleteEducation: async (_, { id }, { requester: { educationRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                let education = await educationRequester.send({ type: 'delete', id, headers })
                if (education.url) {
                    const key = education.url.split(storageUrl).join("")
                    storageRequester.send({
                        type: "deleteFile",
                        body: {
                            bucket,
                            key
                        }
                    })
                }
                pubSub.publish("educationDeleted", { educationDeleted: education })
                return education
            } catch (e) {
                throw new Error(e)
            }
        },
    }
})
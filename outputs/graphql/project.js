export const typeDef = `
type Project {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  title: String!
  link: String!
  note: String
  projectType: ProjectType!
  thumbnail: String
}
input ProjectFilter {
  AND: [ProjectFilter!]
  OR: [ProjectFilter!]
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
  link: String
  link_not: String
  link_in: [String]
  link_not_in: [String]
  link_lt: String
  link_lte: String
  link_gt: String
  link_gte: String
  link_contains: String
  link_not_contains: String
  link_starts_with: String
  link_not_starts_with: String
  link_ends_with: String
  link_not_ends_with: String
  note: String
  note_not: String
  note_in: [String]
  note_not_in: [String]
  note_lt: String
  note_lte: String
  note_gt: String
  note_gte: String
  note_contains: String
  note_not_contains: String
  note_starts_with: String
  note_not_starts_with: String
  note_ends_with: String
  note_not_ends_with: String
  projectType: ProjectType
  projectType_not: ProjectType
  projectType_in: [ProjectType]
  projectType_not_in: [ProjectType]
  projectType_lt: ProjectType
  projectType_lte: ProjectType
  projectType_gt: ProjectType
  projectType_gte: ProjectType
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
enum ProjectOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  title_ASC
  title_DESC
  link_ASC
  link_DESC
  note_ASC
  note_DESC
  thumbnail_ASC
  thumbnail_DESC
}
type ProjectConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Project]
}
input CreateProjectInput {
  title: String!
  link: String!
  note: String
  projectType: ProjectType!
  thumbnail: Upload
}
input UpdateProjectInput {
  title: String
  link: String
  note: String
  projectType: ProjectType
  thumbnail: Upload
}
extend type Query {
  projects(
    query: JSON
    where: ProjectFilter
    orderBy: ProjectOrderBy
    skip: Int
    limit: Int
  ): [Project]
  project(id: String!): Project
  projectsConnection(
    query: JSON
    where: ProjectFilter
    orderBy: ProjectOrderBy
    skip: Int
    limit: Int
  ): ProjectConnection
}
extend type Subscription {
  projectAdded: Project
  projectUpdated: Project
  projectDeleted: Project
}
extend type Mutation {
  createProject(input: CreateProjectInput): Project
  updateProject(input: UpdateProjectInput, id: String!): Project
  deleteProject(id: String!): Project
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        projects: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.projectRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        project: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.projectRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        projectsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.projectRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Project: {
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
        projectAdded: {
            subscribe: () => pubSub.asyncIterator('projectAdded')
        },
        projectUpdated: {
            subscribe: () => pubSub.asyncIterator('projectUpdated')
        },
        projectDeleted: {
            subscribe: () => pubSub.asyncIterator('projectDeleted')
        },
    },
    Mutation: {
        createProject: async (_, { input = {} }, { requester: { projectRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.thumbnail) {
                    let imageProject = await input.thumbnail
                    const key = "project/" + uuid() + "." + imageProject.mimetype.split("/")[1]
                    const url = storageUrl + key
                    input.thumbnail = url
                    const rs = imageProject.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const project = projectRequester.send({
                                type: 'create',
                                body: input,
                                headers,
                                file: {
                                    buffer,
                                    key,
                                    mimeType: imageProject.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("projectAdded", { projectAdded: project })
                            resolve(project)
                        })
                    })
                } else {
                    let project = await projectRequester.send({ type: 'create', body: input, headers })
                    pubSub.publish("projectAdded", { projectAdded: project })
                    return project
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        updateProject: async (_, { input = {}, id }, { requester: { projectRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.thumbnail) {
                    let imageProject = await input.thumbnail
                    delete input.thumbnail

                    const rs = imageProject.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const project = await projectRequester.send({
                                type: 'patch',
                                body: input,
                                id,
                                headers,
                                file: {
                                    buffer,
                                    mimeType: imageProject.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("projectUpdated", { projectUpdated: project })
                            resolve(project)
                        })

                    })
                } else {
                    let project = await projectRequester.send({ type: 'patch', body: input, id, headers })
                    pubSub.publish("projectUpdated", { projectUpdated: project })
                    return project
                }
            } catch (e) {
                throw new Error(e)
            }

        },
        deleteProject: async (_, { id }, { requester: { projectRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                let project = await projectRequester.send({ type: 'delete', id, headers })
                if (project.url) {
                    const key = project.url.split(storageUrl).join("")
                    storageRequester.send({
                        type: "deleteFile",
                        body: {
                            bucket,
                            key
                        }
                    })
                }
                pubSub.publish("projectDeleted", { projectDeleted: project })
                return project
            } catch (e) {
                throw new Error(e)
            }
        },
    }
})
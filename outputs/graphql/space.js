export const typeDef = `
type Space {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  name: String!
  users: [User!]
  courses(query: JSON): [Course]
  folders(query: JSON): [Folder]
  userFiles(query: JSON): [UserFile]
  events(query: JSON): [Event]
  posts(query: JSON): [Post]
  checkInRooms(query: JSON): [CheckInRoom]
  messages(query: JSON): [Message]
  workspaces(query: JSON): [Workspace]
}
input SpaceFilter {
  AND: [SpaceFilter!]
  OR: [SpaceFilter!]
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
  users: UserFilter
  users_some: UserFilter
  users_none: UserFilter
  courses: CourseFilter
  courses_some: CourseFilter
  courses_none: CourseFilter
  folders: FolderFilter
  folders_some: FolderFilter
  folders_none: FolderFilter
  userFiles: UserFileFilter
  userFiles_some: UserFileFilter
  userFiles_none: UserFileFilter
  events: EventFilter
  events_some: EventFilter
  events_none: EventFilter
  posts: PostFilter
  posts_some: PostFilter
  posts_none: PostFilter
  checkInRooms: CheckInRoomFilter
  checkInRooms_some: CheckInRoomFilter
  checkInRooms_none: CheckInRoomFilter
  messages: MessageFilter
  messages_some: MessageFilter
  messages_none: MessageFilter
  workspaces: WorkspaceFilter
  workspaces_some: WorkspaceFilter
  workspaces_none: WorkspaceFilter
}
enum SpaceOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
}
type SpaceConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Space]
}
input CreateSpaceInput {
  name: String!
  users: [UserCreateInput]
  usersIds: [String]
}
input UpdateSpaceInput {
  name: String
  users: [UserUpdateInput]
  usersIds: [String]
}
extend type Query {
  spaces(
    query: JSON
    where: SpaceFilter
    orderBy: SpaceOrderBy
    skip: Int
    limit: Int
  ): [Space]
  space(id: String!): Space
  spacesConnection(
    query: JSON
    where: SpaceFilter
    orderBy: SpaceOrderBy
    skip: Int
    limit: Int
  ): SpaceConnection
}
extend type Subscription {
  spaceAdded: Space
  spaceUpdated: Space
  spaceDeleted: Space
}
extend type Mutation {
  createSpace(input: CreateSpaceInput): Space
  updateSpace(input: UpdateSpaceInput, id: String!): Space
  deleteSpace(id: String!): Space
  removeUserOnSpace(userId: String!, spaceId: String!): Space
  addUserOnSpace(userId: String!, spaceId: String!): Space
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        spaces: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.spaceRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        space: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.spaceRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        spacesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.spaceRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Space: {
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
        users: async ({ usersId }, args, { headers, requester }) => {
            try {
                let res = []
                if (usersId) {
                    for (let i = 0; i < usersId.length; i++) {
                        let user = await requester.userRequester.send({ type: 'get', id: usersId[i], headers })
                        res.push(user)
                    }
                }
                return res
            } catch (e) {
                throw new Error(e)
            }
        },
        courses: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.courseRequester.send({ type: 'find', where: Object.assign({ spaceId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        folders: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.folderRequester.send({ type: 'find', where: Object.assign({ spaceId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        userFiles: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.userFileRequester.send({ type: 'find', where: Object.assign({ spaceId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        events: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.eventRequester.send({ type: 'find', where: Object.assign({ spaceId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        posts: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.postRequester.send({ type: 'find', where: Object.assign({ spaceId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        checkInRooms: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.checkInRoomRequester.send({ type: 'find', where: Object.assign({ spaceId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        messages: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.messageRequester.send({ type: 'find', where: Object.assign({ spaceId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        workspaces: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.workspaceRequester.send({ type: 'find', where: Object.assign({ spaceId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        spaceAdded: {
            subscribe: () => pubSub.asyncIterator('spaceAdded')
        },
        spaceUpdated: {
            subscribe: () => pubSub.asyncIterator('spaceUpdated')
        },
        spaceDeleted: {
            subscribe: () => pubSub.asyncIterator('spaceDeleted')
        },
    },
    Mutation: {
        createSpace: async (_, { input = {} }, { requester, resolvers, headers }) => {
            let usersId = []

            let spaceId = null
            try {
                let data = await requester.spaceRequester.send({ type: 'create', body: input, headers })
                spaceId = data.id

                if (input.users) {
                    for (let i = 0; i < input.users.length; i++) {
                        let users = input.users[i]
                        users.spacesId = [spaceId]
                        let res = await resolvers.userResolvers({ pubSub }).Mutation.createUser(_, { input: users }, { headers, requester, resolvers })
                        usersId.push(res.id)
                    }
                }
                if (!input.usersId) {
                    input.usersId = usersId
                }

                if (input.usersIds) {
                    for (let i = 0; i < input.usersIds.length; i++) {
                        usersId.push(input.usersIds[i])
                        await requester.userRequester.send({ type: 'patch', isSystem: true, body: { $addToSet: { spacesId: spaceId } }, id: input.usersIds[i], headers })
                    }
                }

                data = await requester.spaceRequester.send({ type: 'patch', id: spaceId, body: input, headers })
                pubSub.publish("spaceAdded", { spaceAdded: data })
                return data
            } catch (e) {
                if (spaceId) {
                    requester.spaceRequester.send({ type: 'delete', id: spaceId, headers })
                }

                usersId.map((id) => {
                    requester.userRequester.send({ type: 'delete', id, headers })
                })

                // console.log("ee", e)
                throw new Error(e)
            }
        },
        updateSpace: async (_, { input = {}, id, params }, { requester, resolvers, headers }) => {
            let usersId = []

            let spaceId = null
            try {
                let data
                if (!id) {
                    data = await requester.spaceRequester.send({ type: 'patch', body: input, params, id: null, headers })
                    spaceId = data.id
                } else {
                    spaceId = id
                }



                if (input.usersIds && input.users) {
                    throw new Error("Cannot create and update connection")
                }


                if (input.usersIds) {
                    let res = await requester.userRequester.send({ type: 'patch', isSystem: true, body: { $set: { spacesId: [] } }, params: { spacesIds: { $in: [spaceId] } }, id: null, headers })
                    for (let i = 0; i < input.usersIds.length; i++) {
                        usersId.push(input.usersIds[i])
                        await requester.userRequester.send({ type: 'patch', isSystem: true, body: { $addToSet: { spacesId: spaceId } }, id: input.usersIds[i], headers })
                    }
                }



                if (input.users) {
                    await requester.userRequester.send({ type: 'patch', isSystem: true, body: { $set: { spacesId: [] } }, params: { spacesIds: { $in: [spaceId] } }, id: null, headers })
                    for (let i = 0; i < input.users.length; i++) {
                        let users = input.users[i]
                        users.spacesId = [spaceId]
                        let res = await resolvers.userResolvers({ pubSub }).Mutation.createUser(_, { input: users }, { headers, requester, resolvers })
                        usersId.push(res.id)
                    }
                    input.usersIds = usersId
                }





                if (spaceId) {
                    data = await requester.spaceRequester.send({ type: 'patch', id: spaceId, body: Object.assign(input, { $set: { usersId: input.usersIds, } }), headers })
                }
                pubSub.publish("spaceAdded", { spaceAdded: data })
                return data
            } catch (e) {

                usersId.map((id) => {
                    requester.userRequester.send({ type: 'delete', id, headers })
                })

                throw new Error(e)
            }
        },
        deleteSpace: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.spaceRequester.send({ type: 'delete', id, headers })
                pubSub.publish("spaceDeleted", { spaceDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        addUserOnSpace: async (_, { userId, spaceId }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.spaceRequester.send({ type: 'patch', id: spaceId, headers, body: { $addToSet: { usersId: userId } } })
                await requester.userRequester.send({ type: 'patch', headers, isSystem: true, id: userId, body: { $addToSet: { spacesId: spaceId } } })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        removeUserOnSpace: async (_, { userId, spaceId }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.spaceRequester.send({ type: 'patch', id: spaceId, headers, body: { $pull: { usersId: userId } } })
                await requester.userRequester.send({ type: 'patch', headers, isSystem: true, id: userId, body: { $pull: { spacesId: spaceId } } })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
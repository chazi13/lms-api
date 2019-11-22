export const typeDef = `
type SpaceMenu {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  space: Space
  menus: [Menu!]
}
input SpaceMenuFilter {
  AND: [SpaceMenuFilter!]
  OR: [SpaceMenuFilter!]
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
  space: SpaceFilter
  space_some: SpaceFilter
  space_none: SpaceFilter
  menus: MenuFilter
  menus_some: MenuFilter
  menus_none: MenuFilter
}
enum SpaceMenuOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}
type SpaceMenuConnection {
  total: Int
  limit: Int
  skip: Int
  data: [SpaceMenu]
}
input CreateSpaceMenuInput {
  spaceId: String
  menus: [CreateMenuInput]
  menusIds: [String]
}
input UpdateSpaceMenuInput {
  spaceId: String
  menus: [UpdateMenuInput]
  menusIds: [String]
}
extend type Query {
  spaceMenus(
    query: JSON
    where: SpaceMenuFilter
    orderBy: SpaceMenuOrderBy
    skip: Int
    limit: Int
  ): [SpaceMenu]
  spaceMenu(id: String!): SpaceMenu
  spaceMenusConnection(
    query: JSON
    where: SpaceMenuFilter
    orderBy: SpaceMenuOrderBy
    skip: Int
    limit: Int
  ): SpaceMenuConnection
}
extend type Subscription {
  spaceMenuAdded: SpaceMenu
  spaceMenuUpdated: SpaceMenu
  spaceMenuDeleted: SpaceMenu
}
extend type Mutation {
  createSpaceMenu(input: CreateSpaceMenuInput): SpaceMenu
  updateSpaceMenu(input: UpdateSpaceMenuInput, id: String!): SpaceMenu
  deleteSpaceMenu(id: String!): SpaceMenu
  removeMenuOnSpaceMenu(menuId: String!, spaceMenuId: String!): SpaceMenu
  addMenuOnSpaceMenu(menuId: String!, spaceMenuId: String!): SpaceMenu
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        spaceMenus: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.spaceMenuRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        spaceMenu: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.spaceMenuRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        spaceMenusConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.spaceMenuRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    SpaceMenu: {
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
        space: async ({ spaceId }, args, { headers, requester }) => {
            try {
                return await requester.spaceRequester.send({ type: 'get', id: spaceId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        menus: async ({ menusId }, args, { headers, requester }) => {
            try {
                let res = []
                if (menusId) {
                    for (let i = 0; i < menusId.length; i++) {
                        let menu = await requester.menuRequester.send({ type: 'get', id: menusId[i], headers })
                        res.push(menu)
                    }
                }
                return res
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        spaceMenuAdded: {
            subscribe: () => pubSub.asyncIterator('spaceMenuAdded')
        },
        spaceMenuUpdated: {
            subscribe: () => pubSub.asyncIterator('spaceMenuUpdated')
        },
        spaceMenuDeleted: {
            subscribe: () => pubSub.asyncIterator('spaceMenuDeleted')
        },
    },
    Mutation: {
        createSpaceMenu: async (_, { input = {} }, { requester, resolvers, headers }) => {
            let menusId = []

            let spaceMenuId = null
            try {
                let data = await requester.spaceMenuRequester.send({ type: 'create', body: input, headers })
                spaceMenuId = data.id

                if (input.menus) {
                    for (let i = 0; i < input.menus.length; i++) {
                        let menus = input.menus[i]
                        menus.spaceMenusId = [spaceMenuId]
                        let res = await resolvers.menuResolvers({ pubSub }).Mutation.createMenu(_, { input: menus }, { headers, requester, resolvers })
                        menusId.push(res.id)
                    }
                }
                if (!input.menusId) {
                    input.menusId = menusId
                }

                if (input.menusIds) {
                    for (let i = 0; i < input.menusIds.length; i++) {
                        menusId.push(input.menusIds[i])
                        await requester.menuRequester.send({ type: 'patch', isSystem: true, body: { $addToSet: { spaceMenusId: spaceMenuId } }, id: input.menusIds[i], headers })
                    }
                }

                data = await requester.spaceMenuRequester.send({ type: 'patch', id: spaceMenuId, body: input, headers })
                pubSub.publish("spaceMenuAdded", { spaceMenuAdded: data })
                return data
            } catch (e) {
                if (spaceMenuId) {
                    requester.spaceMenuRequester.send({ type: 'delete', id: spaceMenuId, headers })
                }

                menusId.map((id) => {
                    requester.menuRequester.send({ type: 'delete', id, headers })
                })

                // console.log("ee", e)
                throw new Error(e)
            }
        },
        updateSpaceMenu: async (_, { input = {}, id, params }, { requester, resolvers, headers }) => {
            let menusId = []

            let spaceMenuId = null
            try {
                let data
                if (!id) {
                    data = await requester.spaceMenuRequester.send({ type: 'patch', body: input, params, id: null, headers })
                    spaceMenuId = data.id
                } else {
                    spaceMenuId = id
                }



                if (input.menusIds && input.menus) {
                    throw new Error("Cannot create and update connection")
                }


                if (input.menusIds) {
                    let res = await requester.menuRequester.send({ type: 'patch', isSystem: true, body: { $set: { spaceMenusId: [] } }, params: { spaceMenusIds: { $in: [spaceMenuId] } }, id: null, headers })
                    for (let i = 0; i < input.menusIds.length; i++) {
                        menusId.push(input.menusIds[i])
                        await requester.menuRequester.send({ type: 'patch', isSystem: true, body: { $addToSet: { spaceMenusId: spaceMenuId } }, id: input.menusIds[i], headers })
                    }
                }



                if (input.menus) {
                    await requester.menuRequester.send({ type: 'patch', isSystem: true, body: { $set: { spaceMenusId: [] } }, params: { spaceMenusIds: { $in: [spaceMenuId] } }, id: null, headers })
                    for (let i = 0; i < input.menus.length; i++) {
                        let menus = input.menus[i]
                        menus.spaceMenusId = [spaceMenuId]
                        let res = await resolvers.menuResolvers({ pubSub }).Mutation.createMenu(_, { input: menus }, { headers, requester, resolvers })
                        menusId.push(res.id)
                    }
                    input.menusIds = menusId
                }





                if (spaceMenuId) {
                    data = await requester.spaceMenuRequester.send({ type: 'patch', id: spaceMenuId, body: Object.assign(input, { $set: { menusId: input.menusIds, } }), headers })
                }
                pubSub.publish("spaceMenuAdded", { spaceMenuAdded: data })
                return data
            } catch (e) {

                menusId.map((id) => {
                    requester.menuRequester.send({ type: 'delete', id, headers })
                })

                throw new Error(e)
            }
        },
        deleteSpaceMenu: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.spaceMenuRequester.send({ type: 'delete', id, headers })
                pubSub.publish("spaceMenuDeleted", { spaceMenuDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        addMenuOnSpaceMenu: async (_, { menuId, spaceMenuId }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.spaceMenuRequester.send({ type: 'patch', id: spaceMenuId, headers, body: { $addToSet: { menusId: menuId } } })
                await requester.menuRequester.send({ type: 'patch', headers, isSystem: true, id: menuId, body: { $addToSet: { spaceMenusId: spaceMenuId } } })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        removeMenuOnSpaceMenu: async (_, { menuId, spaceMenuId }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.spaceMenuRequester.send({ type: 'patch', id: spaceMenuId, headers, body: { $pull: { menusId: menuId } } })
                await requester.menuRequester.send({ type: 'patch', headers, isSystem: true, id: menuId, body: { $pull: { spaceMenusId: spaceMenuId } } })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
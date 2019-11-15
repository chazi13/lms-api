export const typeDef = `
type List {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  board: Board
  name: String!
  background: String!
  cards(query: JSON): [Card]
}
input ListFilter {
  AND: [ListFilter!]
  OR: [ListFilter!]
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
  board: BoardFilter
  board_some: BoardFilter
  board_none: BoardFilter
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
  background: String
  background_not: String
  background_in: [String]
  background_not_in: [String]
  background_lt: String
  background_lte: String
  background_gt: String
  background_gte: String
  background_contains: String
  background_not_contains: String
  background_starts_with: String
  background_not_starts_with: String
  background_ends_with: String
  background_not_ends_with: String
  cards: CardFilter
  cards_some: CardFilter
  cards_none: CardFilter
}
enum ListOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
  background_ASC
  background_DESC
}
type ListConnection {
  total: Int
  limit: Int
  skip: Int
  data: [List]
}
input CreateListInput {
  boardId: String
  name: String!
  background: String!
}
input UpdateListInput {
  boardId: String
  name: String
  background: String
}
extend type Query {
  lists(
    query: JSON
    where: ListFilter
    orderBy: ListOrderBy
    skip: Int
    limit: Int
  ): [List]
  list(id: String!): List
  listsConnection(
    query: JSON
    where: ListFilter
    orderBy: ListOrderBy
    skip: Int
    limit: Int
  ): ListConnection
}
extend type Subscription {
  listAdded: List
  listUpdated: List
  listDeleted: List
}
extend type Mutation {
  createList(input: CreateListInput): List
  updateList(input: UpdateListInput, id: String!): List
  deleteList(id: String!): List
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        lists: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.listRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        list: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.listRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        listsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.listRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    List: {
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
        board: async ({ boardId }, args, { headers, requester }) => {
            try {
                return await requester.boardRequester.send({ type: 'get', id: boardId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        cards: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.cardRequester.send({ type: 'find', where: Object.assign({ listId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        listAdded: {
            subscribe: () => pubSub.asyncIterator('listAdded')
        },
        listUpdated: {
            subscribe: () => pubSub.asyncIterator('listUpdated')
        },
        listDeleted: {
            subscribe: () => pubSub.asyncIterator('listDeleted')
        },
    },
    Mutation: {
        createList: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.listRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("listAdded", { listAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateList: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.listRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("listUpdated", { listUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteList: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.listRequester.send({ type: 'delete', id, headers })
                pubSub.publish("listDeleted", { listDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
export const typeDef = `
type ListChecklist {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  title: String!
  status: Boolean
  checklist: Checklist
}
input ListChecklistFilter {
  AND: [ListChecklistFilter!]
  OR: [ListChecklistFilter!]
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
  status: Boolean
  status_not: Boolean
  checklist: ChecklistFilter
  checklist_some: ChecklistFilter
  checklist_none: ChecklistFilter
}
enum ListChecklistOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  title_ASC
  title_DESC
  status_ASC
  status_DESC
}
type ListChecklistConnection {
  total: Int
  limit: Int
  skip: Int
  data: [ListChecklist]
}
input CreateListChecklistInput {
  title: String!
  status: Boolean
  checklistId: String
}
input UpdateListChecklistInput {
  title: String
  status: Boolean
  checklistId: String
}
extend type Query {
  listChecklists(
    query: JSON
    where: ListChecklistFilter
    orderBy: ListChecklistOrderBy
    skip: Int
    limit: Int
  ): [ListChecklist]
  listChecklist(id: String!): ListChecklist
  listChecklistsConnection(
    query: JSON
    where: ListChecklistFilter
    orderBy: ListChecklistOrderBy
    skip: Int
    limit: Int
  ): ListChecklistConnection
}
extend type Subscription {
  listChecklistAdded: ListChecklist
  listChecklistUpdated: ListChecklist
  listChecklistDeleted: ListChecklist
}
extend type Mutation {
  createListChecklist(input: CreateListChecklistInput): ListChecklist
  updateListChecklist(
    input: UpdateListChecklistInput
    id: String!
  ): ListChecklist
  deleteListChecklist(id: String!): ListChecklist
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        listChecklists: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.listChecklistRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        listChecklist: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.listChecklistRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        listChecklistsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.listChecklistRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    ListChecklist: {
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
        checklist: async ({ checklistId }, args, { headers, requester }) => {
            try {
                return await requester.checklistRequester.send({ type: 'get', id: checklistId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        listChecklistAdded: {
            subscribe: () => pubSub.asyncIterator('listChecklistAdded')
        },
        listChecklistUpdated: {
            subscribe: () => pubSub.asyncIterator('listChecklistUpdated')
        },
        listChecklistDeleted: {
            subscribe: () => pubSub.asyncIterator('listChecklistDeleted')
        },
    },
    Mutation: {
        createListChecklist: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.listChecklistRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("listChecklistAdded", { listChecklistAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateListChecklist: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.listChecklistRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("listChecklistUpdated", { listChecklistUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteListChecklist: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.listChecklistRequester.send({ type: 'delete', id, headers })
                pubSub.publish("listChecklistDeleted", { listChecklistDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
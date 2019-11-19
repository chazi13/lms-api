export const typeDef = `
type Checklist {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  card: Card
  name: String!
  status: Boolean
}
input ChecklistFilter {
  AND: [ChecklistFilter!]
  OR: [ChecklistFilter!]
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
  card: CardFilter
  card_some: CardFilter
  card_none: CardFilter
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
  status: Boolean
  status_not: Boolean
}
enum ChecklistOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
  status_ASC
  status_DESC
}
type ChecklistConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Checklist]
}
input CreateChecklistInput {
  cardId: String
  name: String!
  status: Boolean
}
input UpdateChecklistInput {
  cardId: String
  name: String
  status: Boolean
}
extend type Query {
  checklists(
    query: JSON
    where: ChecklistFilter
    orderBy: ChecklistOrderBy
    skip: Int
    limit: Int
  ): [Checklist]
  checklist(id: String!): Checklist
  checklistsConnection(
    query: JSON
    where: ChecklistFilter
    orderBy: ChecklistOrderBy
    skip: Int
    limit: Int
  ): ChecklistConnection
}
extend type Subscription {
  checklistAdded: Checklist
  checklistUpdated: Checklist
  checklistDeleted: Checklist
}
extend type Mutation {
  createChecklist(input: CreateChecklistInput): Checklist
  updateChecklist(input: UpdateChecklistInput, id: String!): Checklist
  deleteChecklist(id: String!): Checklist
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        checklists: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.checklistRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        checklist: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.checklistRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        checklistsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.checklistRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Checklist: {
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
        card: async ({ cardId }, args, { headers, requester }) => {
            try {
                return await requester.cardRequester.send({ type: 'get', id: cardId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        checklistAdded: {
            subscribe: () => pubSub.asyncIterator('checklistAdded')
        },
        checklistUpdated: {
            subscribe: () => pubSub.asyncIterator('checklistUpdated')
        },
        checklistDeleted: {
            subscribe: () => pubSub.asyncIterator('checklistDeleted')
        },
    },
    Mutation: {
        createChecklist: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.checklistRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("checklistAdded", { checklistAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateChecklist: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.checklistRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("checklistUpdated", { checklistUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteChecklist: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.checklistRequester.send({ type: 'delete', id, headers })
                pubSub.publish("checklistDeleted", { checklistDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
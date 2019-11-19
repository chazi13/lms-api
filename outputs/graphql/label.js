export const typeDef = `
type Label {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  title: String!
  color: String
  card(query: JSON): Card!
}
input LabelFilter {
  AND: [LabelFilter!]
  OR: [LabelFilter!]
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
  color: String
  color_not: String
  color_in: [String]
  color_not_in: [String]
  color_lt: String
  color_lte: String
  color_gt: String
  color_gte: String
  color_contains: String
  color_not_contains: String
  color_starts_with: String
  color_not_starts_with: String
  color_ends_with: String
  color_not_ends_with: String
  card: CardFilter
  card_some: CardFilter
  card_none: CardFilter
}
enum LabelOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  title_ASC
  title_DESC
  color_ASC
  color_DESC
}
type LabelConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Label]
}
input CreateLabelInput {
  title: String!
  color: String
  cardId: String!
}
input UpdateLabelInput {
  title: String
  color: String
  cardId: String
}
extend type Query {
  labels(
    query: JSON
    where: LabelFilter
    orderBy: LabelOrderBy
    skip: Int
    limit: Int
  ): [Label]
  label(id: String!): Label
  labelsConnection(
    query: JSON
    where: LabelFilter
    orderBy: LabelOrderBy
    skip: Int
    limit: Int
  ): LabelConnection
}
extend type Subscription {
  labelAdded: Label
  labelUpdated: Label
  labelDeleted: Label
}
extend type Mutation {
  createLabel(input: CreateLabelInput): Label
  updateLabel(input: UpdateLabelInput, id: String!): Label
  deleteLabel(id: String!): Label
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        labels: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.labelRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        label: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.labelRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        labelsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.labelRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Label: {
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
        labelAdded: {
            subscribe: () => pubSub.asyncIterator('labelAdded')
        },
        labelUpdated: {
            subscribe: () => pubSub.asyncIterator('labelUpdated')
        },
        labelDeleted: {
            subscribe: () => pubSub.asyncIterator('labelDeleted')
        },
    },
    Mutation: {
        createLabel: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.labelRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("labelAdded", { labelAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateLabel: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.labelRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("labelUpdated", { labelUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteLabel: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.labelRequester.send({ type: 'delete', id, headers })
                pubSub.publish("labelDeleted", { labelDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
export const typeDef = `
type Option {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  desc: String!
  question: Question
  check: Boolean
}
input OptionFilter {
  AND: [OptionFilter!]
  OR: [OptionFilter!]
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
  desc: String
  desc_not: String
  desc_in: [String]
  desc_not_in: [String]
  desc_lt: String
  desc_lte: String
  desc_gt: String
  desc_gte: String
  desc_contains: String
  desc_not_contains: String
  desc_starts_with: String
  desc_not_starts_with: String
  desc_ends_with: String
  desc_not_ends_with: String
  question: QuestionFilter
  question_some: QuestionFilter
  question_none: QuestionFilter
  check: Boolean
  check_not: Boolean
}
enum OptionOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  desc_ASC
  desc_DESC
  check_ASC
  check_DESC
}
type OptionConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Option]
}
input CreateOptionInput {
  desc: String!
  questionId: String
  check: Boolean
}
input UpdateOptionInput {
  desc: String
  questionId: String
  check: Boolean
}
extend type Query {
  options(
    query: JSON
    where: OptionFilter
    orderBy: OptionOrderBy
    skip: Int
    limit: Int
  ): [Option]
  option(id: String!): Option
  optionsConnection(
    query: JSON
    where: OptionFilter
    orderBy: OptionOrderBy
    skip: Int
    limit: Int
  ): OptionConnection
}
extend type Subscription {
  optionAdded: Option
  optionUpdated: Option
  optionDeleted: Option
}
extend type Mutation {
  createOption(input: CreateOptionInput): Option
  updateOption(input: UpdateOptionInput, id: String!): Option
  deleteOption(id: String!): Option
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        options: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.optionRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        option: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.optionRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        optionsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.optionRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Option: {
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
        question: async ({ questionId }, args, { headers, requester }) => {
            try {
                return await requester.questionRequester.send({ type: 'get', id: questionId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        optionAdded: {
            subscribe: () => pubSub.asyncIterator('optionAdded')
        },
        optionUpdated: {
            subscribe: () => pubSub.asyncIterator('optionUpdated')
        },
        optionDeleted: {
            subscribe: () => pubSub.asyncIterator('optionDeleted')
        },
    },
    Mutation: {
        createOption: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.optionRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("optionAdded", { optionAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateOption: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.optionRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("optionUpdated", { optionUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteOption: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.optionRequester.send({ type: 'delete', id, headers })
                pubSub.publish("optionDeleted", { optionDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
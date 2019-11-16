export const typeDef = `
type Answer {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  user: User
  question: Question
  answer: Boolean
  token: String!
}
input AnswerFilter {
  AND: [AnswerFilter!]
  OR: [AnswerFilter!]
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
  user: UserFilter
  user_some: UserFilter
  user_none: UserFilter
  question: QuestionFilter
  question_some: QuestionFilter
  question_none: QuestionFilter
  answer: Boolean
  answer_not: Boolean
  token: String
  token_not: String
  token_in: [String]
  token_not_in: [String]
  token_lt: String
  token_lte: String
  token_gt: String
  token_gte: String
  token_contains: String
  token_not_contains: String
  token_starts_with: String
  token_not_starts_with: String
  token_ends_with: String
  token_not_ends_with: String
}
enum AnswerOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  answer_ASC
  answer_DESC
  token_ASC
  token_DESC
}
type AnswerConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Answer]
}
input CreateAnswerInput {
  userId: String
  questionId: String
  answer: Boolean
  token: String!
}
input UpdateAnswerInput {
  userId: String
  questionId: String
  answer: Boolean
  token: String
}
extend type Query {
  answers(
    query: JSON
    where: AnswerFilter
    orderBy: AnswerOrderBy
    skip: Int
    limit: Int
  ): [Answer]
  answer(id: String!): Answer
  answersConnection(
    query: JSON
    where: AnswerFilter
    orderBy: AnswerOrderBy
    skip: Int
    limit: Int
  ): AnswerConnection
}
extend type Subscription {
  answerAdded: Answer
  answerUpdated: Answer
  answerDeleted: Answer
}
extend type Mutation {
  createAnswer(input: CreateAnswerInput): Answer
  updateAnswer(input: UpdateAnswerInput, id: String!): Answer
  deleteAnswer(id: String!): Answer
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        answers: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.answerRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        answer: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.answerRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        answersConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.answerRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Answer: {
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
        user: async ({ userId }, args, { headers, requester }) => {
            try {
                return await requester.userRequester.send({ type: 'get', id: userId, headers })
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
        answerAdded: {
            subscribe: () => pubSub.asyncIterator('answerAdded')
        },
        answerUpdated: {
            subscribe: () => pubSub.asyncIterator('answerUpdated')
        },
        answerDeleted: {
            subscribe: () => pubSub.asyncIterator('answerDeleted')
        },
    },
    Mutation: {
        createAnswer: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.answerRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("answerAdded", { answerAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateAnswer: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.answerRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("answerUpdated", { answerUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteAnswer: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.answerRequester.send({ type: 'delete', id, headers })
                pubSub.publish("answerDeleted", { answerDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
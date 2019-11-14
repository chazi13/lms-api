export const typeDef = `
type Quiz {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  title: String!
  questions(query: JSON): [Question]
  reviews(query: JSON): [Review]
}
input QuizFilter {
  AND: [QuizFilter!]
  OR: [QuizFilter!]
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
  questions: QuestionFilter
  questions_some: QuestionFilter
  questions_none: QuestionFilter
  reviews: ReviewFilter
  reviews_some: ReviewFilter
  reviews_none: ReviewFilter
}
enum QuizOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  title_ASC
  title_DESC
}
type QuizConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Quiz]
}
input CreateQuizInput {
  title: String!
}
input UpdateQuizInput {
  title: String
}
extend type Query {
  quizzes(
    query: JSON
    where: QuizFilter
    orderBy: QuizOrderBy
    skip: Int
    limit: Int
  ): [Quiz]
  quiz(id: String!): Quiz
  quizzesConnection(
    query: JSON
    where: QuizFilter
    orderBy: QuizOrderBy
    skip: Int
    limit: Int
  ): QuizConnection
}
extend type Subscription {
  quizAdded: Quiz
  quizUpdated: Quiz
  quizDeleted: Quiz
}
extend type Mutation {
  createQuiz(input: CreateQuizInput): Quiz
  updateQuiz(input: UpdateQuizInput, id: String!): Quiz
  deleteQuiz(id: String!): Quiz
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        quizzes: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.quizRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        quiz: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.quizRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        quizzesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.quizRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Quiz: {
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
        questions: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.questionRequester.send({ type: 'find', where: Object.assign({ quizId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        reviews: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.reviewRequester.send({ type: 'find', where: Object.assign({ quizId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        quizAdded: {
            subscribe: () => pubSub.asyncIterator('quizAdded')
        },
        quizUpdated: {
            subscribe: () => pubSub.asyncIterator('quizUpdated')
        },
        quizDeleted: {
            subscribe: () => pubSub.asyncIterator('quizDeleted')
        },
    },
    Mutation: {
        createQuiz: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.quizRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("quizAdded", { quizAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateQuiz: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.quizRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("quizUpdated", { quizUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteQuiz: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.quizRequester.send({ type: 'delete', id, headers })
                pubSub.publish("quizDeleted", { quizDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
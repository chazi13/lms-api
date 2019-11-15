export const typeDef = `
type Question {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  title: String!
  quiz: Quiz
  options(query: JSON): [Option]
  answers(query: JSON): [Answer]
  desc: String!
}
input QuestionFilter {
  AND: [QuestionFilter!]
  OR: [QuestionFilter!]
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
  quiz: QuizFilter
  quiz_some: QuizFilter
  quiz_none: QuizFilter
  options: OptionFilter
  options_some: OptionFilter
  options_none: OptionFilter
  answers: AnswerFilter
  answers_some: AnswerFilter
  answers_none: AnswerFilter
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
}
enum QuestionOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  title_ASC
  title_DESC
  desc_ASC
  desc_DESC
}
type QuestionConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Question]
}
input CreateQuestionInput {
  title: String!
  quizId: String
  desc: String!
}
input UpdateQuestionInput {
  title: String
  quizId: String
  desc: String
}
extend type Query {
  questions(
    query: JSON
    where: QuestionFilter
    orderBy: QuestionOrderBy
    skip: Int
    limit: Int
  ): [Question]
  question(id: String!): Question
  questionsConnection(
    query: JSON
    where: QuestionFilter
    orderBy: QuestionOrderBy
    skip: Int
    limit: Int
  ): QuestionConnection
}
extend type Subscription {
  questionAdded: Question
  questionUpdated: Question
  questionDeleted: Question
}
extend type Mutation {
  createQuestion(input: CreateQuestionInput): Question
  updateQuestion(input: UpdateQuestionInput, id: String!): Question
  deleteQuestion(id: String!): Question
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        questions: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.questionRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        question: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.questionRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        questionsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.questionRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Question: {
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
        quiz: async ({ quizId }, args, { headers, requester }) => {
            try {
                return await requester.quizRequester.send({ type: 'get', id: quizId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        options: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.optionRequester.send({ type: 'find', where: Object.assign({ questionId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        answers: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.answerRequester.send({ type: 'find', where: Object.assign({ questionId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        questionAdded: {
            subscribe: () => pubSub.asyncIterator('questionAdded')
        },
        questionUpdated: {
            subscribe: () => pubSub.asyncIterator('questionUpdated')
        },
        questionDeleted: {
            subscribe: () => pubSub.asyncIterator('questionDeleted')
        },
    },
    Mutation: {
        createQuestion: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.questionRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("questionAdded", { questionAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateQuestion: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.questionRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("questionUpdated", { questionUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteQuestion: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.questionRequester.send({ type: 'delete', id, headers })
                pubSub.publish("questionDeleted", { questionDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
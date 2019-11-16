export const typeDef = `
type Lecture {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  title: String!
  type: LectureType!
  embed: String
  description: String
  tableOfContent: String
  comments(query: JSON): [Comment]
  article: Article
  quiz: Quiz
  task: Board
}
input LectureFilter {
  AND: [LectureFilter!]
  OR: [LectureFilter!]
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
  type: LectureType
  type_not: LectureType
  type_in: [LectureType]
  type_not_in: [LectureType]
  type_lt: LectureType
  type_lte: LectureType
  type_gt: LectureType
  type_gte: LectureType
  embed: String
  embed_not: String
  embed_in: [String]
  embed_not_in: [String]
  embed_lt: String
  embed_lte: String
  embed_gt: String
  embed_gte: String
  embed_contains: String
  embed_not_contains: String
  embed_starts_with: String
  embed_not_starts_with: String
  embed_ends_with: String
  embed_not_ends_with: String
  description: String
  description_not: String
  description_in: [String]
  description_not_in: [String]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  tableOfContent: String
  tableOfContent_not: String
  tableOfContent_in: [String]
  tableOfContent_not_in: [String]
  tableOfContent_lt: String
  tableOfContent_lte: String
  tableOfContent_gt: String
  tableOfContent_gte: String
  tableOfContent_contains: String
  tableOfContent_not_contains: String
  tableOfContent_starts_with: String
  tableOfContent_not_starts_with: String
  tableOfContent_ends_with: String
  tableOfContent_not_ends_with: String
  comments: CommentFilter
  comments_some: CommentFilter
  comments_none: CommentFilter
  article: ArticleFilter
  article_some: ArticleFilter
  article_none: ArticleFilter
  quiz: QuizFilter
  quiz_some: QuizFilter
  quiz_none: QuizFilter
  task: BoardFilter
  task_some: BoardFilter
  task_none: BoardFilter
}
enum LectureOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  title_ASC
  title_DESC
  embed_ASC
  embed_DESC
  description_ASC
  description_DESC
  tableOfContent_ASC
  tableOfContent_DESC
}
type LectureConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Lecture]
}
input CreateLectureInput {
  title: String!
  type: LectureType!
  embed: String
  description: String
  tableOfContent: String
  articleId: String
  quizId: String
  taskId: String
}
input UpdateLectureInput {
  title: String
  type: LectureType
  embed: String
  description: String
  tableOfContent: String
  articleId: String
  quizId: String
  taskId: String
}
extend type Query {
  lectures(
    query: JSON
    where: LectureFilter
    orderBy: LectureOrderBy
    skip: Int
    limit: Int
  ): [Lecture]
  lecture(id: String!): Lecture
  lecturesConnection(
    query: JSON
    where: LectureFilter
    orderBy: LectureOrderBy
    skip: Int
    limit: Int
  ): LectureConnection
}
extend type Subscription {
  lectureAdded: Lecture
  lectureUpdated: Lecture
  lectureDeleted: Lecture
}
extend type Mutation {
  createLecture(input: CreateLectureInput): Lecture
  updateLecture(input: UpdateLectureInput, id: String!): Lecture
  deleteLecture(id: String!): Lecture
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        lectures: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.lectureRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        lecture: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.lectureRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        lecturesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.lectureRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Lecture: {
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
        comments: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.commentRequester.send({ type: 'find', where: Object.assign({ lectureId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        article: async ({ articleId }, args, { headers, requester }) => {
            try {
                return await requester.articleRequester.send({ type: 'get', id: articleId, headers })
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
        task: async ({ taskId }, args, { headers, requester }) => {
            try {
                return await requester.boardRequester.send({ type: 'get', id: taskId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        lectureAdded: {
            subscribe: () => pubSub.asyncIterator('lectureAdded')
        },
        lectureUpdated: {
            subscribe: () => pubSub.asyncIterator('lectureUpdated')
        },
        lectureDeleted: {
            subscribe: () => pubSub.asyncIterator('lectureDeleted')
        },
    },
    Mutation: {
        createLecture: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.lectureRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("lectureAdded", { lectureAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateLecture: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.lectureRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("lectureUpdated", { lectureUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteLecture: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.lectureRequester.send({ type: 'delete', id, headers })
                pubSub.publish("lectureDeleted", { lectureDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
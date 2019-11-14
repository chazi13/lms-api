export const typeDef = `
type Task {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  text: String
}
input TaskFilter {
  AND: [TaskFilter!]
  OR: [TaskFilter!]
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
  text: String
  text_not: String
  text_in: [String]
  text_not_in: [String]
  text_lt: String
  text_lte: String
  text_gt: String
  text_gte: String
  text_contains: String
  text_not_contains: String
  text_starts_with: String
  text_not_starts_with: String
  text_ends_with: String
  text_not_ends_with: String
}
enum TaskOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  text_ASC
  text_DESC
}
type TaskConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Task]
}
input CreateTaskInput {
  text: String
}
input UpdateTaskInput {
  text: String
}
extend type Query {
  tasks(
    query: JSON
    where: TaskFilter
    orderBy: TaskOrderBy
    skip: Int
    limit: Int
  ): [Task]
  task(id: String!): Task
  tasksConnection(
    query: JSON
    where: TaskFilter
    orderBy: TaskOrderBy
    skip: Int
    limit: Int
  ): TaskConnection
}
extend type Subscription {
  taskAdded: Task
  taskUpdated: Task
  taskDeleted: Task
}
extend type Mutation {
  createTask(input: CreateTaskInput): Task
  updateTask(input: UpdateTaskInput, id: String!): Task
  deleteTask(id: String!): Task
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        tasks: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.taskRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        task: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.taskRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        tasksConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.taskRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Task: {
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
    },
    Subscription: {
        taskAdded: {
            subscribe: () => pubSub.asyncIterator('taskAdded')
        },
        taskUpdated: {
            subscribe: () => pubSub.asyncIterator('taskUpdated')
        },
        taskDeleted: {
            subscribe: () => pubSub.asyncIterator('taskDeleted')
        },
    },
    Mutation: {
        createTask: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.taskRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("taskAdded", { taskAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateTask: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.taskRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("taskUpdated", { taskUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteTask: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.taskRequester.send({ type: 'delete', id, headers })
                pubSub.publish("taskDeleted", { taskDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
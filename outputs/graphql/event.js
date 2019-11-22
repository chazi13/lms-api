export const typeDef = `
type Event {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  title: String!
  start: DateTime!
  end: DateTime
  allDay: Boolean
  description: String
}
input EventFilter {
  AND: [EventFilter!]
  OR: [EventFilter!]
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
  start: DateTime
  start_not: DateTime
  start_in: [DateTime]
  start_not_in: [DateTime]
  start_lt: DateTime
  start_lte: DateTime
  start_gt: DateTime
  start_gte: DateTime
  end: DateTime
  end_not: DateTime
  end_in: [DateTime]
  end_not_in: [DateTime]
  end_lt: DateTime
  end_lte: DateTime
  end_gt: DateTime
  end_gte: DateTime
  allDay: Boolean
  allDay_not: Boolean
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
}
enum EventOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  title_ASC
  title_DESC
  start_ASC
  start_DESC
  end_ASC
  end_DESC
  allDay_ASC
  allDay_DESC
  description_ASC
  description_DESC
}
type EventConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Event]
}
input CreateEventInput {
  title: String!
  start: DateTime!
  end: DateTime
  allDay: Boolean
  description: String
}
input UpdateEventInput {
  title: String
  start: DateTime
  end: DateTime
  allDay: Boolean
  description: String
}
extend type Query {
  events(
    query: JSON
    where: EventFilter
    orderBy: EventOrderBy
    skip: Int
    limit: Int
  ): [Event]
  event(id: String!): Event
  eventsConnection(
    query: JSON
    where: EventFilter
    orderBy: EventOrderBy
    skip: Int
    limit: Int
  ): EventConnection
}
extend type Subscription {
  eventAdded: Event
  eventUpdated: Event
  eventDeleted: Event
}
extend type Mutation {
  createEvent(input: CreateEventInput): Event
  updateEvent(input: UpdateEventInput, id: String!): Event
  deleteEvent(id: String!): Event
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        events: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.eventRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        event: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.eventRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        eventsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.eventRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Event: {
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
        eventAdded: {
            subscribe: () => pubSub.asyncIterator('eventAdded')
        },
        eventUpdated: {
            subscribe: () => pubSub.asyncIterator('eventUpdated')
        },
        eventDeleted: {
            subscribe: () => pubSub.asyncIterator('eventDeleted')
        },
    },
    Mutation: {
        createEvent: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.eventRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("eventAdded", { eventAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateEvent: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.eventRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("eventUpdated", { eventUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteEvent: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.eventRequester.send({ type: 'delete', id, headers })
                pubSub.publish("eventDeleted", { eventDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
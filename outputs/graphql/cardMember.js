export const typeDef = `
type CardMember {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  student: Student
  card: Card
}
input CardMemberFilter {
  AND: [CardMemberFilter!]
  OR: [CardMemberFilter!]
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
  student: StudentFilter
  student_some: StudentFilter
  student_none: StudentFilter
  card: CardFilter
  card_some: CardFilter
  card_none: CardFilter
}
enum CardMemberOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}
type CardMemberConnection {
  total: Int
  limit: Int
  skip: Int
  data: [CardMember]
}
input CreateCardMemberInput {
  studentId: String
  cardId: String
}
input UpdateCardMemberInput {
  studentId: String
  cardId: String
}
extend type Query {
  cardMembers(
    query: JSON
    where: CardMemberFilter
    orderBy: CardMemberOrderBy
    skip: Int
    limit: Int
  ): [CardMember]
  cardMember(id: String!): CardMember
  cardMembersConnection(
    query: JSON
    where: CardMemberFilter
    orderBy: CardMemberOrderBy
    skip: Int
    limit: Int
  ): CardMemberConnection
}
extend type Subscription {
  cardMemberAdded: CardMember
  cardMemberUpdated: CardMember
  cardMemberDeleted: CardMember
}
extend type Mutation {
  createCardMember(input: CreateCardMemberInput): CardMember
  updateCardMember(input: UpdateCardMemberInput, id: String!): CardMember
  deleteCardMember(id: String!): CardMember
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        cardMembers: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.cardMemberRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        cardMember: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.cardMemberRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        cardMembersConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.cardMemberRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    CardMember: {
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
        student: async ({ studentId }, args, { headers, requester }) => {
            try {
                return await requester.studentRequester.send({ type: 'get', id: studentId, headers })
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
        cardMemberAdded: {
            subscribe: () => pubSub.asyncIterator('cardMemberAdded')
        },
        cardMemberUpdated: {
            subscribe: () => pubSub.asyncIterator('cardMemberUpdated')
        },
        cardMemberDeleted: {
            subscribe: () => pubSub.asyncIterator('cardMemberDeleted')
        },
    },
    Mutation: {
        createCardMember: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.cardMemberRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("cardMemberAdded", { cardMemberAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateCardMember: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.cardMemberRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("cardMemberUpdated", { cardMemberUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteCardMember: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.cardMemberRequester.send({ type: 'delete', id, headers })
                pubSub.publish("cardMemberDeleted", { cardMemberDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
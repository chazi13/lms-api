export const typeDef = `
type Skill {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  name: String!
}
input SkillFilter {
  AND: [SkillFilter!]
  OR: [SkillFilter!]
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
}
enum SkillOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
}
type SkillConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Skill]
}
input CreateSkillInput {
  name: String!
}
input UpdateSkillInput {
  name: String
}
extend type Query {
  skills(
    query: JSON
    where: SkillFilter
    orderBy: SkillOrderBy
    skip: Int
    limit: Int
  ): [Skill]
  skill(id: String!): Skill
  skillsConnection(
    query: JSON
    where: SkillFilter
    orderBy: SkillOrderBy
    skip: Int
    limit: Int
  ): SkillConnection
}
extend type Subscription {
  skillAdded: Skill
  skillUpdated: Skill
  skillDeleted: Skill
}
extend type Mutation {
  createSkill(input: CreateSkillInput): Skill
  updateSkill(input: UpdateSkillInput, id: String!): Skill
  deleteSkill(id: String!): Skill
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        skills: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.skillRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        skill: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.skillRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        skillsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.skillRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Skill: {
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
        skillAdded: {
            subscribe: () => pubSub.asyncIterator('skillAdded')
        },
        skillUpdated: {
            subscribe: () => pubSub.asyncIterator('skillUpdated')
        },
        skillDeleted: {
            subscribe: () => pubSub.asyncIterator('skillDeleted')
        },
    },
    Mutation: {
        createSkill: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.skillRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("skillAdded", { skillAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateSkill: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.skillRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("skillUpdated", { skillUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteSkill: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.skillRequester.send({ type: 'delete', id, headers })
                pubSub.publish("skillDeleted", { skillDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
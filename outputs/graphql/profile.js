export const typeDef = `
type Profile {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  title: String
  facebook: String
  twitter: String
  linkedIn: String
  github: String
}
input ProfileFilter {
  AND: [ProfileFilter!]
  OR: [ProfileFilter!]
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
  facebook: String
  facebook_not: String
  facebook_in: [String]
  facebook_not_in: [String]
  facebook_lt: String
  facebook_lte: String
  facebook_gt: String
  facebook_gte: String
  facebook_contains: String
  facebook_not_contains: String
  facebook_starts_with: String
  facebook_not_starts_with: String
  facebook_ends_with: String
  facebook_not_ends_with: String
  twitter: String
  twitter_not: String
  twitter_in: [String]
  twitter_not_in: [String]
  twitter_lt: String
  twitter_lte: String
  twitter_gt: String
  twitter_gte: String
  twitter_contains: String
  twitter_not_contains: String
  twitter_starts_with: String
  twitter_not_starts_with: String
  twitter_ends_with: String
  twitter_not_ends_with: String
  linkedIn: String
  linkedIn_not: String
  linkedIn_in: [String]
  linkedIn_not_in: [String]
  linkedIn_lt: String
  linkedIn_lte: String
  linkedIn_gt: String
  linkedIn_gte: String
  linkedIn_contains: String
  linkedIn_not_contains: String
  linkedIn_starts_with: String
  linkedIn_not_starts_with: String
  linkedIn_ends_with: String
  linkedIn_not_ends_with: String
  github: String
  github_not: String
  github_in: [String]
  github_not_in: [String]
  github_lt: String
  github_lte: String
  github_gt: String
  github_gte: String
  github_contains: String
  github_not_contains: String
  github_starts_with: String
  github_not_starts_with: String
  github_ends_with: String
  github_not_ends_with: String
}
enum ProfileOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  title_ASC
  title_DESC
  facebook_ASC
  facebook_DESC
  twitter_ASC
  twitter_DESC
  linkedIn_ASC
  linkedIn_DESC
  github_ASC
  github_DESC
}
type ProfileConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Profile]
}
input CreateProfileInput {
  title: String
  facebook: String
  twitter: String
  linkedIn: String
  github: String
}
input UpdateProfileInput {
  title: String
  facebook: String
  twitter: String
  linkedIn: String
  github: String
}
extend type Query {
  profiles(
    query: JSON
    where: ProfileFilter
    orderBy: ProfileOrderBy
    skip: Int
    limit: Int
  ): [Profile]
  profile(id: String!): Profile
  profilesConnection(
    query: JSON
    where: ProfileFilter
    orderBy: ProfileOrderBy
    skip: Int
    limit: Int
  ): ProfileConnection
}
extend type Subscription {
  profileAdded: Profile
  profileUpdated: Profile
  profileDeleted: Profile
}
extend type Mutation {
  createProfile(input: CreateProfileInput): Profile
  updateProfile(input: UpdateProfileInput, id: String!): Profile
  deleteProfile(id: String!): Profile
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        profiles: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.profileRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        profile: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.profileRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        profilesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.profileRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Profile: {
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
        profileAdded: {
            subscribe: () => pubSub.asyncIterator('profileAdded')
        },
        profileUpdated: {
            subscribe: () => pubSub.asyncIterator('profileUpdated')
        },
        profileDeleted: {
            subscribe: () => pubSub.asyncIterator('profileDeleted')
        },
    },
    Mutation: {
        createProfile: async (_, { input = {} }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.profileRequester.send({ type: 'create', body: input, headers })
                pubSub.publish("profileAdded", { profileAdded: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        updateProfile: async (_, { input = {}, id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.profileRequester.send({ type: 'patch', body: input, id, headers })
                pubSub.publish("profileUpdated", { profileUpdated: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteProfile: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.profileRequester.send({ type: 'delete', id, headers })
                pubSub.publish("profileDeleted", { profileDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
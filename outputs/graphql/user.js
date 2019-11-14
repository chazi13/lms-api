const typeDef = `
input LoginInput {
  email: String!
  password: String
}

input LoginWithGoogleInput {
  jwtToken: String
}

input LoginWithFacebookInput {
  jwtToken: String
}

input RegisterInput {
  email: String!
  password: String!
  firstName: String!
  lastName: String
  avatar: String
  phone: String
  address: String
  studentId: String
}

input UpdateUserInput {
  password: String
  firstName: String
  lastName: String
  role: Role
}

input ChangeProfileInput {
  firstName: String
  lastName: String
  avatar: String
  phone: String
  address: String
  studentId: String
}

input CreateUserInput {
  email: String!
  password: String!
  firstName: String!
  lastName: String
  role: Role!
}

input VerifyEmailInput {
  token: String!
}

type UsersConnection {
  total: Int
  limit: Int
  skip: Int
  data: [User]
}

input ChangePasswordInput {
  oldPassword: String!
  newPassword: String!
}

extend type Query {
  users(
    query: JSON
    where: UserFilter
    limit: Int
    skip: Int
    orderBy: UserOrderBy
  ): [User]
  user(id: String): User
  usersConnection(
    query: JSON
    where: UserFilter
    limit: Int
    skip: Int
    orderBy: UserOrderBy
  ): UsersConnection
}

extend type Mutation {
  login(input: LoginInput): Login
  register(input: RegisterInput): Login
  loginWithGoogle(input: LoginWithGoogleInput): Login
  loginWithFacebook(input: LoginWithFacebookInput): Login
  createUser(input: CreateUserInput): Login
  forgetPassword(input: ForgetPasswordInput): Response
  resetPassword(input: ResetPasswordInput): Response
  verifyEmail(input: VerifyEmailInput): Response
  updateUser(input: UpdateUserInput, id: String!): User
  deleteUser(id: String!): User
  changeProfile(input: ChangeProfileInput): User
  changePassword(input: ChangePasswordInput): Response
  reSendVerifyEmail: Response
}

type User {
  id: String!
  firstName: String
  lastName: String
  email: String
  status: Int
  role: String
  createdBy: String
  updatedBy: String
  createdAt: DateTime
  updatedAt: DateTime
  avatar: String
  phone: String
  address: String
  studentId: String
}

type ForgetPassword {
  token: String!
}

type Login {
  token: String
  user: User
}

input ForgetPasswordInput {
  email: String!
}

input ResetPasswordInput {
  newPassword: String!
  token: String!
}
input UserFilter {
  AND: [UserFilter!]
  OR: [UserFilter!]
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
  firstName: String
  firstName_not: String
  firstName_in: [String]
  firstName_not_in: [String]
  firstName_lt: String
  firstName_lte: String
  firstName_gt: String
  firstName_gte: String
  firstName_contains: String
  firstName_not_contains: String
  firstName_starts_with: String
  firstName_not_starts_with: String
  firstName_ends_with: String
  firstName_not_ends_with: String
  lastName: String
  lastName_not: String
  lastName_in: [String]
  lastName_not_in: [String]
  lastName_lt: String
  lastName_lte: String
  lastName_gt: String
  lastName_gte: String
  lastName_contains: String
  lastName_not_contains: String
  lastName_starts_with: String
  lastName_not_starts_with: String
  lastName_ends_with: String
  lastName_not_ends_with: String
  email: String
  email_not: String
  email_in: [String]
  email_not_in: [String]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  status: Int
  status_not: Int
  status_in: [Int]
  status_not_in: [Int]
  status_lt: Int
  status_lte: Int
  status_gt: Int
  status_gte: Int
  role: String
  role_not: String
  role_in: [String]
  role_not_in: [String]
  role_lt: String
  role_lte: String
  role_gt: String
  role_gte: String
  role_contains: String
  role_not_contains: String
  role_starts_with: String
  role_not_starts_with: String
  role_ends_with: String
  role_not_ends_with: String
  createdBy: String
  createdBy_not: String
  createdBy_in: [String]
  createdBy_not_in: [String]
  createdBy_lt: String
  createdBy_lte: String
  createdBy_gt: String
  createdBy_gte: String
  createdBy_contains: String
  createdBy_not_contains: String
  createdBy_starts_with: String
  createdBy_not_starts_with: String
  createdBy_ends_with: String
  createdBy_not_ends_with: String
  updatedBy: String
  updatedBy_not: String
  updatedBy_in: [String]
  updatedBy_not_in: [String]
  updatedBy_lt: String
  updatedBy_lte: String
  updatedBy_gt: String
  updatedBy_gte: String
  updatedBy_contains: String
  updatedBy_not_contains: String
  updatedBy_starts_with: String
  updatedBy_not_starts_with: String
  updatedBy_ends_with: String
  updatedBy_not_ends_with: String
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
  avatar: String
  avatar_not: String
  avatar_in: [String]
  avatar_not_in: [String]
  avatar_lt: String
  avatar_lte: String
  avatar_gt: String
  avatar_gte: String
  avatar_contains: String
  avatar_not_contains: String
  avatar_starts_with: String
  avatar_not_starts_with: String
  avatar_ends_with: String
  avatar_not_ends_with: String
  phone: String
  phone_not: String
  phone_in: [String]
  phone_not_in: [String]
  phone_lt: String
  phone_lte: String
  phone_gt: String
  phone_gte: String
  phone_contains: String
  phone_not_contains: String
  phone_starts_with: String
  phone_not_starts_with: String
  phone_ends_with: String
  phone_not_ends_with: String
  address: String
  address_not: String
  address_in: [String]
  address_not_in: [String]
  address_lt: String
  address_lte: String
  address_gt: String
  address_gte: String
  address_contains: String
  address_not_contains: String
  address_starts_with: String
  address_not_starts_with: String
  address_ends_with: String
  address_not_ends_with: String
  studentId: String
  studentId_not: String
  studentId_in: [String]
  studentId_not_in: [String]
  studentId_lt: String
  studentId_lte: String
  studentId_gt: String
  studentId_gte: String
  studentId_contains: String
  studentId_not_contains: String
  studentId_starts_with: String
  studentId_not_starts_with: String
  studentId_ends_with: String
  studentId_not_ends_with: String
}
enum UserOrderBy {
  id_ASC
  id_DESC
  firstName_ASC
  firstName_DESC
  lastName_ASC
  lastName_DESC
  email_ASC
  email_DESC
  status_ASC
  status_DESC
  role_ASC
  role_DESC
  createdBy_ASC
  createdBy_DESC
  updatedBy_ASC
  updatedBy_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  avatar_ASC
  avatar_DESC
  phone_ASC
  phone_DESC
  address_ASC
  address_DESC
  studentId_ASC
  studentId_DESC
}
`
const resolvers = ({ pubSub }) => ({
    Query: {
        users: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, headers }) => {
            try {
                return await requester.userRequester.send({ type: "find", where: Object.assign(where, query), limit, skip, orderBy, headers });
            } catch (e) {
                throw new Error(e)
            }
        },
        user: async (_, { id }, { headers, requester }) => {
            try {
                return await requester.userRequester.send({ type: "get", id, headers });
            } catch (e) {
                throw new Error(e)
            }
        },
        usersConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { headers, requester }) => {
            try {
                return await requester.userRequester.send({ type: "findConnection", where: Object.assign(where, query), limit, skip, orderBy, headers });
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    User: {
        studentId: async ({ studentIdId }, args, { headers, stringRequester }) => {
            try {
                return await requester.studentIdRequester.send({ type: 'get', id: studentIdId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },

    Mutation: {
        resetPassword: async (_, { input = {} }, { requester, headers }) => {
            try {
                let data = await requester.userRequester.send({ type: "resetPassword", body: input, headers });
                return data;
            } catch (e) {
                throw new Error(e)
            }
        },
        forgetPassword: async (_, { input = {} }, { requester, headers }) => {
            try {
                let data = await requester.userRequester.send({ type: "forgetPassword", body: input, headers });
                return data;
            } catch (e) {
                throw new Error(e)
            }
        },
        createUser: async (_, { input }, { requester, headers }) => {
            try {
                return await requester.userRequester.send({ type: "createUser", body: input, headers });
            } catch (e) {
                throw new Error(e)
            }
        },
        updateUser: async (_, { input = {}, id }, { requester, headers }) => {
            try {
                return await requester.userRequester.send({ type: "updateUser", body: input, id, headers });
            } catch (e) {
                throw new Error(e)
            }
        },
        deleteUser: async (_, { input = {}, id }, { requester, headers }) => {
            try {
                return await requester.userRequester.send({ type: "deleteUser", body: input, id, headers });
            } catch (e) {
                throw new Error(e)
            }
        },
        changeProfile: async (_, { input = {} }, { requester, headers }) => {
            try {
                return await requester.userRequester.send({ type: "changeProfile", body: input, headers });
            } catch (e) {
                throw new Error(e)
            }
        },
        changePassword: async (_, { input = {} }, { requester, headers }) => {
            try {
                return await requester.userRequester.send({ type: "changePassword", body: input, headers });
            } catch (e) {
                throw new Error(e)
            }
        },
        verifyEmail: async (_, { input }, { requester, headers }) => {
            try {
                return await requester.userRequester.send({ type: "verifyEmail", body: input, headers });
            } catch (e) {
                throw new Error(e)
            }
        },
        reSendVerifyEmail: async (_, { input }, { requester, headers }) => {
            try {
                return await requester.userRequester.send({ type: "reSendVerifyEmail", body: input, headers });
            } catch (e) {
                throw new Error(e)
            }
        },
        login: async (_, { input }, { requester }) => {
            try {
                return await requester.userRequester.send({ type: "login", body: input });
            } catch (e) {
                throw new Error(e)
            }
        },
        loginWithGoogle: async (_, { input }, { requester }) => {
            try {
                return await requester.userRequester.send({ type: "loginWithGoogle", body: input });
            } catch (e) {
                throw new Error(e)
            }
        },
        loginWithFacebook: async (_, { input }, { requester }) => {
            try {
                return await requester.userRequester.send({ type: "loginWithFacebook", body: input });
            } catch (e) {
                throw new Error(e)
            }
        },
        register: async (_, { input }, { requester }) => {
            try {
                return await requester.userRequester.send({ type: "register", body: input });
            } catch (e) {
                throw new Error(e)
            }
        }
    }
});

module.exports = {
    typeDef,
    resolvers
};
export const typeDef = `
type Category {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  name: String!
  courses: [Course!]
}
input CategoryFilter {
  AND: [CategoryFilter!]
  OR: [CategoryFilter!]
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
  courses: CourseFilter
  courses_some: CourseFilter
  courses_none: CourseFilter
}
enum CategoryOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
}
type CategoryConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Category]
}
input CreateCategoryInput {
  name: String!
  courses: [CreateCourseInput]
  coursesIds: [String]
}
input UpdateCategoryInput {
  name: String
  courses: [UpdateCourseInput]
  coursesIds: [String]
}
extend type Query {
  categories(
    query: JSON
    where: CategoryFilter
    orderBy: CategoryOrderBy
    skip: Int
    limit: Int
  ): [Category]
  category(id: String!): Category
  categoriesConnection(
    query: JSON
    where: CategoryFilter
    orderBy: CategoryOrderBy
    skip: Int
    limit: Int
  ): CategoryConnection
}
extend type Subscription {
  categoryAdded: Category
  categoryUpdated: Category
  categoryDeleted: Category
}
extend type Mutation {
  createCategory(input: CreateCategoryInput): Category
  updateCategory(input: UpdateCategoryInput, id: String!): Category
  deleteCategory(id: String!): Category
  removeCourseOnCategory(courseId: String!, categoryId: String!): Category
  addCourseOnCategory(courseId: String!, categoryId: String!): Category
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        categories: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.categoryRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        category: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.categoryRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        categoriesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.categoryRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Category: {
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
        courses: async ({ coursesId }, args, { headers, requester }) => {
            try {
                let res = []
                if (coursesId) {
                    for (let i = 0; i < coursesId.length; i++) {
                        let course = await requester.courseRequester.send({ type: 'get', id: coursesId[i], headers })
                        res.push(course)
                    }
                }
                return res
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        categoryAdded: {
            subscribe: () => pubSub.asyncIterator('categoryAdded')
        },
        categoryUpdated: {
            subscribe: () => pubSub.asyncIterator('categoryUpdated')
        },
        categoryDeleted: {
            subscribe: () => pubSub.asyncIterator('categoryDeleted')
        },
    },
    Mutation: {
        createCategory: async (_, { input = {} }, { requester, resolvers, headers }) => {
            let coursesId = []

            let categoryId = null
            try {
                let data = await requester.categoryRequester.send({ type: 'create', body: input, headers })
                categoryId = data.id

                if (input.courses) {
                    for (let i = 0; i < input.courses.length; i++) {
                        let courses = input.courses[i]
                        courses.categoriesId = [categoryId]
                        let res = await resolvers.courseResolvers({ pubSub }).Mutation.createCourse(_, { input: courses }, { headers, requester, resolvers })
                        coursesId.push(res.id)
                    }
                }
                if (!input.coursesId) {
                    input.coursesId = coursesId
                }

                if (input.coursesIds) {
                    for (let i = 0; i < input.coursesIds.length; i++) {
                        coursesId.push(input.coursesIds[i])
                        await requester.courseRequester.send({ type: 'patch', isSystem: true, body: { $addToSet: { categoriesId: categoryId } }, id: input.coursesIds[i], headers })
                    }
                }

                data = await requester.categoryRequester.send({ type: 'patch', id: categoryId, body: input, headers })
                pubSub.publish("categoryAdded", { categoryAdded: data })
                return data
            } catch (e) {
                if (categoryId) {
                    requester.categoryRequester.send({ type: 'delete', id: categoryId, headers })
                }

                coursesId.map((id) => {
                    requester.courseRequester.send({ type: 'delete', id, headers })
                })

                // console.log("ee", e)
                throw new Error(e)
            }
        },
        updateCategory: async (_, { input = {}, id, params }, { requester, resolvers, headers }) => {
            let coursesId = []

            let categoryId = null
            try {
                let data
                if (!id) {
                    data = await requester.categoryRequester.send({ type: 'patch', body: input, params, id: null, headers })
                    categoryId = data.id
                } else {
                    categoryId = id
                }



                if (input.coursesIds && input.courses) {
                    throw new Error("Cannot create and update connection")
                }


                if (input.coursesIds) {
                    let res = await requester.courseRequester.send({ type: 'patch', isSystem: true, body: { $set: { categoriesId: [] } }, params: { categoriesIds: { $in: [categoryId] } }, id: null, headers })
                    for (let i = 0; i < input.coursesIds.length; i++) {
                        coursesId.push(input.coursesIds[i])
                        await requester.courseRequester.send({ type: 'patch', isSystem: true, body: { $addToSet: { categoriesId: categoryId } }, id: input.coursesIds[i], headers })
                    }
                }



                if (input.courses) {
                    await requester.courseRequester.send({ type: 'patch', isSystem: true, body: { $set: { categoriesId: [] } }, params: { categoriesIds: { $in: [categoryId] } }, id: null, headers })
                    for (let i = 0; i < input.courses.length; i++) {
                        let courses = input.courses[i]
                        courses.categoriesId = [categoryId]
                        let res = await resolvers.courseResolvers({ pubSub }).Mutation.createCourse(_, { input: courses }, { headers, requester, resolvers })
                        coursesId.push(res.id)
                    }
                    input.coursesIds = coursesId
                }





                if (categoryId) {
                    data = await requester.categoryRequester.send({ type: 'patch', id: categoryId, body: Object.assign(input, { $set: { coursesId: input.coursesIds, } }), headers })
                }
                pubSub.publish("categoryAdded", { categoryAdded: data })
                return data
            } catch (e) {

                coursesId.map((id) => {
                    requester.courseRequester.send({ type: 'delete', id, headers })
                })

                throw new Error(e)
            }
        },
        deleteCategory: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.categoryRequester.send({ type: 'delete', id, headers })
                pubSub.publish("categoryDeleted", { categoryDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        addCourseOnCategory: async (_, { courseId, categoryId }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.categoryRequester.send({ type: 'patch', id: categoryId, headers, body: { $addToSet: { coursesId: courseId } } })
                await requester.courseRequester.send({ type: 'patch', headers, isSystem: true, id: courseId, body: { $addToSet: { categoriesId: categoryId } } })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        removeCourseOnCategory: async (_, { courseId, categoryId }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.categoryRequester.send({ type: 'patch', id: categoryId, headers, body: { $pull: { coursesId: courseId } } })
                await requester.courseRequester.send({ type: 'patch', headers, isSystem: true, id: courseId, body: { $pull: { categoriesId: categoryId } } })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
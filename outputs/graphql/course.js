export const typeDef = `
type Course {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  title: String!
  categories: [CourseCategory!]
  finishTime: String
  description: String
}
input CourseFilter {
  AND: [CourseFilter!]
  OR: [CourseFilter!]
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
  categories: CourseCategoryFilter
  categories_some: CourseCategoryFilter
  categories_none: CourseCategoryFilter
  finishTime: String
  finishTime_not: String
  finishTime_in: [String]
  finishTime_not_in: [String]
  finishTime_lt: String
  finishTime_lte: String
  finishTime_gt: String
  finishTime_gte: String
  finishTime_contains: String
  finishTime_not_contains: String
  finishTime_starts_with: String
  finishTime_not_starts_with: String
  finishTime_ends_with: String
  finishTime_not_ends_with: String
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
enum CourseOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  title_ASC
  title_DESC
  finishTime_ASC
  finishTime_DESC
  description_ASC
  description_DESC
}
type CourseConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Course]
}
input CreateCourseInput {
  title: String!
  categories: [CreateCourseCategoryInput]
  categoriesIds: [String]
  finishTime: String
  description: String
}
input UpdateCourseInput {
  title: String
  categories: [UpdateCourseCategoryInput]
  categoriesIds: [String]
  finishTime: String
  description: String
}
extend type Query {
  courses(
    query: JSON
    where: CourseFilter
    orderBy: CourseOrderBy
    skip: Int
    limit: Int
  ): [Course]
  course(id: String!): Course
  coursesConnection(
    query: JSON
    where: CourseFilter
    orderBy: CourseOrderBy
    skip: Int
    limit: Int
  ): CourseConnection
}
extend type Subscription {
  courseAdded: Course
  courseUpdated: Course
  courseDeleted: Course
}
extend type Mutation {
  createCourse(input: CreateCourseInput): Course
  updateCourse(input: UpdateCourseInput, id: String!): Course
  deleteCourse(id: String!): Course
  removeCourseCategoryOnCourse(
    courseCategoryId: String!
    courseId: String!
  ): Course
  addCourseCategoryOnCourse(
    courseCategoryId: String!
    courseId: String!
  ): Course
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        courses: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.courseRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        course: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.courseRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        coursesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.courseRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Course: {
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
        categories: async ({ categoriesId }, args, { headers, requester }) => {
            try {
                let res = []
                if (categoriesId) {
                    for (let i = 0; i < categoriesId.length; i++) {
                        let courseCategory = await requester.courseCategoryRequester.send({ type: 'get', id: categoriesId[i], headers })
                        res.push(courseCategory)
                    }
                }
                return res
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        courseAdded: {
            subscribe: () => pubSub.asyncIterator('courseAdded')
        },
        courseUpdated: {
            subscribe: () => pubSub.asyncIterator('courseUpdated')
        },
        courseDeleted: {
            subscribe: () => pubSub.asyncIterator('courseDeleted')
        },
    },
    Mutation: {
        createCourse: async (_, { input = {} }, { requester, resolvers, headers }) => {
            let categoriesId = []

            let courseId = null
            try {
                let data = await requester.courseRequester.send({ type: 'create', body: input, headers })
                courseId = data.id

                if (input.categories) {
                    for (let i = 0; i < input.categories.length; i++) {
                        let categories = input.categories[i]
                        categories.coursesId = [courseId]
                        let res = await resolvers.courseCategoryResolvers({ pubSub }).Mutation.createCourseCategory(_, { input: categories }, { headers, requester, resolvers })
                        categoriesId.push(res.id)
                    }
                }
                if (!input.categoriesId) {
                    input.categoriesId = categoriesId
                }

                if (input.categoriesIds) {
                    for (let i = 0; i < input.categoriesIds.length; i++) {
                        categoriesId.push(input.categoriesIds[i])
                        await requester.courseCategoryRequester.send({ type: 'patch', isSystem: true, body: { $addToSet: { coursesId: courseId } }, id: input.categoriesIds[i], headers })
                    }
                }

                data = await requester.courseRequester.send({ type: 'patch', id: courseId, body: input, headers })
                pubSub.publish("courseAdded", { courseAdded: data })
                return data
            } catch (e) {
                if (courseId) {
                    requester.courseRequester.send({ type: 'delete', id: courseId, headers })
                }

                categoriesId.map((id) => {
                    requester.courseCategoryRequester.send({ type: 'delete', id, headers })
                })

                // console.log("ee", e)
                throw new Error(e)
            }
        },
        updateCourse: async (_, { input = {}, id, params }, { requester, resolvers, headers }) => {
            let categoriesId = []

            let courseId = null
            try {
                let data
                if (!id) {
                    data = await requester.courseRequester.send({ type: 'patch', body: input, params, id: null, headers })
                    courseId = data.id
                } else {
                    courseId = id
                }



                if (input.categoriesIds && input.categories) {
                    throw new Error("Cannot create and update connection")
                }


                if (input.categoriesIds) {
                    let res = await requester.courseCategoryRequester.send({ type: 'patch', isSystem: true, body: { $set: { coursesId: [] } }, params: { coursesIds: { $in: [courseId] } }, id: null, headers })
                    for (let i = 0; i < input.categoriesIds.length; i++) {
                        categoriesId.push(input.categoriesIds[i])
                        await requester.courseCategoryRequester.send({ type: 'patch', isSystem: true, body: { $addToSet: { coursesId: courseId } }, id: input.categoriesIds[i], headers })
                    }
                }



                if (input.categories) {
                    await requester.courseCategoryRequester.send({ type: 'patch', isSystem: true, body: { $set: { coursesId: [] } }, params: { coursesIds: { $in: [courseId] } }, id: null, headers })
                    for (let i = 0; i < input.categories.length; i++) {
                        let categories = input.categories[i]
                        categories.coursesId = [courseId]
                        let res = await resolvers.courseCategoryResolvers({ pubSub }).Mutation.createCourseCategory(_, { input: categories }, { headers, requester, resolvers })
                        courseCategoriesId.push(res.id)
                    }
                    input.courseCategoriesIds = courseCategoriesId
                }





                if (courseId) {
                    data = await requester.courseRequester.send({ type: 'patch', id: courseId, body: Object.assign(input, { $set: { courseCategoriesId: input.courseCategoriesIds, } }), headers })
                }
                pubSub.publish("courseAdded", { courseAdded: data })
                return data
            } catch (e) {

                categoriesId.map((id) => {
                    requester.courseCategoryRequester.send({ type: 'delete', id, headers })
                })

                throw new Error(e)
            }
        },
        deleteCourse: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.courseRequester.send({ type: 'delete', id, headers })
                pubSub.publish("courseDeleted", { courseDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        addCourseCategoryOnCourse: async (_, { courseCategoryId, courseId }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.courseRequester.send({ type: 'patch', id: courseId, headers, body: { $addToSet: { courseCategoriesId: courseCategoryId } } })
                await requester.courseCategoryRequester.send({ type: 'patch', headers, isSystem: true, id: courseCategoryId, body: { $addToSet: { coursesId: courseId } } })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        removeCourseCategoryOnCourse: async (_, { courseCategoryId, courseId }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.courseRequester.send({ type: 'patch', id: courseId, headers, body: { $pull: { courseCategoriesId: courseCategoryId } } })
                await requester.courseCategoryRequester.send({ type: 'patch', headers, isSystem: true, id: courseCategoryId, body: { $pull: { coursesId: courseId } } })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
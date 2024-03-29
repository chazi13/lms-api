export const typeDef = `
type CourseCategory {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  name: String!
  courses: [Course!]
}
input CourseCategoryFilter {
  AND: [CourseCategoryFilter!]
  OR: [CourseCategoryFilter!]
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
enum CourseCategoryOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
}
type CourseCategoryConnection {
  total: Int
  limit: Int
  skip: Int
  data: [CourseCategory]
}
input CreateCourseCategoryInput {
  name: String!
  courses: [CreateCourseInput]
  coursesIds: [String]
}
input UpdateCourseCategoryInput {
  name: String
  courses: [UpdateCourseInput]
  coursesIds: [String]
}
extend type Query {
  courseCategories(
    query: JSON
    where: CourseCategoryFilter
    orderBy: CourseCategoryOrderBy
    skip: Int
    limit: Int
  ): [CourseCategory]
  courseCategory(id: String!): CourseCategory
  courseCategoriesConnection(
    query: JSON
    where: CourseCategoryFilter
    orderBy: CourseCategoryOrderBy
    skip: Int
    limit: Int
  ): CourseCategoryConnection
}
extend type Subscription {
  courseCategoryAdded: CourseCategory
  courseCategoryUpdated: CourseCategory
  courseCategoryDeleted: CourseCategory
}
extend type Mutation {
  createCourseCategory(input: CreateCourseCategoryInput): CourseCategory
  updateCourseCategory(
    input: UpdateCourseCategoryInput
    id: String!
  ): CourseCategory
  deleteCourseCategory(id: String!): CourseCategory
  removeCourseOnCourseCategory(
    courseId: String!
    courseCategoryId: String!
  ): CourseCategory
  addCourseOnCourseCategory(
    courseId: String!
    courseCategoryId: String!
  ): CourseCategory
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        courseCategories: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.courseCategoryRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        courseCategory: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.courseCategoryRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        courseCategoriesConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.courseCategoryRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    CourseCategory: {
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
        courseCategoryAdded: {
            subscribe: () => pubSub.asyncIterator('courseCategoryAdded')
        },
        courseCategoryUpdated: {
            subscribe: () => pubSub.asyncIterator('courseCategoryUpdated')
        },
        courseCategoryDeleted: {
            subscribe: () => pubSub.asyncIterator('courseCategoryDeleted')
        },
    },
    Mutation: {
        createCourseCategory: async (_, { input = {} }, { requester, resolvers, headers }) => {
            let coursesId = []

            let courseCategoryId = null
            try {
                let data = await requester.courseCategoryRequester.send({ type: 'create', body: input, headers })
                courseCategoryId = data.id

                if (input.courses) {
                    for (let i = 0; i < input.courses.length; i++) {
                        let courses = input.courses[i]
                        courses.courseCategoriesId = [courseCategoryId]
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
                        await requester.courseRequester.send({ type: 'patch', isSystem: true, body: { $addToSet: { courseCategoriesId: courseCategoryId } }, id: input.coursesIds[i], headers })
                    }
                }

                data = await requester.courseCategoryRequester.send({ type: 'patch', id: courseCategoryId, body: input, headers })
                pubSub.publish("courseCategoryAdded", { courseCategoryAdded: data })
                return data
            } catch (e) {
                if (courseCategoryId) {
                    requester.courseCategoryRequester.send({ type: 'delete', id: courseCategoryId, headers })
                }

                coursesId.map((id) => {
                    requester.courseRequester.send({ type: 'delete', id, headers })
                })

                // console.log("ee", e)
                throw new Error(e)
            }
        },
        updateCourseCategory: async (_, { input = {}, id, params }, { requester, resolvers, headers }) => {
            let coursesId = []

            let courseCategoryId = null
            try {
                let data
                if (!id) {
                    data = await requester.courseCategoryRequester.send({ type: 'patch', body: input, params, id: null, headers })
                    courseCategoryId = data.id
                } else {
                    courseCategoryId = id
                }



                if (input.coursesIds && input.courses) {
                    throw new Error("Cannot create and update connection")
                }


                if (input.coursesIds) {
                    let res = await requester.courseRequester.send({ type: 'patch', isSystem: true, body: { $set: { courseCategoriesId: [] } }, params: { courseCategoriesIds: { $in: [courseCategoryId] } }, id: null, headers })
                    for (let i = 0; i < input.coursesIds.length; i++) {
                        coursesId.push(input.coursesIds[i])
                        await requester.courseRequester.send({ type: 'patch', isSystem: true, body: { $addToSet: { courseCategoriesId: courseCategoryId } }, id: input.coursesIds[i], headers })
                    }
                }



                if (input.courses) {
                    await requester.courseRequester.send({ type: 'patch', isSystem: true, body: { $set: { courseCategoriesId: [] } }, params: { courseCategoriesIds: { $in: [courseCategoryId] } }, id: null, headers })
                    for (let i = 0; i < input.courses.length; i++) {
                        let courses = input.courses[i]
                        courses.courseCategoriesId = [courseCategoryId]
                        let res = await resolvers.courseResolvers({ pubSub }).Mutation.createCourse(_, { input: courses }, { headers, requester, resolvers })
                        coursesId.push(res.id)
                    }
                    input.coursesIds = coursesId
                }





                if (courseCategoryId) {
                    data = await requester.courseCategoryRequester.send({ type: 'patch', id: courseCategoryId, body: Object.assign(input, { $set: { coursesId: input.coursesIds, } }), headers })
                }
                pubSub.publish("courseCategoryAdded", { courseCategoryAdded: data })
                return data
            } catch (e) {

                coursesId.map((id) => {
                    requester.courseRequester.send({ type: 'delete', id, headers })
                })

                throw new Error(e)
            }
        },
        deleteCourseCategory: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.courseCategoryRequester.send({ type: 'delete', id, headers })
                pubSub.publish("courseCategoryDeleted", { courseCategoryDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        addCourseOnCourseCategory: async (_, { courseId, courseCategoryId }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.courseCategoryRequester.send({ type: 'patch', id: courseCategoryId, headers, body: { $addToSet: { coursesId: courseId } } })
                await requester.courseRequester.send({ type: 'patch', headers, isSystem: true, id: courseId, body: { $addToSet: { courseCategoriesId: courseCategoryId } } })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        removeCourseOnCourseCategory: async (_, { courseId, courseCategoryId }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.courseCategoryRequester.send({ type: 'patch', id: courseCategoryId, headers, body: { $pull: { coursesId: courseId } } })
                await requester.courseRequester.send({ type: 'patch', headers, isSystem: true, id: courseId, body: { $pull: { courseCategoriesId: courseCategoryId } } })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
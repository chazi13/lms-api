export const typeDef = `
type Section {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  title: String!
  course(query: JSON): Course!
  lectures: [Lecture!]
}
input SectionFilter {
  AND: [SectionFilter!]
  OR: [SectionFilter!]
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
  course: CourseFilter
  course_some: CourseFilter
  course_none: CourseFilter
  lectures: LectureFilter
  lectures_some: LectureFilter
  lectures_none: LectureFilter
}
enum SectionOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  title_ASC
  title_DESC
}
type SectionConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Section]
}
input CreateSectionInput {
  title: String!
  courseId: String!
  lectures: [CreateLectureInput]
  lecturesIds: [String]
}
input UpdateSectionInput {
  title: String
  courseId: String
  lectures: [UpdateLectureInput]
  lecturesIds: [String]
}
extend type Query {
  sections(
    query: JSON
    where: SectionFilter
    orderBy: SectionOrderBy
    skip: Int
    limit: Int
  ): [Section]
  section(id: String!): Section
  sectionsConnection(
    query: JSON
    where: SectionFilter
    orderBy: SectionOrderBy
    skip: Int
    limit: Int
  ): SectionConnection
}
extend type Subscription {
  sectionAdded: Section
  sectionUpdated: Section
  sectionDeleted: Section
}
extend type Mutation {
  createSection(input: CreateSectionInput): Section
  updateSection(input: UpdateSectionInput, id: String!): Section
  deleteSection(id: String!): Section
  removeLectureOnSection(lectureId: String!, sectionId: String!): Section
  addLectureOnSection(lectureId: String!, sectionId: String!): Section
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        sections: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.sectionRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        section: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.sectionRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        sectionsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.sectionRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Section: {
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
        course: async ({ courseId }, args, { headers, requester }) => {
            try {
                return await requester.courseRequester.send({ type: 'get', id: courseId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        lectures: async ({ lecturesId }, args, { headers, requester }) => {
            try {
                let res = []
                if (lecturesId) {
                    for (let i = 0; i < lecturesId.length; i++) {
                        let lecture = await requester.lectureRequester.send({ type: 'get', id: lecturesId[i], headers })
                        res.push(lecture)
                    }
                }
                return res
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        sectionAdded: {
            subscribe: () => pubSub.asyncIterator('sectionAdded')
        },
        sectionUpdated: {
            subscribe: () => pubSub.asyncIterator('sectionUpdated')
        },
        sectionDeleted: {
            subscribe: () => pubSub.asyncIterator('sectionDeleted')
        },
    },
    Mutation: {
        createSection: async (_, { input = {} }, { requester, resolvers, headers }) => {
            let lecturesId = []

            let sectionId = null
            try {
                let data = await requester.sectionRequester.send({ type: 'create', body: input, headers })
                sectionId = data.id

                if (input.lectures) {
                    for (let i = 0; i < input.lectures.length; i++) {
                        let lectures = input.lectures[i]
                        lectures.sectionsId = [sectionId]
                        let res = await resolvers.lectureResolvers({ pubSub }).Mutation.createLecture(_, { input: lectures }, { headers, requester, resolvers })
                        lecturesId.push(res.id)
                    }
                }
                if (!input.lecturesId) {
                    input.lecturesId = lecturesId
                }

                if (input.lecturesIds) {
                    for (let i = 0; i < input.lecturesIds.length; i++) {
                        lecturesId.push(input.lecturesIds[i])
                        await requester.lectureRequester.send({ type: 'patch', isSystem: true, body: { $addToSet: { sectionsId: sectionId } }, id: input.lecturesIds[i], headers })
                    }
                }

                data = await requester.sectionRequester.send({ type: 'patch', id: sectionId, body: input, headers })
                pubSub.publish("sectionAdded", { sectionAdded: data })
                return data
            } catch (e) {
                if (sectionId) {
                    requester.sectionRequester.send({ type: 'delete', id: sectionId, headers })
                }

                lecturesId.map((id) => {
                    requester.lectureRequester.send({ type: 'delete', id, headers })
                })

                // console.log("ee", e)
                throw new Error(e)
            }
        },
        updateSection: async (_, { input = {}, id, params }, { requester, resolvers, headers }) => {
            let lecturesId = []

            let sectionId = null
            try {
                let data
                if (!id) {
                    data = await requester.sectionRequester.send({ type: 'patch', body: input, params, id: null, headers })
                    sectionId = data.id
                } else {
                    sectionId = id
                }



                if (input.lecturesIds && input.lectures) {
                    throw new Error("Cannot create and update connection")
                }


                if (input.lecturesIds) {
                    let res = await requester.lectureRequester.send({ type: 'patch', isSystem: true, body: { $set: { sectionsId: [] } }, params: { sectionsIds: { $in: [sectionId] } }, id: null, headers })
                    for (let i = 0; i < input.lecturesIds.length; i++) {
                        lecturesId.push(input.lecturesIds[i])
                        await requester.lectureRequester.send({ type: 'patch', isSystem: true, body: { $addToSet: { sectionsId: sectionId } }, id: input.lecturesIds[i], headers })
                    }
                }



                if (input.lectures) {
                    await requester.lectureRequester.send({ type: 'patch', isSystem: true, body: { $set: { sectionsId: [] } }, params: { sectionsIds: { $in: [sectionId] } }, id: null, headers })
                    for (let i = 0; i < input.lectures.length; i++) {
                        let lectures = input.lectures[i]
                        lectures.sectionsId = [sectionId]
                        let res = await resolvers.lectureResolvers({ pubSub }).Mutation.createLecture(_, { input: lectures }, { headers, requester, resolvers })
                        lecturesId.push(res.id)
                    }
                    input.lecturesIds = lecturesId
                }





                if (sectionId) {
                    data = await requester.sectionRequester.send({ type: 'patch', id: sectionId, body: Object.assign(input, { $set: { lecturesId: input.lecturesIds, } }), headers })
                }
                pubSub.publish("sectionAdded", { sectionAdded: data })
                return data
            } catch (e) {

                lecturesId.map((id) => {
                    requester.lectureRequester.send({ type: 'delete', id, headers })
                })

                throw new Error(e)
            }
        },
        deleteSection: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.sectionRequester.send({ type: 'delete', id, headers })
                pubSub.publish("sectionDeleted", { sectionDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        addLectureOnSection: async (_, { lectureId, sectionId }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.sectionRequester.send({ type: 'patch', id: sectionId, headers, body: { $addToSet: { lecturesId: lectureId } } })
                await requester.lectureRequester.send({ type: 'patch', headers, isSystem: true, id: lectureId, body: { $addToSet: { sectionsId: sectionId } } })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        removeLectureOnSection: async (_, { lectureId, sectionId }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.sectionRequester.send({ type: 'patch', id: sectionId, headers, body: { $pull: { lecturesId: lectureId } } })
                await requester.lectureRequester.send({ type: 'patch', headers, isSystem: true, id: lectureId, body: { $pull: { sectionsId: sectionId } } })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
export const typeDef = `
type ClassRoom {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  name: String!
  students: [Student!]
  group(query: JSON): Group!
  workspaces(query: JSON): [Workspace]
  background: String
}
input ClassRoomFilter {
  AND: [ClassRoomFilter!]
  OR: [ClassRoomFilter!]
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
  students: StudentFilter
  students_some: StudentFilter
  students_none: StudentFilter
  group: GroupFilter
  group_some: GroupFilter
  group_none: GroupFilter
  workspaces: WorkspaceFilter
  workspaces_some: WorkspaceFilter
  workspaces_none: WorkspaceFilter
  background: String
  background_not: String
  background_in: [String]
  background_not_in: [String]
  background_lt: String
  background_lte: String
  background_gt: String
  background_gte: String
  background_contains: String
  background_not_contains: String
  background_starts_with: String
  background_not_starts_with: String
  background_ends_with: String
  background_not_ends_with: String
}
enum ClassRoomOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
  background_ASC
  background_DESC
}
type ClassRoomConnection {
  total: Int
  limit: Int
  skip: Int
  data: [ClassRoom]
}
input CreateClassRoomInput {
  name: String!
  students: [CreateStudentInput]
  studentsIds: [String]
  groupId: String!
  background: String
}
input UpdateClassRoomInput {
  name: String
  students: [UpdateStudentInput]
  studentsIds: [String]
  groupId: String
  background: String
}
extend type Query {
  classRooms(
    query: JSON
    where: ClassRoomFilter
    orderBy: ClassRoomOrderBy
    skip: Int
    limit: Int
  ): [ClassRoom]
  classRoom(id: String!): ClassRoom
  classRoomsConnection(
    query: JSON
    where: ClassRoomFilter
    orderBy: ClassRoomOrderBy
    skip: Int
    limit: Int
  ): ClassRoomConnection
}
extend type Subscription {
  classRoomAdded: ClassRoom
  classRoomUpdated: ClassRoom
  classRoomDeleted: ClassRoom
}
extend type Mutation {
  createClassRoom(input: CreateClassRoomInput): ClassRoom
  updateClassRoom(input: UpdateClassRoomInput, id: String!): ClassRoom
  deleteClassRoom(id: String!): ClassRoom
  removeStudentOnClassRoom(studentId: String!, classRoomId: String!): ClassRoom
  addStudentOnClassRoom(studentId: String!, classRoomId: String!): ClassRoom
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        classRooms: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.classRoomRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        classRoom: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.classRoomRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        classRoomsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.classRoomRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    ClassRoom: {
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
        students: async ({ studentsId }, args, { headers, requester }) => {
            try {
                let res = []
                if (studentsId) {
                    for (let i = 0; i < studentsId.length; i++) {
                        let student = await requester.studentRequester.send({ type: 'get', id: studentsId[i], headers })
                        res.push(student)
                    }
                }
                return res
            } catch (e) {
                throw new Error(e)
            }
        },
        group: async ({ groupId }, args, { headers, requester }) => {
            try {
                return await requester.groupRequester.send({ type: 'get', id: groupId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        workspaces: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.workspaceRequester.send({ type: 'find', where: Object.assign({ classRoomId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        classRoomAdded: {
            subscribe: () => pubSub.asyncIterator('classRoomAdded')
        },
        classRoomUpdated: {
            subscribe: () => pubSub.asyncIterator('classRoomUpdated')
        },
        classRoomDeleted: {
            subscribe: () => pubSub.asyncIterator('classRoomDeleted')
        },
    },
    Mutation: {
        createClassRoom: async (_, { input = {} }, { requester, resolvers, headers }) => {
            let studentsId = []

            let classRoomId = null
            try {
                let data = await requester.classRoomRequester.send({ type: 'create', body: input, headers })
                classRoomId = data.id

                if (input.students) {
                    for (let i = 0; i < input.students.length; i++) {
                        let students = input.students[i]
                        students.classRoomsId = [classRoomId]
                        let res = await resolvers.studentResolvers({ pubSub }).Mutation.createStudent(_, { input: students }, { headers, requester, resolvers })
                        studentsId.push(res.id)
                    }
                }
                if (!input.studentsId) {
                    input.studentsId = studentsId
                }

                if (input.studentsIds) {
                    for (let i = 0; i < input.studentsIds.length; i++) {
                        studentsId.push(input.studentsIds[i])
                        await requester.studentRequester.send({ type: 'patch', isSystem: true, body: { $addToSet: { classRoomsId: classRoomId } }, id: input.studentsIds[i], headers })
                    }
                }

                data = await requester.classRoomRequester.send({ type: 'patch', id: classRoomId, body: input, headers })
                pubSub.publish("classRoomAdded", { classRoomAdded: data })
                return data
            } catch (e) {
                if (classRoomId) {
                    requester.classRoomRequester.send({ type: 'delete', id: classRoomId, headers })
                }

                studentsId.map((id) => {
                    requester.studentRequester.send({ type: 'delete', id, headers })
                })

                // console.log("ee", e)
                throw new Error(e)
            }
        },
        updateClassRoom: async (_, { input = {}, id, params }, { requester, resolvers, headers }) => {
            let studentsId = []

            let classRoomId = null
            try {
                let data
                if (!id) {
                    data = await requester.classRoomRequester.send({ type: 'patch', body: input, params, id: null, headers })
                    classRoomId = data.id
                } else {
                    classRoomId = id
                }



                if (input.studentsIds && input.students) {
                    throw new Error("Cannot create and update connection")
                }


                if (input.studentsIds) {
                    let res = await requester.studentRequester.send({ type: 'patch', isSystem: true, body: { $set: { classRoomsId: [] } }, params: { classRoomsIds: { $in: [classRoomId] } }, id: null, headers })
                    for (let i = 0; i < input.studentsIds.length; i++) {
                        studentsId.push(input.studentsIds[i])
                        await requester.studentRequester.send({ type: 'patch', isSystem: true, body: { $addToSet: { classRoomsId: classRoomId } }, id: input.studentsIds[i], headers })
                    }
                }



                if (input.students) {
                    await requester.studentRequester.send({ type: 'patch', isSystem: true, body: { $set: { classRoomsId: [] } }, params: { classRoomsIds: { $in: [classRoomId] } }, id: null, headers })
                    for (let i = 0; i < input.students.length; i++) {
                        let students = input.students[i]
                        students.classRoomsId = [classRoomId]
                        let res = await resolvers.studentResolvers({ pubSub }).Mutation.createStudent(_, { input: students }, { headers, requester, resolvers })
                        studentsId.push(res.id)
                    }
                    input.studentsIds = studentsId
                }





                if (classRoomId) {
                    data = await requester.classRoomRequester.send({ type: 'patch', id: classRoomId, body: Object.assign(input, { $set: { studentsId: input.studentsIds, } }), headers })
                }
                pubSub.publish("classRoomAdded", { classRoomAdded: data })
                return data
            } catch (e) {

                studentsId.map((id) => {
                    requester.studentRequester.send({ type: 'delete', id, headers })
                })

                throw new Error(e)
            }
        },
        deleteClassRoom: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.classRoomRequester.send({ type: 'delete', id, headers })
                pubSub.publish("classRoomDeleted", { classRoomDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        addStudentOnClassRoom: async (_, { studentId, classRoomId }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.classRoomRequester.send({ type: 'patch', id: classRoomId, headers, body: { $addToSet: { studentsId: studentId } } })
                await requester.studentRequester.send({ type: 'patch', headers, isSystem: true, id: studentId, body: { $addToSet: { classRoomsId: classRoomId } } })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        removeStudentOnClassRoom: async (_, { studentId, classRoomId }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.classRoomRequester.send({ type: 'patch', id: classRoomId, headers, body: { $pull: { studentsId: studentId } } })
                await requester.studentRequester.send({ type: 'patch', headers, isSystem: true, id: studentId, body: { $pull: { classRoomsId: classRoomId } } })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
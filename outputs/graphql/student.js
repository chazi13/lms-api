export const typeDef = `
type Student {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  user(query: JSON): User!
  classRooms: [ClassRoom!]
  stundentClasses(query: JSON): [StudentClass]
  studentGroups(query: JSON): [StudentGroup]
  studentWorkspaces(query: JSON): [StudentWorkspace]
  studentBoard: [StudentBoard]
  studentCard(query: JSON): [CardMember]
}
input StudentFilter {
  AND: [StudentFilter!]
  OR: [StudentFilter!]
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
  user: UserFilter
  user_some: UserFilter
  user_none: UserFilter
  classRooms: ClassRoomFilter
  classRooms_some: ClassRoomFilter
  classRooms_none: ClassRoomFilter
  stundentClasses: StudentClassFilter
  stundentClasses_some: StudentClassFilter
  stundentClasses_none: StudentClassFilter
  studentGroups: StudentGroupFilter
  studentGroups_some: StudentGroupFilter
  studentGroups_none: StudentGroupFilter
  studentWorkspaces: StudentWorkspaceFilter
  studentWorkspaces_some: StudentWorkspaceFilter
  studentWorkspaces_none: StudentWorkspaceFilter
  studentBoard: StudentBoard
  studentBoard_not: StudentBoard
  studentBoard_in: [StudentBoard]
  studentBoard_not_in: [StudentBoard]
  studentBoard_lt: StudentBoard
  studentBoard_lte: StudentBoard
  studentBoard_gt: StudentBoard
  studentBoard_gte: StudentBoard
  studentCard: CardMemberFilter
  studentCard_some: CardMemberFilter
  studentCard_none: CardMemberFilter
}
enum StudentOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}
type StudentConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Student]
}
input CreateStudentInput {
  userId: String!
  classRooms: [CreateClassRoomInput]
  classRoomsIds: [String]
  studentBoard: [StudentBoard]
}
input UpdateStudentInput {
  userId: String
  classRooms: [UpdateClassRoomInput]
  classRoomsIds: [String]
  studentBoard: [StudentBoard]
}
extend type Query {
  students(
    query: JSON
    where: StudentFilter
    orderBy: StudentOrderBy
    skip: Int
    limit: Int
  ): [Student]
  student(id: String!): Student
  studentsConnection(
    query: JSON
    where: StudentFilter
    orderBy: StudentOrderBy
    skip: Int
    limit: Int
  ): StudentConnection
}
extend type Subscription {
  studentAdded: Student
  studentUpdated: Student
  studentDeleted: Student
}
extend type Mutation {
  createStudent(input: CreateStudentInput): Student
  updateStudent(input: UpdateStudentInput, id: String!): Student
  deleteStudent(id: String!): Student
  removeClassRoomOnStudent(classRoomId: String!, studentId: String!): Student
  addClassRoomOnStudent(classRoomId: String!, studentId: String!): Student
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        students: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.studentRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        student: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.studentRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        studentsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.studentRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Student: {
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
        user: async ({ userId }, args, { headers, requester }) => {
            try {
                return await requester.userRequester.send({ type: 'get', id: userId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        classRooms: async ({ classRoomsId }, args, { headers, requester }) => {
            try {
                let res = []
                if (classRoomsId) {
                    for (let i = 0; i < classRoomsId.length; i++) {
                        let classRoom = await requester.classRoomRequester.send({ type: 'get', id: classRoomsId[i], headers })
                        res.push(classRoom)
                    }
                }
                return res
            } catch (e) {
                throw new Error(e)
            }
        },
        stundentClasses: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.studentClassRequester.send({ type: 'find', where: Object.assign({ studentId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        studentGroups: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.studentGroupRequester.send({ type: 'find', where: Object.assign({ studentId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        studentWorkspaces: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.studentWorkspaceRequester.send({ type: 'find', where: Object.assign({ studentId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        studentCards: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.cardMemberRequester.send({ type: 'find', where: Object.assign({ studentId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        studentAdded: {
            subscribe: () => pubSub.asyncIterator('studentAdded')
        },
        studentUpdated: {
            subscribe: () => pubSub.asyncIterator('studentUpdated')
        },
        studentDeleted: {
            subscribe: () => pubSub.asyncIterator('studentDeleted')
        },
    },
    Mutation: {
        createStudent: async (_, { input = {} }, { requester, resolvers, headers }) => {
            let classRoomsId = []

            let studentId = null
            try {
                let data = await requester.studentRequester.send({ type: 'create', body: input, headers })
                studentId = data.id

                if (input.classRooms) {
                    for (let i = 0; i < input.classRooms.length; i++) {
                        let classRooms = input.classRooms[i]
                        classRooms.studentsId = [studentId]
                        let res = await resolvers.classRoomResolvers({ pubSub }).Mutation.createClassRoom(_, { input: classRooms }, { headers, requester, resolvers })
                        classRoomsId.push(res.id)
                    }
                }
                if (!input.classRoomsId) {
                    input.classRoomsId = classRoomsId
                }

                if (input.classRoomsIds) {
                    for (let i = 0; i < input.classRoomsIds.length; i++) {
                        classRoomsId.push(input.classRoomsIds[i])
                        await requester.classRoomRequester.send({ type: 'patch', isSystem: true, body: { $addToSet: { studentsId: studentId } }, id: input.classRoomsIds[i], headers })
                    }
                }

                data = await requester.studentRequester.send({ type: 'patch', id: studentId, body: input, headers })
                pubSub.publish("studentAdded", { studentAdded: data })
                return data
            } catch (e) {
                if (studentId) {
                    requester.studentRequester.send({ type: 'delete', id: studentId, headers })
                }

                classRoomsId.map((id) => {
                    requester.classRoomRequester.send({ type: 'delete', id, headers })
                })

                // console.log("ee", e)
                throw new Error(e)
            }
        },
        updateStudent: async (_, { input = {}, id, params }, { requester, resolvers, headers }) => {
            let classRoomsId = []

            let studentId = null
            try {
                let data
                if (!id) {
                    data = await requester.studentRequester.send({ type: 'patch', body: input, params, id: null, headers })
                    studentId = data.id
                } else {
                    studentId = id
                }



                if (input.classRoomsIds && input.classRooms) {
                    throw new Error("Cannot create and update connection")
                }


                if (input.classRoomsIds) {
                    let res = await requester.classRoomRequester.send({ type: 'patch', isSystem: true, body: { $set: { studentsId: [] } }, params: { studentsIds: { $in: [studentId] } }, id: null, headers })
                    for (let i = 0; i < input.classRoomsIds.length; i++) {
                        classRoomsId.push(input.classRoomsIds[i])
                        await requester.classRoomRequester.send({ type: 'patch', isSystem: true, body: { $addToSet: { studentsId: studentId } }, id: input.classRoomsIds[i], headers })
                    }
                }



                if (input.classRooms) {
                    await requester.classRoomRequester.send({ type: 'patch', isSystem: true, body: { $set: { studentsId: [] } }, params: { studentsIds: { $in: [studentId] } }, id: null, headers })
                    for (let i = 0; i < input.classRooms.length; i++) {
                        let classRooms = input.classRooms[i]
                        classRooms.studentsId = [studentId]
                        let res = await resolvers.classRoomResolvers({ pubSub }).Mutation.createClassRoom(_, { input: classRooms }, { headers, requester, resolvers })
                        classRoomsId.push(res.id)
                    }
                    input.classRoomsIds = classRoomsId
                }





                if (studentId) {
                    data = await requester.studentRequester.send({ type: 'patch', id: studentId, body: Object.assign(input, { $set: { classRoomsId: input.classRoomsIds, } }), headers })
                }
                pubSub.publish("studentAdded", { studentAdded: data })
                return data
            } catch (e) {

                classRoomsId.map((id) => {
                    requester.classRoomRequester.send({ type: 'delete', id, headers })
                })

                throw new Error(e)
            }
        },
        deleteStudent: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.studentRequester.send({ type: 'delete', id, headers })
                pubSub.publish("studentDeleted", { studentDeleted: data })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        addClassRoomOnStudent: async (_, { classRoomId, studentId }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.studentRequester.send({ type: 'patch', id: studentId, headers, body: { $addToSet: { classRoomsId: classRoomId } } })
                await requester.classRoomRequester.send({ type: 'patch', headers, isSystem: true, id: classRoomId, body: { $addToSet: { studentsId: studentId } } })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
        removeClassRoomOnStudent: async (_, { classRoomId, studentId }, { requester, resolvers, headers }) => {
            try {
                let data = await requester.studentRequester.send({ type: 'patch', id: studentId, headers, body: { $pull: { classRoomsId: classRoomId } } })
                await requester.classRoomRequester.send({ type: 'patch', headers, isSystem: true, id: classRoomId, body: { $pull: { studentsId: studentId } } })
                return data
            } catch (e) {
                throw new Error(e)
            }
        },
    },
});
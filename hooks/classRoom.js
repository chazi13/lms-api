module.exports = (app) => ({
    before: {
        find: async (context) => {
            //do something before find request
        },
        get: async (context) => {
            //do something before get request            
        },        
        create: async (context) => {
            //do something before create request
        },
        patch: async (context) => {
            //do something before patch request
        }, 
        delete: async (context) => {
            //do something before delete request
        },        
    },
    after:{
        find: async (context) => {
            //do something after find request
        },
        get: async (context) => {
            //do something after get request
        },        
        create: async (context) => {
            //do something after create request
        },
        patch: async (context) => {
            const classData = context.result
            const {data, params: {headers}} = context

            if ((data.$addToSet && data.$addToSet.studentsId) || (data.$pull && data.$pull.studentsId)) {
                let studentId = ''
                if (data.$addToSet) studentId = data.$addToSet.studentsId
                if (data.$pull) studentId = data.$pull.studentsId

                try {
                    const studentGroups = await app.getRequester('studentGroup').send({
                        type: 'find',
                        query: {
                            studentId: studentId
                        }
                    })

                    if (data.$addToSet) {
                        if (studentGroups.length == 0) {
                            const createStudentGroup = await app.getRequester('studentGroup').send({
                                type: 'create',
                                body: {
                                    studentId,
                                    groupId: classData.groupId,
                                },
                                headers
                            })

                            const addClassOnStudentGroup = await app.getRequester('studentGroup').send({
                                type: 'patch',
                                id: createStudentGroup.id,
                                body: {
                                    "$addToSet": {
                                        classRoomsId: classData.id
                                    }
                                },
                                headers
                            })
                        } else {
                            const studentGroup = studentGroups[0]
                            const addClassOnStudentGroup = await app.getRequester('studentGroup').send({
                                type: 'patch',
                                id: studentGroup.id,
                                body: {
                                    "$addToSet": {
                                        classRoomsId: classData.id
                                    }
                                },
                                headers
                            })
                        }
                    } else if (data.$pull) {
                        const studentGroup = studentGroups[0]
                        if (studentGroup.classRoomsId.length == 1) {
                            const removeStudentId = await app.getRequester('studentGroup').send({
                                type: 'delete',
                                id: studentGroup.id,
                                headers
                            })
                        } else {
                        const removeClassOnStudentGroup = await app.getRequester('studentGroup').send({
                                type: 'patch',
                                id: studentGroup.id,
                                body: {
                                    "$pull": {
                                        classRoomsId: classData.id
                                    }
                                },
                                headers
                            }) 
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        },         
        delete: async (context) => {
            //do something after delete request
        }        
    },
})
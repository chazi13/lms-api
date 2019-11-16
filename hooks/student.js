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
            //do something after patch request
        },         
        delete: async (context) => {
            //do something after delete request
        },
        register: async (context) => {
            const { user } = contex.result
            const headers = {
              "authorization": Bearer`${accessToken}`
            }
        
            const profile = await app.getRequester('profile').send({
              type: 'create',
              body: {
                createdBy: user.id
              },
              headers
            })
        
            const classes = await app.getRequester('classRoom').send({ type: 'get' })
            const groups = await app.getRequester('group').send({ type: 'get' })
        
            const student = await app.getRequester('student').send({
              type: 'create',
              body: {
                userId: user.id,
                classRoomsIds: [classes[1].id]
              },
              headers
            })
        
            const studentClass = await app.getRequester('studentClass').send({
              type: 'create',
              body: {
                studentId: student.id,
                classroom: classes[1].id
              },
              headers
            })
        
            const studentGroup = await app.getRequester('studentGroup').send({
              type: 'create',
              body: {
                studentId: student.id,
                group: groups[1].id
              },
              headers
            })
        
            const studentUpdate = await app.getRequester('student').send({
              type: 'patch',
              body: {
                stundentClasses: [studentClass.id],
                studentGroups: [studentGroup.id],
              },
              headers
            })
          }     
    },
})
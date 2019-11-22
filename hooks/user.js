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
            const user = context.result
            
            try {
                if (user.avatar !== null) {
                    const avatar = await app.getRequester('attachment').send({
                        type: 'get',
                        id: user.avatar
                    })

                    context.result.avatar = avatar.url
                }
            } catch (e) {
                console.log('on get avatar', e)
            }
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
            const {user, accessToken} = context.result
            const headers = {
                "authorization": accessToken
            }

            try {
                const profile = await app.getRequester('profile').send({
                    type: 'create',
                    body: {
                        createdBy: user.id
                    },
                    headers
                })
            } catch (e) {
                console.log('on create profile', e)
            }
        }
    },
    permissions: null
})
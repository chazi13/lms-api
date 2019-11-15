module.exports = app => ({
  before: {
    find: async context => {
      //do something before find request
    },
    get: async context => {
      //do something before get request
    },
    create: async context => {
      //do something before create request
    },
    patch: async context => {
      //do something before patch request
    },
    delete: async context => {
      //do something before delete request
    }
  },
  after: {
    find: async context => {
      //do something after find request
    },
    get: async context => {
      //do something after get request
    },
    create: async context => {
      //do something after create request
    },
    patch: async context => {
      //do something after patch request
    },
    delete: async context => {
      //do something after delete request
    },
    register: async context => {
        const { user, accessToken } = context.result;
        const headers = {
            authorization: `Bearer ${accessToken}`
        };
        
        try {
            const profile = await app.getRequester("profile").send({
                type: "create",
                body: {
                    createdBy: user.id
                },
                headers
            });
            
            const student = await app.getRequester("student").send({
                type: "create",
                body: {
                    userId: user.id,
                },
                headers
            });
            console.log('user', user)
            console.log('profile', profile)
            console.log('student', student)
        } catch (e) {
            console.log(e)
        }
    }
  },
  permissions: null
});

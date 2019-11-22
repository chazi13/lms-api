const appRoot = require('app-root-path')
require("dotenv").config({ path: appRoot.path + '/.env'  })

module.exports = {
    APP_ID : process.env.APP_ID,
    ONESIGNAL_APP_ID : process.env.ONESIGNAL_APP_ID,
    REST_API_KEY :  process.env.ONESIGNAL_REST_API_KEY,
    HOST:process.env.HOST,
    PORT:process.env.PORT,
    MONGODB:process.env.NOTIFICATION_MONGODB,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,

    feathers:{
        paginate:{
            default: 20,
            limit: 20
        }
    }

}
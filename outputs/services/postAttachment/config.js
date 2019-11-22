const appRoot = require('app-root-path')
require("dotenv").config({ path: appRoot.path + '/.env' })

const DATABASE = "mongo"
const MONGODB = process.env.POSTATTACHMENT_MONGODB
const HOST = process.env.POSTATTACHMENT_HOST
const PORT = process.env.POSTATTACHMENT_PORT

module.exports = {
    HOST,
    PORT,
    DATABASE,
    MONGODB,
    APP_ID: process.env.APP_ID,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    feathers: {
        paginate: {
            default: 20,
            limit: 20
        }
    }

}
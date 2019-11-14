require('dotenv').config()

module.exports = {
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    MONGODB: process.env.MONGODB,
    feathers: {
        paginate: {
            default: 20,
            limit: 20
        }
    }

}
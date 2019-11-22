require('./utils')
const { REDIS_HOST, REDIS_PORT, APP_ID } = require("./config")
const cote = require('cote')({ redis: { host: REDIS_HOST, port: REDIS_PORT } })
const { uploadFile, deleteFile} = require('./storage')

const storageService = new cote.Responder({
    name: 'Storage Service',
    key: APP_ID + '_storage'
})


storageService.on("uploadFile", async (req, cb) => {
    try {
        let res = await uploadFile(req.body)
        cb(null, res)
    } catch (error) {
        cb(error.message, null)
    }
})

storageService.on("deleteFile", async (req, cb) => {
    try {
        let res = await deleteFile(req.body)
        cb(null, res)
    } catch (error) {
        cb(error.message, null)
    }
})


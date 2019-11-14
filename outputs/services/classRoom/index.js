const { REDIS_HOST, REDIS_PORT } = require("./config")
const app = require('./src/app');
const port = app.get('port');
const server = app.listen(port);
const checkPermissions = require('feathers-permissions');
const { NotFound } = require('@feathersjs/errors');
const cote = require('cote')({ redis: { host: REDIS_HOST, port: REDIS_PORT } })
const appRoot = require('app-root-path');
const pluralize = require("pluralize")
let externalHook = null

try {
    const root = appRoot.toString()
    const split = root.split('/')
    split.pop()
    const path = split.join('/')
    externalHook = require(path + '/hooks/classRoom')
} catch (e) {

}

function camelize(text) {
    return text.replace(/^([A-Z])|[\s-_]+(\w)/g, function(match, p1, p2, offset) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();        
    });
}

const classRoomService = new cote.Responder({
    name: 'ClassRoom Service',
    key: 'classRoom'
})

const userRequester = new cote.Requester({
    name: 'User Requester',
    key: 'user',
})

const getRequester = (name) =>{
    const requesterName = `${name.charAt(0).toUpperCase() + name.slice(1)} Requester`
    if(app.get(requesterName)){
        return app.get(requesterName)
    }
    const requester = new cote.Requester({
        name: requesterName,
        key: `${camelize(name)}`,
    })
    let newRequester = {
        send: params =>  requester.send({...params, isSystem: true})
    }
    app.set(requesterName, newRequester)
    return newRequester
}

app.getRequester = getRequester

const whereTransformer = (where={})=>{
    let keys = Object.assign({},where)
    Object.keys(where).map((field)=>{
        let split = field.split("_")
        let type = split[split.length - 1]
        if(type == "contains"){
            delete keys[field]
            let value = where[field]
            if(split[1] == "not"){
                value = `^((?!${value}).)*$`
            }
            keys[split[0]] = {
                ...keys[split[0]],
                "$regex": value
            }
        }
        if(type == "not"){
            delete keys[field]
            let value = where[field]
            keys[split[0]] = {
                ...keys[split[0]],
                $ne: value
            }
        }
        if(type == "in"){
            delete keys[field]
            let value = where[field]
            if(split[1] == "not"){
                value = {
                    "$nin": value
                }
            } else {
                value = {
                    "$in": value
                }
            }
            keys[split[0]] = {...keys[split[0]], ...value}
        }
        if(type == 'lt' || type == 'lte' || type == 'gt' || type == 'gte'){
            delete keys[field]
            const queryType = `$${type}`
            let value = where[field]
            keys[split[0]] = {
                ...keys[split[0]], 
                [queryType]: value
            }
        }
    })
    return keys
}

const limitTransformer = (limit)=>{
    return {
        $limit: limit
    }
}

const skipTransformer = (skip) =>{
    return {
        $skip: skip
    }
}
const sortTransformer = (orderBy) => {
    const split = orderBy.split('_')
    return {
        $sort: {
            [split[0]]: split[1] == 'ASC' ? 1 : -1
        }
    }
}
const transformer = ({where, limit, skip, orderBy}) => {
    let query = {}
    if(where){
        query = Object.assign(query, whereTransformer(where))
    }
    if(limit){
        query = Object.assign(query, limitTransformer(limit))
    }
    if(skip){
        query = Object.assign(query, skipTransformer(skip))
    }
    if(orderBy){
        query = Object.assign(query, sortTransformer(orderBy))
    }
    return query
}


classRoomService.on("find", async (req, cb) => {
    try {
        let data = await app.service("classRooms").find({
            query: transformer({where: req.where, limit: req.limit, skip: req.skip, orderBy: req.orderBy}),
            headers: req.headers,
            isSystem: req.isSystem
        })

        cb(null, data.data)
    } catch (error) {
        cb(error.message, null)
    }
})

classRoomService.on("findConnection", async (req, cb) => {
    try {
        let data = await app.service("classRooms").find({
            query: transformer({where: req.where, limit: req.limit, skip: req.skip, orderBy: req.orderBy}),
            headers: req.headers,
            isSystem: req.isSystem
        })

        cb(null, data)
    } catch (error) {
        cb(error.message, null)
    }
})

classRoomService.on("findOwn", async (req, cb) => {
    try {
        let data = await app.service("classRooms").find({
            query: transformer({where: req.where, limit: req.limit, skip: req.skip, orderBy: req.orderBy}),
            headers: req.headers,
            isSystem: req.isSystem,
            type: 'findOwn'
        })

        cb(null, data.data)
    } catch (error) {
        cb(error.message, null)
    }
})

classRoomService.on("findConnectionOwn", async (req, cb) => {
    try {
        let data = await app.service("classRooms").find({
            query: transformer({where: req.where, limit: req.limit, skip: req.skip, orderBy: req.orderBy}),
            headers: req.headers,
            isSystem: req.isSystem,
            type: 'findOwn'
        })

        cb(null, data)
    } catch (error) {
        cb(error.message, null)
    }
})

classRoomService.on("create", async (req, cb) => {
    try {
        let data = await app.service("classRooms").create(req.body, {
            headers: req.headers,
            file: req.file,
            isSystem: req.isSystem
        })
        cb(null, data)
    } catch (error) {
        cb(error.message, null)
    }
})

classRoomService.on("patch", async (req, cb) => {
    try {
        let data = await app.service("classRooms").patch(req.id, req.body, {
            ...req.params || {},
            headers: req.headers,
            file: req.file,
            isSystem: req.isSystem
        })
        cb(null, data)
    } catch (error) {
        cb(error.message, null)
    }
})

classRoomService.on("delete", async (req, cb) => {
    try {
        let data = await app.service("classRooms").remove(req.id, {
            ...req.params || {},
            headers: req.headers,
            file: req.file,
            isSystem: req.isSystem
        })
        data.id = data._id
        cb(null, data)
    } catch (error) {
        cb(error.message, null)
    }
})

classRoomService.on("get", async (req, cb) => {
    try {
        let data = null
        if (req.id) {
            data = await app.service("classRooms").get(req.id, {
                headers: req.headers,
                isSystem: req.isSystem
            })
        }
        cb(null, data)
    } catch (error) {
        cb(error.message, null)
    }
})


const checkAuthentication = (token) => {
    return userRequester.send({ type: 'verifyToken', token })
}


app.service('classRooms').hooks({
    before: {
        find: async (context) => {
            try {
                if(!context.params.isSystem){
                    let auth = await checkAuthentication(context.params.headers && context.params.headers.authorization || '')

                    context.params.user = auth.user

                    
                    if(auth.user.permissions.includes(`${camelize('classRoom')}:findOwn`)){
                        context.method = "findOwn"
                        context.params.query = {
                            ...context.params.query || {},
                            createdBy: auth.user.id
                        }
                    }
                    
                    //beforeFindAuthorization
                    await checkPermissions({
                        roles: ['admin', 'classRoom']
                    })(context)

                    if (!context.params.permitted) {
                        throw Error("UnAuthorized")
                    }
                }
                //beforeFind
                return externalHook && externalHook(app).before && externalHook(app).before.find && externalHook(app).before.find(context)
            } catch (err) {
                throw new Error(err)
            }
        },
        get: async (context) => {
            try {
                if(!context.params.isSystem){
                    let auth = await checkAuthentication(context.params.headers && context.params.headers.authorization || '')

                    context.params.user = auth.user
                    await checkPermissions({
                        roles: ['admin', 'classRoom']
                    })(context)

                    if (!context.params.permitted) {
                        throw Error("UnAuthorized")
                    }
                }
                return externalHook && externalHook(app).before && externalHook(app).before.get && externalHook(app).before.get(context)
            } catch (err) {
                throw new Error(err)
            }
        },
        create: async (context) => {
            try {
                if(!context.params.isSystem){
                    let auth = await checkAuthentication(context.params.headers && context.params.headers.authorization || '')

                    context.params.user = auth.user

                    await checkPermissions({
                        roles: ['admin', 'classRoom']
                    })(context)

                    context.data.createdBy = auth.user.id || ''

                    if (!context.params.permitted) {
                        throw Error("UnAuthorized")
                    }
                    
                    //beforeCreate
                    if(context.data && context.data.groupId){
                        let belongsTo = await getRequester('group').send({ 
                            type: "get", 
                            id: context.data.groupId, 
                            headers:{
                                token: context.params.headers.authorization
                            }
                        })
                        if(!belongsTo){
                            throw Error("Group not found.")
                        }
                    }             
                    
                }
                
                return externalHook && externalHook(app).before && externalHook(app).before.create && externalHook(app).before.create(context)
            } catch (err) {
                throw new Error(err)
            }
        },
        update: async (context) => {
            try {
                if(!context.params.isSystem){
                    let auth = await checkAuthentication(context.params.headers && context.params.headers.authorization || '')

                    context.params.user = auth.user


     
                    //beforeUpdate
                    if(auth.user.permissions.includes(`${camelize('classRoom')}:updateOwn`)){
                        context.method = "updateOwn"
                        if(context.id){
                            let classRoom = await app.service(`${pluralize(camelize("classRoom"))}`).get(context.id, { headers: context.params.headers })
                            if(classRoom && classRoom.createdBy !== auth.user.id){
                                throw new Error("UnAuthorized")
                            }
                        }
                    }


                    await checkPermissions({
                        roles: ['admin', 'classRoom']
                    })(context)


                    if (!context.params.permitted) {
                        throw Error("UnAuthorized")
                    }
    
   
                }
                
                return externalHook && externalHook(app).before && externalHook(app).before.update && externalHook(app).before.update(context)
            } catch (err) {
                throw new Error(err)
            }
        },
        patch: async (context) => {
            try {
                if(!context.params.isSystem){
                    let auth = await checkAuthentication(context.params.headers && context.params.headers.authorization || '')

                    context.params.user = auth.user

 
            
                    //beforePatch
                    if(auth.user.permissions.includes(`${camelize('classRoom')}:patchOwn`)){
                        context.method = "patchOwn"
                        if(context.id){
                            let classRoom = await app.service(`${pluralize(camelize("classRooms"))}`).get(context.id, { headers: context.params.headers })
                            if(classRoom && classRoom.createdBy !== auth.user.id){
                                throw new Error("UnAuthorized")
                            }
                        }
                    }

                    await checkPermissions({
                        roles: ['admin', 'classRoom']
                    })(context)

    
                    if (!context.params.permitted) {
                        throw Error("UnAuthorized")
                    }

   
                }
                
                return externalHook && externalHook(app).before && externalHook(app).before.patch && externalHook(app).before.patch(context)
            } catch (err) {
                throw new Error(err)
            }
        },
        remove: async (context) => {
            try {
               if(!context.params.isSystem){
                    let auth = await checkAuthentication(context.params.headers && context.params.headers.authorization || '')

                    context.params.user = auth.user


                    //beforeDelete
                    if(auth.user.permissions.includes(`${camelize('classRoom')}:removeOwn`)){
                        context.method = "removeOwn"
                        if(context.id){
                            let classRoom = await app.service(`${pluralize(camelize("classRooms"))}`).get(context.id, { headers: context.params.headers })
                            if(classRoom && classRoom.createdBy !== auth.user.id){
                                throw new Error("UnAuthorized")
                            }
                        }
                    }
                    await checkPermissions({
                        roles: ['admin', 'classRoom']
                    })(context)
                    if (!context.params.permitted) {
                        throw Error("UnAuthorized")
                    } 
                    
                    
                    //onDelete
                    //ON DELETE SET CASCADE
                    await getRequester('group').send({ type: 'delete', 
                        id: null,   
                        headers: {
                            authorization: context.params.headers.authorization
                        }, 
                        params: {
                            query: {
                                classRoomId: context.id
                            }
                        }
                    })
                    //ON DELETE SET CASCADE
                    await getRequester('student').send({ type: 'delete', 
                        id: null,   
                        headers: {
                            authorization: context.params.headers.authorization
                        }, 
                        params: {
                            query: {
                                classRoomId: context.id
                            }
                        }
                    })
                    
               }
                return externalHook && externalHook(app).before && externalHook(app).before.remove && externalHook(app).before.remove(context)
            } catch (err) {
                throw new Error(err)
            }
        }
    },
    after: {
        find: async (context) => {
            try {
                
                //afterFind
                return externalHook && externalHook(app).after && externalHook(app).after.find && externalHook(app).after.find(context)
            } catch (err) {
                throw new Error(err)
            }
        },
        create: async (context) => {
            try {
                
                //afterCreate
                return externalHook && externalHook(app).after && externalHook(app).after.create && externalHook(app).after.create(context)
            } catch (err) {
                throw new Error(err)
            }
        },
        patch: async (context) => {
            try {
                
                //afterPatch
                return externalHook && externalHook(app).after && externalHook(app).after.patch && externalHook(app).after.patch(context)
            } catch (err) {
                throw new Error(err)
            }
        },
        remove: async (context) => {
            try {
                
                //afterDelete
                return externalHook && externalHook(app).after && externalHook(app).after.remove && externalHook(app).after.remove(context)
            } catch (err) {
                throw new Error(err)
            }
        }
    }
})


server.on('listening', () =>
    console.log('ClassRoom Rest Server on http://%s:%d', app.get('host'), port)
);

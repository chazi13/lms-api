export const typeDef = `
    input RegisterPushNotification {
        playerId: String!
        segment: String
    }

    input PushNotificationInput {
        contents: String
    }

    extend type Mutation {
        subscribePushNotificatiton(input: RegisterPushNotification!): Response
        unsubscribePushNotification(input: RegisterPushNotification!): Response

        sendPushNotification(input: PushNotificationInput!): Response
        sendPushNotificationById(input: PushNotificationInput!, userId: String!): Response
        sendPushNotificationBySegment(input: PushNotificationInput, segment: String!): Response
    }
`;
export const resolvers = {
    Mutation: {
        subscribePushNotificatiton: async (_, { input = {} }, { requester, headers }) => {
            try{
                let data = await requester.pushNotificationRequester.send({ type: 'create', body: input, headers })
                return data
            }catch(e){
                throw new Error(e)
            }
        },
        unsubscribePushNotification: async (_, { input = {} }, { requester, headers }) => {
            try{
                let data = await requester.pushNotificationRequester.send({ type: 'delete', body: input, headers })
                return data
            }catch(e){
                throw new Error(e)
            }
        },
        sendPushNotificationById: async (_, { input = {}, userId }, { requster, headers }) => {
            try{
                let data = await requester.pushNotificationRequester.send({ type: 'sendById', body: input, userId, headers })
                return data
            }catch(e){
                throw new Error(e)
            }
        },
        sendPushNotificationBySegment: async (_, { input = {}, segment }, { requester, headers }) => {
            try{
                let data = await requester.pushNotificationRequester.send({ type: 'sendBySegment', body: input, segment, headers })
                return data
            }catch(e){
                throw new Error(e)
            }
        },
        sendPushNotification: async (_, { input = {},  }, { requester, headers }) => {
            try{
                let data = await requester.pushNotificationRequester.send({ type: 'sendAll', body: input, headers })
                return data
            }catch(e){
                throw new Error(e)
            }
        },
        // joinSegment: async (_, { input = {} }, { requester, headers }) => {
        //     let data = await requester.pushNotificationRequester.send({ type: 'joinSegment', body: input, headers })
        //     return data
        // },
        // unJoinSegment: async (_, { input = {}, _id }, { requester, headers }) => {
        //     let data = await requester.pushNotificationRequester.send({ type: 'unJoinSegment', body: input, _id, headers })
        //     return data
        // },
    }
};

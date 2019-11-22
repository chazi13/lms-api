import { REDIS_HOST, REDIS_PORT, APP_NAME, S3_BUCKET_NAME, GRAPHQL_PORT, GRAPHQL_PLAYGROUND, APP_ID } from './config'
import { merge } from 'lodash'
import express from 'express'
import http from 'http'
import { ApolloServer, makeExecutableSchema, gql, GraphQLUpload } from 'apollo-server-express'
import { createRateLimitTypeDef, createRateLimitDirective, defaultKeyGenerator } from 'graphql-rate-limit-directive'
import { GraphQLScalarType, Kind } from 'graphql'
import GraphQLJSON from 'graphql-type-json'

import { PubSub } from 'graphql-subscriptions'
import { PhoneNumberScalar, EmailAddressScalar } from './utils/scallars'
import { typeDef as Email, resolvers as emailResolvers } from './graphql/email'
import { typeDef as PushNotification, resolvers as pushNotificationResolvers } from './graphql/pushNotification'
import { typeDef as user, resolvers as userResolvers } from './graphql/user'
import { typeDef as profile, resolvers as profileResolvers } from './graphql/profile'
import { typeDef as education, resolvers as educationResolvers } from './graphql/education'
import { typeDef as work, resolvers as workResolvers } from './graphql/work'
import { typeDef as skill, resolvers as skillResolvers } from './graphql/skill'
import { typeDef as project, resolvers as projectResolvers } from './graphql/project'
import { typeDef as space, resolvers as spaceResolvers } from './graphql/space'
import { typeDef as menu, resolvers as menuResolvers } from './graphql/menu'
import { typeDef as spaceMenu, resolvers as spaceMenuResolvers } from './graphql/spaceMenu'
import { typeDef as courseCategory, resolvers as courseCategoryResolvers } from './graphql/courseCategory'
import { typeDef as course, resolvers as courseResolvers } from './graphql/course'
import { typeDef as section, resolvers as sectionResolvers } from './graphql/section'
import { typeDef as lecture, resolvers as lectureResolvers } from './graphql/lecture'
import { typeDef as article, resolvers as articleResolvers } from './graphql/article'
import { typeDef as quiz, resolvers as quizResolvers } from './graphql/quiz'
import { typeDef as question, resolvers as questionResolvers } from './graphql/question'
import { typeDef as option, resolvers as optionResolvers } from './graphql/option'
import { typeDef as answer, resolvers as answerResolvers } from './graphql/answer'
import { typeDef as review, resolvers as reviewResolvers } from './graphql/review'
import { typeDef as folder, resolvers as folderResolvers } from './graphql/folder'
import { typeDef as userFile, resolvers as userFileResolvers } from './graphql/userFile'
import { typeDef as event, resolvers as eventResolvers } from './graphql/event'
import { typeDef as checkInRoom, resolvers as checkInRoomResolvers } from './graphql/checkInRoom'
import { typeDef as message, resolvers as messageResolvers } from './graphql/message'
import { typeDef as chatFileStorage, resolvers as chatFileStorageResolvers } from './graphql/chatFileStorage'
import { typeDef as post, resolvers as postResolvers } from './graphql/post'
import { typeDef as postAttachment, resolvers as postAttachmentResolvers } from './graphql/postAttachment'
import { typeDef as reaction, resolvers as reactionResolvers } from './graphql/reaction'
import { typeDef as workspace, resolvers as workspaceResolvers } from './graphql/workspace'
import { typeDef as board, resolvers as boardResolvers } from './graphql/board'
import { typeDef as list, resolvers as listResolvers } from './graphql/list'
import { typeDef as card, resolvers as cardResolvers } from './graphql/card'
import { typeDef as label, resolvers as labelResolvers } from './graphql/label'
import { typeDef as checklist, resolvers as checklistResolvers } from './graphql/checklist'
import { typeDef as listChecklist, resolvers as listChecklistResolvers } from './graphql/listChecklist'
import { typeDef as comment, resolvers as commentResolvers } from './graphql/comment'
import { typeDef as subComment, resolvers as subCommentResolvers } from './graphql/subComment'
import { typeDef as commentAttachment, resolvers as commentAttachmentResolvers } from './graphql/commentAttachment'
import { typeDef as attachment, resolvers as attachmentResolvers } from './graphql/attachment'
const { injectConfigFromHook } = require('./utils/hookGraphql')
const pubSub = new PubSub()
const Prometheus = require('./monitor')

const cote = require('cote')({ redis: { host: REDIS_HOST, port: REDIS_PORT } })
const typeDefs = gql `
   type Query { default: String }
   type Response { message: String }
   type Mutation { default: String }
   type Subscription { default: String }
enum Role {
  ADMIN
  AUTHENTICATED
}
enum ProjectType {
  SLIDE
  PORTFOLIO
}
enum LectureType {
  VIDEO
  SLIDE
  ARTICLE
  QUIZ
  TASK
}
enum Visible {
  PUBLIC
  PRIVATE
}
   scalar Timestamp
   scalar JSON
   scalar Upload
   scalar DateTime
   scalar Date
   scalar PhoneNumber
   scalar EmailAddress
`
const resolver = {
    PhoneNumber: PhoneNumberScalar,
    EmailAddress: EmailAddressScalar,
    JSON: GraphQLJSON,
    Upload: GraphQLUpload,
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return new Date(value).toString() // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10); // ast value is always in string format
            }
            return null;
        },
    }),
    Timestamp: new GraphQLScalarType({
        name: 'Timestamp',

        parseValue(value) {
            try {

                let valid = new Date(value).getTime() > 0;
                console.log("valid", valid)
                if (!valid) {
                    throw new UserInputError("Date is not valid")
                }
                return value
            } catch (error) {
                console.log("err", error)
                throw new UserInputError("Date is not valid")
            }
        },
        parseLiteral(ast) {
            try {
                let valid = new Date(Number(ast.value)).getTime() > 0;
                console.log("valid", valid)
                if (!valid) {
                    throw new UserInputError("Date is not valid")
                }
                return ast.value
            } catch (error) {
                console.log("err", error)
                throw new UserInputError("Date is not valid")
            }
        },
    })
}
const schema = makeExecutableSchema({
    typeDefs: [typeDefs, createRateLimitTypeDef(), injectConfigFromHook("email", Email), injectConfigFromHook("pushNotification", PushNotification), injectConfigFromHook('user', user), injectConfigFromHook('profile', profile), injectConfigFromHook('education', education), injectConfigFromHook('work', work), injectConfigFromHook('skill', skill), injectConfigFromHook('project', project), injectConfigFromHook('space', space), injectConfigFromHook('menu', menu), injectConfigFromHook('spaceMenu', spaceMenu), injectConfigFromHook('courseCategory', courseCategory), injectConfigFromHook('course', course), injectConfigFromHook('section', section), injectConfigFromHook('lecture', lecture), injectConfigFromHook('article', article), injectConfigFromHook('quiz', quiz), injectConfigFromHook('question', question), injectConfigFromHook('option', option), injectConfigFromHook('answer', answer), injectConfigFromHook('review', review), injectConfigFromHook('folder', folder), injectConfigFromHook('userFile', userFile), injectConfigFromHook('event', event), injectConfigFromHook('checkInRoom', checkInRoom), injectConfigFromHook('message', message), injectConfigFromHook('chatFileStorage', chatFileStorage), injectConfigFromHook('post', post), injectConfigFromHook('postAttachment', postAttachment), injectConfigFromHook('reaction', reaction), injectConfigFromHook('workspace', workspace), injectConfigFromHook('board', board), injectConfigFromHook('list', list), injectConfigFromHook('card', card), injectConfigFromHook('label', label), injectConfigFromHook('checklist', checklist), injectConfigFromHook('listChecklist', listChecklist), injectConfigFromHook('comment', comment), injectConfigFromHook('subComment', subComment), injectConfigFromHook('commentAttachment', commentAttachment), injectConfigFromHook('attachment', attachment)],
    resolvers: merge(resolver, emailResolvers, pushNotificationResolvers, userResolvers({ pubSub }), profileResolvers({ pubSub }), educationResolvers({ pubSub }), workResolvers({ pubSub }), skillResolvers({ pubSub }), projectResolvers({ pubSub }), spaceResolvers({ pubSub }), menuResolvers({ pubSub }), spaceMenuResolvers({ pubSub }), courseCategoryResolvers({ pubSub }), courseResolvers({ pubSub }), sectionResolvers({ pubSub }), lectureResolvers({ pubSub }), articleResolvers({ pubSub }), quizResolvers({ pubSub }), questionResolvers({ pubSub }), optionResolvers({ pubSub }), answerResolvers({ pubSub }), reviewResolvers({ pubSub }), folderResolvers({ pubSub }), userFileResolvers({ pubSub }), eventResolvers({ pubSub }), checkInRoomResolvers({ pubSub }), messageResolvers({ pubSub }), chatFileStorageResolvers({ pubSub }), postResolvers({ pubSub }), postAttachmentResolvers({ pubSub }), reactionResolvers({ pubSub }), workspaceResolvers({ pubSub }), boardResolvers({ pubSub }), listResolvers({ pubSub }), cardResolvers({ pubSub }), labelResolvers({ pubSub }), checklistResolvers({ pubSub }), listChecklistResolvers({ pubSub }), commentResolvers({ pubSub }), subCommentResolvers({ pubSub }), commentAttachmentResolvers({ pubSub }), attachmentResolvers({ pubSub })),
    schemaDirectives: {
        rateLimit: createRateLimitDirective({
            keyGenerator
        }),
    },
});

const storageRequester = new cote.Requester({
    name: 'Storage Requester',
    key: APP_ID + '_storage',
})

const emailRequester = new cote.Requester({
    name: 'Email Requester',
    key: APP_ID + '_email',
})

const pushNotificationRequester = new cote.Requester({
    name: 'Push Notification Requester',
    key: APP_ID + '_pushNotification',
})

const userRequester = new cote.Requester({
    name: 'user Requester',
    key: APP_ID + '_user',
})

const profileRequester = new cote.Requester({
    name: 'profile Requester',
    key: APP_ID + '_profile',
})

const educationRequester = new cote.Requester({
    name: 'education Requester',
    key: APP_ID + '_education',
})

const workRequester = new cote.Requester({
    name: 'work Requester',
    key: APP_ID + '_work',
})

const skillRequester = new cote.Requester({
    name: 'skill Requester',
    key: APP_ID + '_skill',
})

const projectRequester = new cote.Requester({
    name: 'project Requester',
    key: APP_ID + '_project',
})

const spaceRequester = new cote.Requester({
    name: 'space Requester',
    key: APP_ID + '_space',
})

const menuRequester = new cote.Requester({
    name: 'menu Requester',
    key: APP_ID + '_menu',
})

const spaceMenuRequester = new cote.Requester({
    name: 'spaceMenu Requester',
    key: APP_ID + '_spaceMenu',
})

const courseCategoryRequester = new cote.Requester({
    name: 'courseCategory Requester',
    key: APP_ID + '_courseCategory',
})

const courseRequester = new cote.Requester({
    name: 'course Requester',
    key: APP_ID + '_course',
})

const sectionRequester = new cote.Requester({
    name: 'section Requester',
    key: APP_ID + '_section',
})

const lectureRequester = new cote.Requester({
    name: 'lecture Requester',
    key: APP_ID + '_lecture',
})

const articleRequester = new cote.Requester({
    name: 'article Requester',
    key: APP_ID + '_article',
})

const quizRequester = new cote.Requester({
    name: 'quiz Requester',
    key: APP_ID + '_quiz',
})

const questionRequester = new cote.Requester({
    name: 'question Requester',
    key: APP_ID + '_question',
})

const optionRequester = new cote.Requester({
    name: 'option Requester',
    key: APP_ID + '_option',
})

const answerRequester = new cote.Requester({
    name: 'answer Requester',
    key: APP_ID + '_answer',
})

const reviewRequester = new cote.Requester({
    name: 'review Requester',
    key: APP_ID + '_review',
})

const folderRequester = new cote.Requester({
    name: 'folder Requester',
    key: APP_ID + '_folder',
})

const userFileRequester = new cote.Requester({
    name: 'userFile Requester',
    key: APP_ID + '_userFile',
})

const eventRequester = new cote.Requester({
    name: 'event Requester',
    key: APP_ID + '_event',
})

const checkInRoomRequester = new cote.Requester({
    name: 'checkInRoom Requester',
    key: APP_ID + '_checkInRoom',
})

const messageRequester = new cote.Requester({
    name: 'message Requester',
    key: APP_ID + '_message',
})

const chatFileStorageRequester = new cote.Requester({
    name: 'chatFileStorage Requester',
    key: APP_ID + '_chatFileStorage',
})

const postRequester = new cote.Requester({
    name: 'post Requester',
    key: APP_ID + '_post',
})

const postAttachmentRequester = new cote.Requester({
    name: 'postAttachment Requester',
    key: APP_ID + '_postAttachment',
})

const reactionRequester = new cote.Requester({
    name: 'reaction Requester',
    key: APP_ID + '_reaction',
})

const workspaceRequester = new cote.Requester({
    name: 'workspace Requester',
    key: APP_ID + '_workspace',
})

const boardRequester = new cote.Requester({
    name: 'board Requester',
    key: APP_ID + '_board',
})

const listRequester = new cote.Requester({
    name: 'list Requester',
    key: APP_ID + '_list',
})

const cardRequester = new cote.Requester({
    name: 'card Requester',
    key: APP_ID + '_card',
})

const labelRequester = new cote.Requester({
    name: 'label Requester',
    key: APP_ID + '_label',
})

const checklistRequester = new cote.Requester({
    name: 'checklist Requester',
    key: APP_ID + '_checklist',
})

const listChecklistRequester = new cote.Requester({
    name: 'listChecklist Requester',
    key: APP_ID + '_listChecklist',
})

const commentRequester = new cote.Requester({
    name: 'comment Requester',
    key: APP_ID + '_comment',
})

const subCommentRequester = new cote.Requester({
    name: 'subComment Requester',
    key: APP_ID + '_subComment',
})

const commentAttachmentRequester = new cote.Requester({
    name: 'commentAttachment Requester',
    key: APP_ID + '_commentAttachment',
})

const attachmentRequester = new cote.Requester({
    name: 'attachment Requester',
    key: APP_ID + '_attachment',
})

const uuid = () => {
    return Math.random().toString(36).substring(7)
}


const keyGenerator = (directiveArgs, obj, args, context, info) =>
    `${context.ip}:${defaultKeyGenerator(         obj,
         args,
         context,
         directiveArgs,
      )}`
const parseBearerToken = (headers) => {
    return Object.assign(headers, {
        authorization: headers.authorization ? headers.authorization.split(" ")[1] : null
    })
}

const context = ({ req, connection }) => {
    return {
        bucket: S3_BUCKET_NAME,
        uuid,
        ip: req && req.ip,
        storageUrl: "https://" + S3_BUCKET_NAME + ".s3-ap-southeast-1.amazonaws.com/",
        headers: !connection && parseBearerToken(req.headers),
        requester: {
            storageRequester,
            emailRequester,
            pushNotificationRequester,
            userRequester,
            profileRequester,
            educationRequester,
            workRequester,
            skillRequester,
            projectRequester,
            spaceRequester,
            menuRequester,
            spaceMenuRequester,
            courseCategoryRequester,
            courseRequester,
            sectionRequester,
            lectureRequester,
            articleRequester,
            quizRequester,
            questionRequester,
            optionRequester,
            answerRequester,
            reviewRequester,
            folderRequester,
            userFileRequester,
            eventRequester,
            checkInRoomRequester,
            messageRequester,
            chatFileStorageRequester,
            postRequester,
            postAttachmentRequester,
            reactionRequester,
            workspaceRequester,
            boardRequester,
            listRequester,
            cardRequester,
            labelRequester,
            checklistRequester,
            listChecklistRequester,
            commentRequester,
            subCommentRequester,
            commentAttachmentRequester,
            attachmentRequester,
        },
        resolvers: {
            userResolvers,
            profileResolvers,
            educationResolvers,
            workResolvers,
            skillResolvers,
            projectResolvers,
            spaceResolvers,
            menuResolvers,
            spaceMenuResolvers,
            courseCategoryResolvers,
            courseResolvers,
            sectionResolvers,
            lectureResolvers,
            articleResolvers,
            quizResolvers,
            questionResolvers,
            optionResolvers,
            answerResolvers,
            reviewResolvers,
            folderResolvers,
            userFileResolvers,
            eventResolvers,
            checkInRoomResolvers,
            messageResolvers,
            chatFileStorageResolvers,
            postResolvers,
            postAttachmentResolvers,
            reactionResolvers,
            workspaceResolvers,
            boardResolvers,
            listResolvers,
            cardResolvers,
            labelResolvers,
            checklistResolvers,
            listChecklistResolvers,
            commentResolvers,
            subCommentResolvers,
            commentAttachmentResolvers,
            attachmentResolvers
        }
    }
}

const apolloServer = new ApolloServer({
    schema,
    context,
    introspection: true,
    playground: GRAPHQL_PLAYGROUND === "true"
})


const app = express();

// CORS middleware
app.use(function(req, res, next) {
    // Allow Origins
    res.header("Access-Control-Allow-Origin", "*");
    // Allow Methods
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    // Allow Headers
    res.header("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, Authorization");
    // Next middleware 
    next();
});


app.use(Prometheus.requestCounters);
app.use(Prometheus.responseCounters);

/**
 * Enable metrics endpoint
 */
Prometheus.injectMetricsRoute(app);

/**
 * Enable collection of default metrics
 */
Prometheus.startCollection();
apolloServer.applyMiddleware({ app });

const httpServer = http.createServer(app);

apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen(GRAPHQL_PORT, () => {
    console.log('🚀 Server ready at http://localhost:' + GRAPHQL_PORT + apolloServer.graphqlPath)
    console.log('🚀 Subscriptions ready at ws://localhost:' + GRAPHQL_PORT + apolloServer.subscriptionsPath)
})
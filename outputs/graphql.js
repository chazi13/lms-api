import { REDIS_HOST, REDIS_PORT, APP_NAME, BUCKET } from './config'
import { merge } from 'lodash'
import express from 'express'
import http from 'http'
import { ApolloServer, makeExecutableSchema, gql, GraphQLUpload } from 'apollo-server-express'
import { createRateLimitTypeDef, createRateLimitDirective, defaultKeyGenerator } from 'graphql-rate-limit-directive'
import { GraphQLScalarType, Kind } from 'graphql'
import GraphQLJSON from 'graphql-type-json'

import { PubSub } from 'graphql-subscriptions'
import { typeDef as Email, resolvers as emailResolvers } from './graphql/email'
import { typeDef as PushNotification, resolvers as pushNotificationResolvers } from './graphql/pushNotification'
import { typeDef as user, resolvers as userResolvers } from './graphql/user'
import { typeDef as menu, resolvers as menuResolvers } from './graphql/menu'
import { typeDef as profile, resolvers as profileResolvers } from './graphql/profile'
import { typeDef as student, resolvers as studentResolvers } from './graphql/student'
import { typeDef as studentWorkspace, resolvers as studentWorkspaceResolvers } from './graphql/studentWorkspace'
import { typeDef as education, resolvers as educationResolvers } from './graphql/education'
import { typeDef as work, resolvers as workResolvers } from './graphql/work'
import { typeDef as skill, resolvers as skillResolvers } from './graphql/skill'
import { typeDef as project, resolvers as projectResolvers } from './graphql/project'
import { typeDef as classRoom, resolvers as classRoomResolvers } from './graphql/classRoom'
import { typeDef as group, resolvers as groupResolvers } from './graphql/group'
import { typeDef as studentClass, resolvers as studentClassResolvers } from './graphql/studentClass'
import { typeDef as studentGroup, resolvers as studentGroupResolvers } from './graphql/studentGroup'
import { typeDef as post, resolvers as postResolvers } from './graphql/post'
import { typeDef as postAttachment, resolvers as postAttachmentResolvers } from './graphql/postAttachment'
import { typeDef as event, resolvers as eventResolvers } from './graphql/event'
import { typeDef as courseCategory, resolvers as courseCategoryResolvers } from './graphql/courseCategory'
import { typeDef as course, resolvers as courseResolvers } from './graphql/course'
import { typeDef as section, resolvers as sectionResolvers } from './graphql/section'
import { typeDef as lecture, resolvers as lectureResolvers } from './graphql/lecture'
import { typeDef as article, resolvers as articleResolvers } from './graphql/article'
import { typeDef as reaction, resolvers as reactionResolvers } from './graphql/reaction'
import { typeDef as comment, resolvers as commentResolvers } from './graphql/comment'
import { typeDef as subComment, resolvers as subCommentResolvers } from './graphql/subComment'
import { typeDef as commentAttachment, resolvers as commentAttachmentResolvers } from './graphql/commentAttachment'
import { typeDef as message, resolvers as messageResolvers } from './graphql/message'
import { typeDef as chatFileStorage, resolvers as chatFileStorageResolvers } from './graphql/chatFileStorage'
import { typeDef as propertyUser, resolvers as propertyUserResolvers } from './graphql/propertyUser'
import { typeDef as workspace, resolvers as workspaceResolvers } from './graphql/workspace'
import { typeDef as board, resolvers as boardResolvers } from './graphql/board'
import { typeDef as list, resolvers as listResolvers } from './graphql/list'
import { typeDef as card, resolvers as cardResolvers } from './graphql/card'
import { typeDef as cardMember, resolvers as cardMemberResolvers } from './graphql/cardMember'
import { typeDef as label, resolvers as labelResolvers } from './graphql/label'
import { typeDef as checklist, resolvers as checklistResolvers } from './graphql/checklist'
import { typeDef as listChecklist, resolvers as listChecklistResolvers } from './graphql/listChecklist'
import { typeDef as attachment, resolvers as attachmentResolvers } from './graphql/attachment'
import { typeDef as quiz, resolvers as quizResolvers } from './graphql/quiz'
import { typeDef as question, resolvers as questionResolvers } from './graphql/question'
import { typeDef as option, resolvers as optionResolvers } from './graphql/option'
import { typeDef as answer, resolvers as answerResolvers } from './graphql/answer'
import { typeDef as review, resolvers as reviewResolvers } from './graphql/review'
import { typeDef as checkInRoomMessage, resolvers as checkInRoomMessageResolvers } from './graphql/checkInRoomMessage'
import { typeDef as checkInRoom, resolvers as checkInRoomResolvers } from './graphql/checkInRoom'
import { typeDef as folder, resolvers as folderResolvers } from './graphql/folder'
import { typeDef as file, resolvers as fileResolvers } from './graphql/file'
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
`
const resolver = {
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
    typeDefs: [typeDefs, createRateLimitTypeDef(), injectConfigFromHook("email", Email), injectConfigFromHook("pushNotification", PushNotification), injectConfigFromHook('user', user), injectConfigFromHook('menu', menu), injectConfigFromHook('profile', profile), injectConfigFromHook('student', student), injectConfigFromHook('studentWorkspace', studentWorkspace), injectConfigFromHook('education', education), injectConfigFromHook('work', work), injectConfigFromHook('skill', skill), injectConfigFromHook('project', project), injectConfigFromHook('classRoom', classRoom), injectConfigFromHook('group', group), injectConfigFromHook('studentClass', studentClass), injectConfigFromHook('studentGroup', studentGroup), injectConfigFromHook('post', post), injectConfigFromHook('postAttachment', postAttachment), injectConfigFromHook('event', event), injectConfigFromHook('courseCategory', courseCategory), injectConfigFromHook('course', course), injectConfigFromHook('section', section), injectConfigFromHook('lecture', lecture), injectConfigFromHook('article', article), injectConfigFromHook('reaction', reaction), injectConfigFromHook('comment', comment), injectConfigFromHook('subComment', subComment), injectConfigFromHook('commentAttachment', commentAttachment), injectConfigFromHook('message', message), injectConfigFromHook('chatFileStorage', chatFileStorage), injectConfigFromHook('propertyUser', propertyUser), injectConfigFromHook('workspace', workspace), injectConfigFromHook('board', board), injectConfigFromHook('list', list), injectConfigFromHook('card', card), injectConfigFromHook('cardMember', cardMember), injectConfigFromHook('label', label), injectConfigFromHook('checklist', checklist), injectConfigFromHook('listChecklist', listChecklist), injectConfigFromHook('attachment', attachment), injectConfigFromHook('quiz', quiz), injectConfigFromHook('question', question), injectConfigFromHook('option', option), injectConfigFromHook('answer', answer), injectConfigFromHook('review', review), injectConfigFromHook('checkInRoomMessage', checkInRoomMessage), injectConfigFromHook('checkInRoom', checkInRoom), injectConfigFromHook('folder', folder), injectConfigFromHook('file', file)],
    resolvers: merge(resolver, emailResolvers, pushNotificationResolvers, userResolvers({ pubSub }), menuResolvers({ pubSub }), profileResolvers({ pubSub }), studentResolvers({ pubSub }), studentWorkspaceResolvers({ pubSub }), educationResolvers({ pubSub }), workResolvers({ pubSub }), skillResolvers({ pubSub }), projectResolvers({ pubSub }), classRoomResolvers({ pubSub }), groupResolvers({ pubSub }), studentClassResolvers({ pubSub }), studentGroupResolvers({ pubSub }), postResolvers({ pubSub }), postAttachmentResolvers({ pubSub }), eventResolvers({ pubSub }), courseCategoryResolvers({ pubSub }), courseResolvers({ pubSub }), sectionResolvers({ pubSub }), lectureResolvers({ pubSub }), articleResolvers({ pubSub }), reactionResolvers({ pubSub }), commentResolvers({ pubSub }), subCommentResolvers({ pubSub }), commentAttachmentResolvers({ pubSub }), messageResolvers({ pubSub }), chatFileStorageResolvers({ pubSub }), propertyUserResolvers({ pubSub }), workspaceResolvers({ pubSub }), boardResolvers({ pubSub }), listResolvers({ pubSub }), cardResolvers({ pubSub }), cardMemberResolvers({ pubSub }), labelResolvers({ pubSub }), checklistResolvers({ pubSub }), listChecklistResolvers({ pubSub }), attachmentResolvers({ pubSub }), quizResolvers({ pubSub }), questionResolvers({ pubSub }), optionResolvers({ pubSub }), answerResolvers({ pubSub }), reviewResolvers({ pubSub }), checkInRoomMessageResolvers({ pubSub }), checkInRoomResolvers({ pubSub }), folderResolvers({ pubSub }), fileResolvers({ pubSub })),
    schemaDirectives: {
        rateLimit: createRateLimitDirective({
            keyGenerator
        }),
    },
});

const storageRequester = new cote.Requester({
    name: 'Storage Requester',
    key: 'storage',
})

const emailRequester = new cote.Requester({
    name: 'Email Requester',
    key: 'email',
})

const pushNotificationRequester = new cote.Requester({
    name: 'Push Notification Requester',
    key: 'pushNotification',
})

const userRequester = new cote.Requester({
    name: 'user Requester',
    key: 'user',
})

const menuRequester = new cote.Requester({
    name: 'menu Requester',
    key: 'menu',
})

const profileRequester = new cote.Requester({
    name: 'profile Requester',
    key: 'profile',
})

const studentRequester = new cote.Requester({
    name: 'student Requester',
    key: 'student',
})

const studentWorkspaceRequester = new cote.Requester({
    name: 'studentWorkspace Requester',
    key: 'studentWorkspace',
})

const educationRequester = new cote.Requester({
    name: 'education Requester',
    key: 'education',
})

const workRequester = new cote.Requester({
    name: 'work Requester',
    key: 'work',
})

const skillRequester = new cote.Requester({
    name: 'skill Requester',
    key: 'skill',
})

const projectRequester = new cote.Requester({
    name: 'project Requester',
    key: 'project',
})

const classRoomRequester = new cote.Requester({
    name: 'classRoom Requester',
    key: 'classRoom',
})

const groupRequester = new cote.Requester({
    name: 'group Requester',
    key: 'group',
})

const studentClassRequester = new cote.Requester({
    name: 'studentClass Requester',
    key: 'studentClass',
})

const studentGroupRequester = new cote.Requester({
    name: 'studentGroup Requester',
    key: 'studentGroup',
})

const postRequester = new cote.Requester({
    name: 'post Requester',
    key: 'post',
})

const postAttachmentRequester = new cote.Requester({
    name: 'postAttachment Requester',
    key: 'postAttachment',
})

const eventRequester = new cote.Requester({
    name: 'event Requester',
    key: 'event',
})

const courseCategoryRequester = new cote.Requester({
    name: 'courseCategory Requester',
    key: 'courseCategory',
})

const courseRequester = new cote.Requester({
    name: 'course Requester',
    key: 'course',
})

const sectionRequester = new cote.Requester({
    name: 'section Requester',
    key: 'section',
})

const lectureRequester = new cote.Requester({
    name: 'lecture Requester',
    key: 'lecture',
})

const articleRequester = new cote.Requester({
    name: 'article Requester',
    key: 'article',
})

const reactionRequester = new cote.Requester({
    name: 'reaction Requester',
    key: 'reaction',
})

const commentRequester = new cote.Requester({
    name: 'comment Requester',
    key: 'comment',
})

const subCommentRequester = new cote.Requester({
    name: 'subComment Requester',
    key: 'subComment',
})

const commentAttachmentRequester = new cote.Requester({
    name: 'commentAttachment Requester',
    key: 'commentAttachment',
})

const messageRequester = new cote.Requester({
    name: 'message Requester',
    key: 'message',
})

const chatFileStorageRequester = new cote.Requester({
    name: 'chatFileStorage Requester',
    key: 'chatFileStorage',
})

const propertyUserRequester = new cote.Requester({
    name: 'propertyUser Requester',
    key: 'propertyUser',
})

const workspaceRequester = new cote.Requester({
    name: 'workspace Requester',
    key: 'workspace',
})

const boardRequester = new cote.Requester({
    name: 'board Requester',
    key: 'board',
})

const listRequester = new cote.Requester({
    name: 'list Requester',
    key: 'list',
})

const cardRequester = new cote.Requester({
    name: 'card Requester',
    key: 'card',
})

const cardMemberRequester = new cote.Requester({
    name: 'cardMember Requester',
    key: 'cardMember',
})

const labelRequester = new cote.Requester({
    name: 'label Requester',
    key: 'label',
})

const checklistRequester = new cote.Requester({
    name: 'checklist Requester',
    key: 'checklist',
})

const listChecklistRequester = new cote.Requester({
    name: 'listChecklist Requester',
    key: 'listChecklist',
})

const attachmentRequester = new cote.Requester({
    name: 'attachment Requester',
    key: 'attachment',
})

const quizRequester = new cote.Requester({
    name: 'quiz Requester',
    key: 'quiz',
})

const questionRequester = new cote.Requester({
    name: 'question Requester',
    key: 'question',
})

const optionRequester = new cote.Requester({
    name: 'option Requester',
    key: 'option',
})

const answerRequester = new cote.Requester({
    name: 'answer Requester',
    key: 'answer',
})

const reviewRequester = new cote.Requester({
    name: 'review Requester',
    key: 'review',
})

const checkInRoomMessageRequester = new cote.Requester({
    name: 'checkInRoomMessage Requester',
    key: 'checkInRoomMessage',
})

const checkInRoomRequester = new cote.Requester({
    name: 'checkInRoom Requester',
    key: 'checkInRoom',
})

const folderRequester = new cote.Requester({
    name: 'folder Requester',
    key: 'folder',
})

const fileRequester = new cote.Requester({
    name: 'file Requester',
    key: 'file',
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
        bucket: BUCKET,
        uuid,
        storageUrl: "https://" + BUCKET + ".s3-ap-southeast-1.amazonaws.com/",
        headers: !connection && parseBearerToken(req.headers),
        requester: {
            storageRequester,
            emailRequester,
            pushNotificationRequester,
            userRequester,
            menuRequester,
            profileRequester,
            studentRequester,
            studentWorkspaceRequester,
            educationRequester,
            workRequester,
            skillRequester,
            projectRequester,
            classRoomRequester,
            groupRequester,
            studentClassRequester,
            studentGroupRequester,
            postRequester,
            postAttachmentRequester,
            eventRequester,
            courseCategoryRequester,
            courseRequester,
            sectionRequester,
            lectureRequester,
            articleRequester,
            reactionRequester,
            commentRequester,
            subCommentRequester,
            commentAttachmentRequester,
            messageRequester,
            chatFileStorageRequester,
            propertyUserRequester,
            workspaceRequester,
            boardRequester,
            listRequester,
            cardRequester,
            cardMemberRequester,
            labelRequester,
            checklistRequester,
            listChecklistRequester,
            attachmentRequester,
            quizRequester,
            questionRequester,
            optionRequester,
            answerRequester,
            reviewRequester,
            checkInRoomMessageRequester,
            checkInRoomRequester,
            folderRequester,
            fileRequester,
        },
        resolvers: {
            userResolvers,
            menuResolvers,
            profileResolvers,
            studentResolvers,
            studentWorkspaceResolvers,
            educationResolvers,
            workResolvers,
            skillResolvers,
            projectResolvers,
            classRoomResolvers,
            groupResolvers,
            studentClassResolvers,
            studentGroupResolvers,
            postResolvers,
            postAttachmentResolvers,
            eventResolvers,
            courseCategoryResolvers,
            courseResolvers,
            sectionResolvers,
            lectureResolvers,
            articleResolvers,
            reactionResolvers,
            commentResolvers,
            subCommentResolvers,
            commentAttachmentResolvers,
            messageResolvers,
            chatFileStorageResolvers,
            propertyUserResolvers,
            workspaceResolvers,
            boardResolvers,
            listResolvers,
            cardResolvers,
            cardMemberResolvers,
            labelResolvers,
            checklistResolvers,
            listChecklistResolvers,
            attachmentResolvers,
            quizResolvers,
            questionResolvers,
            optionResolvers,
            answerResolvers,
            reviewResolvers,
            checkInRoomMessageResolvers,
            checkInRoomResolvers,
            folderResolvers,
            fileResolvers
        }
    }
}

const server = new ApolloServer({
    schema,
    context,
    introspection: true
})


const app = express();

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
server.applyMiddleware({ app });
const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)
const PORT = 4000
httpServer.listen(PORT, () => {
    console.log("Server ready at http://localhost:" + PORT + "/graphql")
})
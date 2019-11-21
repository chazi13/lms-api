const appRoot = require('app-root-path');
let externalPermission = null
try {
    externalPermission = require(appRoot + '/hooks/user')
} catch (e) {

}
const permissions = externalPermission && externalPermission().permissions || {
    admin: ['admin:*'],
    authenticated: [
        'user:find', 'user:get', 'user:patch',
        'pushNotification:create', 'pushNotification:remove',
        'menu:find', 'menu:get', 'menu:create', 'menu:removeOwn', 'menu:patchOwn',
        'user:find', 'user:get', 'user:create', 'user:removeOwn', 'user:patchOwn',
        'profile:find', 'profile:get', 'profile:create', 'profile:removeOwn', 'profile:patchOwn',
        'student:find', 'student:get', 'student:create', 'student:removeOwn', 'student:patchOwn',
        'studentWorkspace:find', 'studentWorkspace:get', 'studentWorkspace:create', 'studentWorkspace:removeOwn', 'studentWorkspace:patchOwn',
        'education:find', 'education:get', 'education:create', 'education:removeOwn', 'education:patchOwn',
        'work:find', 'work:get', 'work:create', 'work:removeOwn', 'work:patchOwn',
        'skill:find', 'skill:get', 'skill:create', 'skill:removeOwn', 'skill:patchOwn',
        'project:find', 'project:get', 'project:create', 'project:removeOwn', 'project:patchOwn',
        'classRoom:find', 'classRoom:get', 'classRoom:create', 'classRoom:removeOwn', 'classRoom:patchOwn',
        'group:find', 'group:get', 'group:create', 'group:removeOwn', 'group:patchOwn',
        'studentClass:find', 'studentClass:get', 'studentClass:create', 'studentClass:removeOwn', 'studentClass:patchOwn',
        'studentGroup:find', 'studentGroup:get', 'studentGroup:create', 'studentGroup:removeOwn', 'studentGroup:patchOwn',
        'post:find', 'post:get', 'post:create', 'post:removeOwn', 'post:patchOwn',
        'postAttachment:find', 'postAttachment:get', 'postAttachment:create', 'postAttachment:removeOwn', 'postAttachment:patchOwn',
        'event:find', 'event:get', 'event:create', 'event:removeOwn', 'event:patchOwn',
        'courseCategory:find', 'courseCategory:get', 'courseCategory:create', 'courseCategory:removeOwn', 'courseCategory:patchOwn',
        'course:find', 'course:get', 'course:create', 'course:removeOwn', 'course:patchOwn',
        'section:find', 'section:get', 'section:create', 'section:removeOwn', 'section:patchOwn',
        'lecture:find', 'lecture:get', 'lecture:create', 'lecture:removeOwn', 'lecture:patchOwn',
        'article:find', 'article:get', 'article:create', 'article:removeOwn', 'article:patchOwn',
        'reaction:find', 'reaction:get', 'reaction:create', 'reaction:removeOwn', 'reaction:patchOwn',
        'comment:find', 'comment:get', 'comment:create', 'comment:removeOwn', 'comment:patchOwn',
        'subComment:find', 'subComment:get', 'subComment:create', 'subComment:removeOwn', 'subComment:patchOwn',
        'commentAttachment:find', 'commentAttachment:get', 'commentAttachment:create', 'commentAttachment:removeOwn', 'commentAttachment:patchOwn',
        'message:find', 'message:get', 'message:create', 'message:removeOwn', 'message:patchOwn',
        'chatFileStorage:find', 'chatFileStorage:get', 'chatFileStorage:create', 'chatFileStorage:removeOwn', 'chatFileStorage:patchOwn',
        'propertyUser:find', 'propertyUser:get', 'propertyUser:create', 'propertyUser:removeOwn', 'propertyUser:patchOwn',
        'workspace:find', 'workspace:get', 'workspace:create', 'workspace:removeOwn', 'workspace:patchOwn',
        'board:find', 'board:get', 'board:create', 'board:removeOwn', 'board:patchOwn',
        'list:find', 'list:get', 'list:create', 'list:removeOwn', 'list:patchOwn',
        'card:find', 'card:get', 'card:create', 'card:removeOwn', 'card:patchOwn',
        'cardMember:find', 'cardMember:get', 'cardMember:create', 'cardMember:removeOwn', 'cardMember:patchOwn',
        'label:find', 'label:get', 'label:create', 'label:removeOwn', 'label:patchOwn',
        'checklist:find', 'checklist:get', 'checklist:create', 'checklist:removeOwn', 'checklist:patchOwn',
        'listChecklist:find', 'listChecklist:get', 'listChecklist:create', 'listChecklist:removeOwn', 'listChecklist:patchOwn',
        'attachment:find', 'attachment:get', 'attachment:create', 'attachment:removeOwn', 'attachment:patchOwn',
        'quiz:find', 'quiz:get', 'quiz:create', 'quiz:removeOwn', 'quiz:patchOwn',
        'question:find', 'question:get', 'question:create', 'question:removeOwn', 'question:patchOwn',
        'option:find', 'option:get', 'option:create', 'option:removeOwn', 'option:patchOwn',
        'answer:find', 'answer:get', 'answer:create', 'answer:removeOwn', 'answer:patchOwn',
        'review:find', 'review:get', 'review:create', 'review:removeOwn', 'review:patchOwn',
        'checkInRoomMessage:find', 'checkInRoomMessage:get', 'checkInRoomMessage:create', 'checkInRoomMessage:removeOwn', 'checkInRoomMessage:patchOwn',
        'checkInRoom:find', 'checkInRoom:get', 'checkInRoom:create', 'checkInRoom:removeOwn', 'checkInRoom:patchOwn',
        'folder:find', 'folder:get', 'folder:create', 'folder:removeOwn', 'folder:patchOwn',
        'file:find', 'file:get', 'file:create', 'file:removeOwn', 'file:patchOwn'
    ],

    public: [

        'menu:find', 'menu:get',
        'user:find', 'user:get',
        'profile:find', 'profile:get',
        'student:find', 'student:get',
        'studentWorkspace:find', 'studentWorkspace:get',
        'education:find', 'education:get',
        'work:find', 'work:get',
        'skill:find', 'skill:get',
        'project:find', 'project:get',
        'classRoom:find', 'classRoom:get',
        'group:find', 'group:get',
        'studentClass:find', 'studentClass:get',
        'studentGroup:find', 'studentGroup:get',
        'post:find', 'post:get',
        'postAttachment:find', 'postAttachment:get',
        'event:find', 'event:get',
        'courseCategory:find', 'courseCategory:get',
        'course:find', 'course:get',
        'section:find', 'section:get',
        'lecture:find', 'lecture:get',
        'article:find', 'article:get',
        'reaction:find', 'reaction:get',
        'comment:find', 'comment:get',
        'subComment:find', 'subComment:get',
        'commentAttachment:find', 'commentAttachment:get',
        'message:find', 'message:get',
        'chatFileStorage:find', 'chatFileStorage:get',
        'propertyUser:find', 'propertyUser:get',
        'workspace:find', 'workspace:get',
        'board:find', 'board:get',
        'list:find', 'list:get',
        'card:find', 'card:get',
        'cardMember:find', 'cardMember:get',
        'label:find', 'label:get',
        'checklist:find', 'checklist:get',
        'listChecklist:find', 'listChecklist:get',
        'attachment:find', 'attachment:get',
        'quiz:find', 'quiz:get',
        'question:find', 'question:get',
        'option:find', 'option:get',
        'answer:find', 'answer:get',
        'review:find', 'review:get',
        'checkInRoomMessage:find', 'checkInRoomMessage:get',
        'checkInRoom:find', 'checkInRoom:get',
        'folder:find', 'folder:get',
        'file:find', 'file:get'
    ],
}
module.exports = {
    permissions
}
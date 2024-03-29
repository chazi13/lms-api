let externalPermission = null
try {
    const appRoot = require('app-root-path');

    const root = appRoot.toString();
    const split = root.split('/');
    split.pop();
    const path = split.join('/');
    externalPermission = require(path + '/hooks/user');
} catch (e) {

}
const defaultPermissions = {
    admin: ['admin:*'],
    authenticated: [
        'user:find', 'user:get', 'user:patch',
        'pushNotification:create', 'pushNotification:remove',
        'user:find', 'user:get', 'user:create', 'user:removeOwn', 'user:patchOwn',
        'student:find', 'student:get', 'student:create', 'student:removeOwn', 'student:patchOwn',
        'profile:find', 'profile:get', 'profile:create', 'profile:removeOwn', 'profile:patchOwn',
        'education:find', 'education:get', 'education:create', 'education:removeOwn', 'education:patchOwn',
        'work:find', 'work:get', 'work:create', 'work:removeOwn', 'work:patchOwn',
        'skill:find', 'skill:get', 'skill:create', 'skill:removeOwn', 'skill:patchOwn',
        'project:find', 'project:get', 'project:create', 'project:removeOwn', 'project:patchOwn',
        'space:find', 'space:get', 'space:create', 'space:removeOwn', 'space:patchOwn',
        'menu:find', 'menu:get', 'menu:create', 'menu:removeOwn', 'menu:patchOwn',
        'spaceMenu:find', 'spaceMenu:get', 'spaceMenu:create', 'spaceMenu:removeOwn', 'spaceMenu:patchOwn',
        'courseCategory:find', 'courseCategory:get', 'courseCategory:create', 'courseCategory:removeOwn', 'courseCategory:patchOwn',
        'course:find', 'course:get', 'course:create', 'course:removeOwn', 'course:patchOwn',
        'section:find', 'section:get', 'section:create', 'section:removeOwn', 'section:patchOwn',
        'lecture:find', 'lecture:get', 'lecture:create', 'lecture:removeOwn', 'lecture:patchOwn',
        'article:find', 'article:get', 'article:create', 'article:removeOwn', 'article:patchOwn',
        'quiz:find', 'quiz:get', 'quiz:create', 'quiz:removeOwn', 'quiz:patchOwn',
        'question:find', 'question:get', 'question:create', 'question:removeOwn', 'question:patchOwn',
        'option:find', 'option:get', 'option:create', 'option:removeOwn', 'option:patchOwn',
        'answer:find', 'answer:get', 'answer:create', 'answer:removeOwn', 'answer:patchOwn',
        'review:find', 'review:get', 'review:create', 'review:removeOwn', 'review:patchOwn',
        'folder:find', 'folder:get', 'folder:create', 'folder:removeOwn', 'folder:patchOwn',
        'userFile:find', 'userFile:get', 'userFile:create', 'userFile:removeOwn', 'userFile:patchOwn',
        'event:find', 'event:get', 'event:create', 'event:removeOwn', 'event:patchOwn',
        'checkInRoom:find', 'checkInRoom:get', 'checkInRoom:create', 'checkInRoom:removeOwn', 'checkInRoom:patchOwn',
        'message:find', 'message:get', 'message:create', 'message:removeOwn', 'message:patchOwn',
        'chatFileStorage:find', 'chatFileStorage:get', 'chatFileStorage:create', 'chatFileStorage:removeOwn', 'chatFileStorage:patchOwn',
        'post:find', 'post:get', 'post:create', 'post:removeOwn', 'post:patchOwn',
        'postAttachment:find', 'postAttachment:get', 'postAttachment:create', 'postAttachment:removeOwn', 'postAttachment:patchOwn',
        'reaction:find', 'reaction:get', 'reaction:create', 'reaction:removeOwn', 'reaction:patchOwn',
        'workspace:find', 'workspace:get', 'workspace:create', 'workspace:removeOwn', 'workspace:patchOwn',
        'board:find', 'board:get', 'board:create', 'board:removeOwn', 'board:patchOwn',
        'list:find', 'list:get', 'list:create', 'list:removeOwn', 'list:patchOwn',
        'card:find', 'card:get', 'card:create', 'card:removeOwn', 'card:patchOwn',
        'label:find', 'label:get', 'label:create', 'label:removeOwn', 'label:patchOwn',
        'checklist:find', 'checklist:get', 'checklist:create', 'checklist:removeOwn', 'checklist:patchOwn',
        'listChecklist:find', 'listChecklist:get', 'listChecklist:create', 'listChecklist:removeOwn', 'listChecklist:patchOwn',
        'comment:find', 'comment:get', 'comment:create', 'comment:removeOwn', 'comment:patchOwn',
        'subComment:find', 'subComment:get', 'subComment:create', 'subComment:removeOwn', 'subComment:patchOwn',
        'commentAttachment:find', 'commentAttachment:get', 'commentAttachment:create', 'commentAttachment:removeOwn', 'commentAttachment:patchOwn',
        'attachment:find', 'attachment:get', 'attachment:create', 'attachment:removeOwn', 'attachment:patchOwn'
    ],

    public: [

        'user:find', 'user:get',
        'student:find', 'student:get',
        'profile:find', 'profile:get',
        'education:find', 'education:get',
        'work:find', 'work:get',
        'skill:find', 'skill:get',
        'project:find', 'project:get',
        'space:find', 'space:get',
        'menu:find', 'menu:get',
        'spaceMenu:find', 'spaceMenu:get',
        'courseCategory:find', 'courseCategory:get',
        'course:find', 'course:get',
        'section:find', 'section:get',
        'lecture:find', 'lecture:get',
        'article:find', 'article:get',
        'quiz:find', 'quiz:get',
        'question:find', 'question:get',
        'option:find', 'option:get',
        'answer:find', 'answer:get',
        'review:find', 'review:get',
        'folder:find', 'folder:get',
        'userFile:find', 'userFile:get',
        'event:find', 'event:get',
        'checkInRoom:find', 'checkInRoom:get',
        'message:find', 'message:get',
        'chatFileStorage:find', 'chatFileStorage:get',
        'post:find', 'post:get',
        'postAttachment:find', 'postAttachment:get',
        'reaction:find', 'reaction:get',
        'workspace:find', 'workspace:get',
        'board:find', 'board:get',
        'list:find', 'list:get',
        'card:find', 'card:get',
        'label:find', 'label:get',
        'checklist:find', 'checklist:get',
        'listChecklist:find', 'listChecklist:get',
        'comment:find', 'comment:get',
        'subComment:find', 'subComment:get',
        'commentAttachment:find', 'commentAttachment:get',
        'attachment:find', 'attachment:get'
    ],
}

const permissions = externalPermission && externalPermission().permissions || defaultPermissions
module.exports = {
    permissions,
    defaultPermissions
}
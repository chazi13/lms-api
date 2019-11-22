module.exports = {
    "workspace": {
        "local": "workspaceId",
        "relatedTo": "workspace",
        "foreignId": "id",
        "type": "one"
    },
    "user": {
        "local": "usersId",
        "relatedTo": "User",
        "foreignId": "id",
        "type": "one"
    }
}
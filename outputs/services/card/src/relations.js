module.exports = {
    "list": {
        "local": "listId",
        "relatedTo": "list",
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
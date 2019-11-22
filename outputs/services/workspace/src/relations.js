module.exports = {
    "user": {
        "local": "usersId",
        "relatedTo": "User",
        "foreignId": "id",
        "type": "one"
    },
    "space": {
        "local": "spaceId",
        "relatedTo": "space",
        "foreignId": "id",
        "type": "one"
    }
}
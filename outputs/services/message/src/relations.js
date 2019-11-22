module.exports = {
    "user": {
        "local": "userId",
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
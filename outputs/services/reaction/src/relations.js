module.exports = {
    "post": {
        "local": "postId",
        "relatedTo": "post",
        "foreignId": "id",
        "type": "one"
    },
    "user": {
        "local": "userId",
        "relatedTo": "User",
        "foreignId": "id",
        "type": "one"
    }
}
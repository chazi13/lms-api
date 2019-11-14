module.exports = {
    "user": {
        "local": "userId",
        "relatedTo": "User",
        "foreignId": "id",
        "type": "one"
    },
    "question": {
        "local": "questionId",
        "relatedTo": "question",
        "foreignId": "id",
        "type": "one"
    }
}
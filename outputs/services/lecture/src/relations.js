module.exports = {
    "article": {
        "local": "articleId",
        "relatedTo": "article",
        "foreignId": "id",
        "type": "one"
    },
    "quiz": {
        "local": "quizId",
        "relatedTo": "quiz",
        "foreignId": "id",
        "type": "one"
    },
    "board": {
        "local": "taskId",
        "relatedTo": "board",
        "foreignId": "id",
        "type": "one"
    }
}
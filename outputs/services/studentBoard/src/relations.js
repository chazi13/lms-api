module.exports = {
    "student": {
        "local": "studentId",
        "relatedTo": "student",
        "foreignId": "id",
        "type": "one"
    },
    "board": {
        "local": "boardId",
        "relatedTo": "board",
        "foreignId": "id",
        "type": "one"
    }
}
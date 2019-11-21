module.exports = {
    "student": {
        "local": "studentId",
        "relatedTo": "student",
        "foreignId": "id",
        "type": "one"
    },
    "card": {
        "local": "cardId",
        "relatedTo": "card",
        "foreignId": "id",
        "type": "one"
    }
}
module.exports = {
    "student": {
        "local": "studentId",
        "relatedTo": "student",
        "foreignId": "id",
        "type": "one"
    },
    "group": {
        "local": "groupId",
        "relatedTo": "group",
        "foreignId": "id",
        "type": "one"
    }
}
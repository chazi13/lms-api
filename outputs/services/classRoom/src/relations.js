module.exports = {
    "student": {
        "local": "studentsId",
        "relatedTo": "student",
        "foreignId": "id",
        "type": "manyToMany"
    },
    "group": {
        "local": "groupId",
        "relatedTo": "group",
        "foreignId": "id",
        "type": "one"
    }
}
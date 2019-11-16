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
    },
    "checkInRoom": {
        "local": "checkInRoomId",
        "relatedTo": "checkInRoom",
        "foreignId": "id",
        "type": "one"
    }
}
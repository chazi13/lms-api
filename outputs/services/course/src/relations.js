module.exports = {
    "courseCategory": {
        "local": "categoriesId",
        "relatedTo": "courseCategory",
        "foreignId": "id",
        "type": "manyToMany"
    },
    "classRoom": {
        "local": "classRoomId",
        "relatedTo": "classRoom",
        "foreignId": "id",
        "type": "one"
    }
}
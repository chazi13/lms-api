module.exports = {
    "user": {
        "local": "userId",
        "relatedTo": "User",
        "foreignId": "id",
        "type": "one"
    },
    "classRoom": {
        "local": "classRoomsId",
        "relatedTo": "classRoom",
        "foreignId": "id",
        "type": "manyToMany"
    }
}
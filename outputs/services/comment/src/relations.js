module.exports = {
    "post": {
        "local": "postId",
        "relatedTo": "post",
        "foreignId": "id",
        "type": "one"
    },
    "checkInRoom": {
        "local": "checkInRoomId",
        "relatedTo": "checkInRoom",
        "foreignId": "id",
        "type": "one"
    },
    "lecture": {
        "local": "lectureId",
        "relatedTo": "lecture",
        "foreignId": "id",
        "type": "one"
    }
}
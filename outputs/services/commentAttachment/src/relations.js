module.exports = {
    "comment": {
        "local": "commentId",
        "relatedTo": "comment",
        "foreignId": "id",
        "type": "one"
    },
    "subComment": {
        "local": "subCommentId",
        "relatedTo": "subComment",
        "foreignId": "id",
        "type": "one"
    }
}
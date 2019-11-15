module.exports = {
    "course": {
        "local": "courseId",
        "relatedTo": "course",
        "foreignId": "id",
        "type": "one"
    },
    "lecture": {
        "local": "lecturesId",
        "relatedTo": "lecture",
        "foreignId": "id",
        "type": "manyToMany"
    }
}
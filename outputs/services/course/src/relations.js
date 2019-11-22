module.exports = {
    "courseCategory": {
        "local": "categoriesId",
        "relatedTo": "courseCategory",
        "foreignId": "id",
        "type": "manyToMany"
    },
    "space": {
        "local": "spaceId",
        "relatedTo": "space",
        "foreignId": "id",
        "type": "one"
    }
}
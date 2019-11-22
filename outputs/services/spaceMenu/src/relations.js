module.exports = {
    "space": {
        "local": "spaceId",
        "relatedTo": "space",
        "foreignId": "id",
        "type": "one"
    },
    "menu": {
        "local": "menusId",
        "relatedTo": "menu",
        "foreignId": "id",
        "type": "manyToMany"
    }
}
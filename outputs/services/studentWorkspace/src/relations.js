module.exports = {
    "student": {
        "local": "studentId",
        "relatedTo": "student",
        "foreignId": "id",
        "type": "one"
    },
    "workspace": {
        "local": "workspaceId",
        "relatedTo": "workspace",
        "foreignId": "id",
        "type": "one"
    }
}
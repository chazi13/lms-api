module.exports = function(app) {
    const mongooseVirtuals = require('mongoose-lean-virtuals');
    const mongooseClient = app.get('mongooseClient');
    const uniqueValidator = require('mongoose-unique-validator');
    const model = new mongooseClient.Schema({
        name: { type: String, required: false, unique: false },
        type: { type: String, required: false, unique: false },
        embedLink: { type: String, required: false, unique: false },
        url: { type: String, required: false, unique: false },
        folderId: { type: String, required: false },
        classRoomId: { type: String, required: false },
        createdBy: String,
        updatedBy: String
    }, {
        timestamps: true
    })
    model.virtual('id').get(function() {
        return this._id
    })
    model.set('toObject', { virtuals: true })
    model.set('toJSON', { virtuals: true })
    model.plugin(mongooseVirtuals)
    model.plugin(uniqueValidator)
    return mongooseClient.model("files", model)
}
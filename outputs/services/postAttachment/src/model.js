module.exports = function(app) {
    const mongooseVirtuals = require('mongoose-lean-virtuals');
    const mongooseClient = app.get('mongooseClient');
    const uniqueValidator = require('mongoose-unique-validator');
    const model = new mongooseClient.Schema({
        postId: { type: String, required: false },
        name: { type: String, required: true, unique: false },
        url: { type: String, required: true, unique: false },
        type: { type: String, required: false, unique: false },
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
    return mongooseClient.model("postAttachments", model)
}
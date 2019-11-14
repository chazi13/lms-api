module.exports = function(app) {
    const mongooseVirtuals = require('mongoose-lean-virtuals');
    const mongooseClient = app.get('mongooseClient');
    const uniqueValidator = require('mongoose-unique-validator');
    const model = new mongooseClient.Schema({
        text: { type: String, required: false, unique: false },
        MessageType: { type: String, required: false, unique: false },
        userId: { type: String, required: false },
        parentMessage: { type: String, required: false, default: false, unique: false },
        isDeleted: { type: Boolean, required: false, default: false, unique: false },
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
    return mongooseClient.model("messages", model)
}
module.exports = function(app) {
    const mongooseVirtuals = require('mongoose-lean-virtuals');
    const mongooseClient = app.get('mongooseClient');
    const uniqueValidator = require('mongoose-unique-validator');
    const model = new mongooseClient.Schema({
        name: { type: String, required: true, unique: false },
        background: { type: String, required: true, unique: false },
        workspaceId: { type: String, required: false },
        visible: { type: String, required: false, unique: false },
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
    return mongooseClient.model("boards", model)
}
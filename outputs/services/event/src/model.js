module.exports = function(app) {
    const mongooseVirtuals = require('mongoose-lean-virtuals');
    const mongooseClient = app.get('mongooseClient');
    const uniqueValidator = require('mongoose-unique-validator');
    const model = new mongooseClient.Schema({
        title: { type: String, required: true, unique: false },
        start: { type: Date, required: true, unique: false },
        end: { type: Date, required: false, unique: false },
        allDay: { type: Boolean, required: false, unique: false },
        description: { type: String, required: false, unique: false },
        spaceId: { type: String, required: false },
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
    return mongooseClient.model("events", model)
}
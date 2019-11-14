module.exports = function(app) {
    const mongooseVirtuals = require('mongoose-lean-virtuals');
    const mongooseClient = app.get('mongooseClient');
    const uniqueValidator = require('mongoose-unique-validator');
    const model = new mongooseClient.Schema({
        school: { type: String, required: true, unique: false },
        degree: { type: String, required: true, unique: false },
        study: { type: String, required: true, unique: false },
        yearStart: { type: Number, required: true, unique: false },
        yearEnd: { type: Number, required: false, unique: false },
        description: { type: String, required: false, unique: false },
        thumbnail: { type: String, required: false, unique: false },
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
    return mongooseClient.model("educations", model)
}
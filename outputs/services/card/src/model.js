module.exports = function(app) {
    const mongooseVirtuals = require('mongoose-lean-virtuals');
    const mongooseClient = app.get('mongooseClient');
    const uniqueValidator = require('mongoose-unique-validator');
    const model = new mongooseClient.Schema({
        listId: { type: String, required: false },
        name: { type: String, required: true, unique: false },
        image: { type: String, required: false, unique: false },
        duedate: { type: String, required: false, unique: false },
        index: { type: Number, required: false, unique: false },
        description: { type: String, required: false, unique: false },
        visible: { type: Boolean, required: false, unique: false },
        usersId: { type: String, required: false },
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
    return mongooseClient.model("cards", model)
}
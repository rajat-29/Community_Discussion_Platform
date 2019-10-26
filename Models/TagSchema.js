var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var tagSchema = new mongoose.Schema({
    tags: String,
    createdBy: String,
    createDate: String,
})

module.exports = mongoose.model('tags', tagSchema)
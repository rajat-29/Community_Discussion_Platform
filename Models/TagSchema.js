var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var tagSchema = new mongoose.Schema({
    tags: {
    	type: String,
    },
    createdBy: {
    	type: String,
    },
    createDate: {
    	type: String,
    },
})

module.exports = mongoose.model('tags', tagSchema)
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var discussionSchema = new mongoose.Schema({
    title: {
    	type: String,
    },
    details: {
    	type: String,
    },
    tag: {
    	type: String,
    },
    communityName: {
    	type: String,
    },
    createdBy: {
    	type: String,
    },
    createdDate: {
    	type: String,
    },
    ownerId: {
    	type: String,
    },
    communityId: {
    	type: String,
    },
})

module.exports = mongoose.model('discussiones', discussionSchema)
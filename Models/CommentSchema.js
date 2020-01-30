var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var commentSchema = new mongoose.Schema({
    comment: {
    	type: String,
    },    
    discussionId: {
    	type: String,
    },
    commentedBy: {
    	type: String,
    },
    ownerId: {
    	type: String,
    },
    communityId: {
    	type: String,
    },
    createdDate: {
    	type: String,
    },
    photoname : {
    	type: String,
    },
})

module.exports = mongoose.model('commentes', commentSchema)
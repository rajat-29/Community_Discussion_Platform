var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var replySchema = new mongoose.Schema({
    reply: {
    	type: String,
    },    
    commentId: {
    	type: String,
    },
    discussionId: {
    	type: String,
    },
    repliedBy: {
    	type: String,
    },
    ownerId: {
    	type: String,
    },
    createdDate: {
    	type: String,
    },
    photoname : {
    	type: String,
    },
})

module.exports = mongoose.model('replyes', replySchema)
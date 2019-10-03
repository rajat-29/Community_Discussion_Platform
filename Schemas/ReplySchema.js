var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var replySchema = new mongoose.Schema({
    reply: String,    
    commentId: String,
    discussionId: String,
    repliedBy: String,
    ownerId: String,
    createdDate: String,
})

module.exports = mongoose.model('replyes', replySchema)
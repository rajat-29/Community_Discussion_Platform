var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var replySchema = new mongoose.Schema({
    reply: String,    
    commentId: String,
    repliedBy: String,
    ownerId: String,
})

module.exports = mongoose.model('replyes', replySchema)
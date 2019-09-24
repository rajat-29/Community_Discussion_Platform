var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var commentSchema = new mongoose.Schema({
    comment: String,    
    discussionId: String,
    commentedBy: String,
    ownerId: String,
    communityId: String,
})

module.exports = mongoose.model('commentes', commentSchema)
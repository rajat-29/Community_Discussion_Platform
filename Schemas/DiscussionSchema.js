var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var discussionSchema = new mongoose.Schema({
    title: String,
    details: String,
    tag: String,
    communityName: String,
    createdBy: String,
    createdDate: String,
    ownerId: String,
    communityId: String,
})

module.exports = mongoose.model('discussiones', discussionSchema)
var users = require('../Models/UserSchema');

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var communitySchema = new mongoose.Schema({
    name: String,
    rule: String,
    location: String,
    email: String,
    owner: String,
    createDate: String,
    status: String,
    desc: String,
    commphoto: String,
    ownerId : String,
    memberno: String,
    commuser: [{'type': mongoose.Schema.Types.ObjectId , 'ref':users}],
    commasktojoin: [{'type': mongoose.Schema.Types.ObjectId , 'ref':users}],
    commManagers: [{'type': mongoose.Schema.Types.ObjectId , 'ref':users}],
    invited: [{'type': mongoose.Schema.Types.ObjectId , 'ref':users}],
})

module.exports =  mongoose.model('communities', communitySchema);
var users = require('../Models/UserSchema');

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var communitySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    rule: {
        type: String,
    },
    location: {
        type: String,
    },
    email: {
        type: String,
    },
    owner: {
        String,
    },
    createDate: {
        type: String,
    },
    status: {
        type: String,
    },
    desc: {
        type: String,
    },
    commphoto: {
        type: String,
    },
    ownerId : {
        type: String,
    },
    memberno: {
        type: String,
    },
    commuser: [{'type': mongoose.Schema.Types.ObjectId , 'ref':users}],
    commasktojoin: [{'type': mongoose.Schema.Types.ObjectId , 'ref':users}],
    commManagers: [{'type': mongoose.Schema.Types.ObjectId , 'ref':users}],
    invited: [{'type': mongoose.Schema.Types.ObjectId , 'ref':users}],
})

module.exports =  mongoose.model('communities', communitySchema);
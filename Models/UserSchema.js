var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var userSchema = new Schema({					/*define structure of database*/
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    phone: {
        type: String,
    },
    city: {
        type: String,
    },
    gender: {
        type: String,
    },
    dob: {
        type: String,
    },
    role: {
        type: String,
    },   
    status: {
        type: String,
    },
    flag: {
        type: Number,
    }, 
    interest: {
        type: String,
    },
    bitmore: {
        type: String,
    },
    expectation: {
        type: String,
    },
    photoname: {
        type: String,
    },
    owned: Array,
    joinedComm: Array,
    asktojoincomm: Array,
    commManagers: Array,
    invited: [{'type': mongoose.Schema.Types.ObjectId}],

})

module.exports =  mongoose.model('usernames', userSchema);
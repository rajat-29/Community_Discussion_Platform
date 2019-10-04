var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var userSchema = new Schema({					/*define structure of database*/
    name: String,
    email: String,
    password: String,
    phone: String,
    city: String,
    gender: String,
    dob: String,
    role: String,   
    status: String,
    flag: Number, 
    interest: String,
    bitmore: String,
    expectation: String,
    photoname: String,
    owned: Array,
    joinedComm: Array,
    asktojoincomm: Array,
    commManagers: Array,
    invited: [{'type': mongoose.Schema.Types.ObjectId}],

})

module.exports = mongoose.model('usernames', userSchema)
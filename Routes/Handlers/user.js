let express = require('express');
var app = require('express').Router();
let path = require('path');

app.use(express.static(path.join(__dirname,'../../public')));
app.use(express.static(path.join(__dirname,'public/uploads')));

var auth=require('../../MiddleWares/auth');

let userController = require('../../Controllers/user'); 

app.get('/newUserProfileDetails',auth, function(req,res) {
      res.render('newUserProfileDetails', {data: req.session.data});
})

app.get('/joinedCommunities',auth, function(req,res){
   res.render('joinedCommunities', {data: req.session.data});
})


// controllers //

app.use('/updateeditUserDob',auth,userController.updateeditUserDob);

module.exports = app;
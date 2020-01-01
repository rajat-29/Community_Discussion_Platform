let express = require('express');
var app = require('express').Router();
let path = require('path');

app.use(express.static(path.join(__dirname,'../public')));
app.use(express.static(path.join(__dirname,'public/uploads')));

var auth=require('../MiddleWares/auth');

let userController = require('../Controllers/user');

app.get('/newUsereditProfile',auth, function(req,res) {
      res.render('newUsereditProfile', {data: req.session.data});
}) 

app.get('/newUserProfileDetails',auth, function(req,res) {
      res.render('newUserProfileDetails', {data: req.session.data});
})

app.get('/openCommunityPage',auth, function(req,res){
      if(req.session.data.role == 'User' )
      {
         res.render('newUserCommunityPage', {data: req.session.data});
      } 
      else if(req.session.data.role == 'Community Manager' )
      {
         res.render('communityUserCommunityPage', {data: req.session.data});
      }
      else if(req.session.data.role == 'superAdmin' )
      {
         res.render('newUserCommunityPage', {data: req.session.data});
      }
})

app.get('/newUserchangePassword',auth, function(req,res) {
      res.render('newUserchangePassword', {data: req.session.data});
})

// controllers //

app.use('/updateeditUserDetails',userController.updateeditUserDetails);

app.use('/updateeditUserDob',userController.updateeditUserDob);

app.use('/upload',userController.upload);

app.use('/Userupload',userController.Userupload);

module.exports = app;
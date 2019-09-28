let express = require('express');
var app = require('express').Router();
let path = require('path');

app.use(express.static(path.join(__dirname,'../public')));
app.use(express.static(path.join(__dirname,'public/uploads')));

var mongoose = require('mongoose')

var users = require('../Schemas/UserSchema');
var t = require('../Schemas/TagSchema');
var community = mongoose.model('communities');

function sessionCheck(req,res,next)
{
  if(req.session.isLogin)
  {
    next();
  }
  else {
    res.redirect('/');
  }
}

// community pages //
app.get('/openCommunityPage',sessionCheck, function(req,res){
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

// change password page
app.get('/newUserchangePassword',sessionCheck, function(req,res) {
      res.render('newUserchangePassword', {data: req.session.data});
})

// new user profile //
// render user edit button profile page //
app.get('/newUsereditProfile',sessionCheck, function(req,res) {
      res.render('newUsereditProfile', {data: req.session.data});
})  

// profile details page
app.get('/newUserProfileDetails',sessionCheck, function(req,res) {
      res.render('newUserProfileDetails', {data: req.session.data});
})

// logout the user and admin //
app.get('/yes', function(req,res) {
    req.session.isLogin = 0;
    req.session.destroy();
    res.render('index');
})



module.exports = app;
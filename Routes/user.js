let express = require('express');
var app = require('express').Router();
let path = require('path');

app.use(express.static(path.join(__dirname,'../public')));
app.use(express.static(path.join(__dirname,'public/uploads')));

var mongoose = require('mongoose')

var users = require('../Models/UserSchema');
var t = require('../Models/TagSchema');
var community = require('../Models/communitySchema');

var auth=require('../MiddleWares/auth');
var multer = require('../MiddleWares/multer');

// community pages //
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

// change password page
app.get('/newUserchangePassword',auth, function(req,res) {
      res.render('newUserchangePassword', {data: req.session.data});
})

// new user profile //
// render user edit button profile page //
app.get('/newUsereditProfile',auth, function(req,res) {
      res.render('newUsereditProfile', {data: req.session.data});
})  

// profile details page
app.get('/newUserProfileDetails',auth, function(req,res) {
      res.render('newUserProfileDetails', {data: req.session.data});
})

// logout the user and admin //
app.get('/yes', function(req,res) {
    req.session.isLogin = 0;
    req.session.destroy();
    res.render('index');
})

// update normal user details
app.post('/updateeditUserDetails', auth,function(req,res) {
        users.updateOne( { "email" : req.session.email}, {$set : req.body } , function(err,result)
        {
          if(err)
          throw err
          else {
           req.session.data.name = req.body.name;
           req.session.data.email = req.body.email;         
           req.session.data.city = req.body.city;
           req.session.data.phone = req.body.phone;
           req.session.data.gender = req.body.gender;
           req.session.data.interest = req.body.interest;
           req.session.data.bitmore = req.body.bitmore;
           req.session.data.expectation = req.body.expectation;
           req.session.data.photoname = req.body.photoname;
            res.send("DATA UPDATED SUCCESFULLY")
          }
        })
})

// update new user details
app.post('/updateeditUserDob',auth, function(req,res) {
        users.updateOne( { "email" : req.session.email}, {$set : req.body } , function(err,result)
        {
          if(err)
          throw err
          else {
            req.session.data.dob = req.body.dob;
            req.session.data.name = req.body.name;
           req.session.data.email = req.body.email;         
           req.session.data.city = req.body.city;
           req.session.data.phone = req.body.phone;
           req.session.data.gender = req.body.gender;
           req.session.data.interest = req.body.interest;
           req.session.data.bitmore = req.body.bitmore;
           req.session.data.expectation = req.body.expectation;
            req.session.data.photoname = req.body.photoname;
            res.send("DATA UPDATED SUCCESFULLY")
          }
        })
})

app.post('/upload',(req,res)=>{
    multer.upload(req, res, (err) => {
        if (err){ 
            res.send({ 'msg': err})
        }else{
            res.render('editUserDetails', {data: req.session.data});  
        }
    })
})

// upload user image //
app.post('/Userupload',(req,res) => {
      multer.upload(req,res,(err)=>{
        if(err) {
           res.send({ 'msg': err})
        } else { 
          res.render('newUserProfileDetails', {data: req.session.data});         
        }
      })
});

module.exports = app;
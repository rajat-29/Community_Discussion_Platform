let express = require('express');
var app = require('express').Router();
let path = require('path');

app.use(express.static(path.join(__dirname,'../../public')));

var auth=require('../../MiddleWares/auth');

let adminController = require('../../Controllers/admin');

app.get('/add_user',auth,function(req,res){
  		res.render('add_user', {data: req.session.data});
})

app.get('/manage_users',auth,function(req,res){  
      res.render('manage_users', {data: req.session.data});
})

app.get('/manage_community',auth,function(req,res){  
      res.render('manage_community', {data: req.session.data});
})

app.get('/switchUserPage',function(req,res) {
         res.render('editUserProfile', {data: req.session.data});
})

app.get('/switchAdminPage',function(req,res) {
         res.render('editUserProfile', {data: req.session.data});
})

app.get('/create_tag',auth,function(req,res){ 
      res.render('create_tag',{data: req.session.data});
})

app.get('/listuserstags',auth,function(req,res) {
      res.render('Listtags', {data: req.session.data});
})

app.get('/changePassword',auth,function(req,res){ 
      res.render('changePassword', {data: req.session.data});
})

app.get('/editUserProfile', auth,function(req,res) {
      res.render('editUserProfile', {data: req.session.data});
})

app.get('/editUserDetails', auth,function(req,res) {
      res.render('editUserDetails', {data: req.session.data});
}) 

// controllers //

app.use('/addnewuser',auth,adminController.addnewuser);

app.use('/listusers',auth,adminController.listusers);

app.use('/updateuserdetails',auth,adminController.updateuserdetails);

app.use('/deativateuserdata',auth,adminController.deativateuserdata);

app.use('/reativateuserdata',auth,adminController.reativateuserdata);

app.use('/listcommunity',auth,adminController.listcommunity);

app.use('/updatecommunitydetails',auth,adminController.updatecommunitydetails);

app.use('/switchasuser',auth,adminController.switchasuser);

app.use('/switchasadmin',auth,adminController.switchasadmin);

app.use('/checktag',auth,adminController.checktag);

app.use('/addtagtobase',auth,adminController.addtagtobase);

app.use('/showtags',auth,adminController.showtags);

app.use('/deleteTag/:pro',auth,adminController.deleteTag);

app.use('/changePassword',auth,adminController.changePassword);

app.use('/categoryOptions',auth,adminController.categoryOptions);

app.use('/checkemail',auth,adminController.checkemail);

module.exports = app;
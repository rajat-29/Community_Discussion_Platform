let express = require('express');
var app = require('express').Router();
let path = require('path');

app.use(express.static(path.join(__dirname,'../../public')));

var auth=require('../../MiddleWares/auth');

let adminController = require('../../Controllers/admin');

app.get('/add_user',auth.checkAdmin,function(req,res){
  		res.render('add_user', {data: req.session.data,title : 'Add User'});
})

app.get('/manage_users',auth.checkAdmin,function(req,res){  
      res.render('manage_users', {data: req.session.data,title : 'Manage User'});
})

app.get('/manage_community',auth.checkAdmin,function(req,res){  
      res.render('manage_community', {data: req.session.data,title : 'Manage Community'});
})

app.get('/create_tag',auth.checkAdmin,function(req,res){ 
      res.render('create_tag',{data: req.session.data,title : 'Create Tags'});
})

app.get('/manage_tags',auth.checkAdmin,function(req,res) {
      res.render('manage_tags', {data: req.session.data,title : 'Manage Tags'});
})

// controllers //

app.use('/addnewuser',auth.checkAdmin,adminController.addnewuser);

app.use('/listusers',auth.checkAdmin,adminController.listusers);

app.use('/updateuserdetails',auth.checkAdmin,adminController.updateuserdetails);

app.use('/deativateuserdata',auth.checkAdmin,adminController.deativateuserdata);

app.use('/reativateuserdata',auth.checkAdmin,adminController.reativateuserdata);

app.use('/listcommunity',auth.checkAdmin,adminController.listcommunity);

app.use('/updatecommunitydetails',auth.checkAdmin,adminController.updatecommunitydetails);

app.use('/switchasuser',auth.checkSession,adminController.switchasuser);

app.use('/switchasadmin',auth.checkSession,adminController.switchasadmin);

app.use('/checktag',auth.checkAdmin,adminController.checktag);

app.use('/addtagtobase',auth.checkAdmin,adminController.addtagtobase);

app.use('/showtags',auth.checkAdmin,adminController.showtags);

app.use('/deleteTag/:pro',auth.checkAdmin,adminController.deleteTag);

app.use('/categoryOptions',auth.checkAdmin,adminController.categoryOptions);

app.use('/checkemail',auth.checkAdmin,adminController.checkemail);

module.exports = app;
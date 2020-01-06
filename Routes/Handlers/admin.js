let express = require('express');
var app = require('express').Router();
let path = require('path');

app.use(express.static(path.join(__dirname,'../../public')));

var auth=require('../../MiddleWares/adminauth');

let adminController = require('../../Controllers/admin');

app.get('/addusers',auth,function(req,res){
  		res.render('adduser', {data: req.session.data});
})

app.get('/listusers',auth,function(req,res){  
      res.render('listusers', {data: req.session.data});
})

app.get('/communityList',auth,function(req,res){  
      res.render('communityList', {data: req.session.data});
})

app.get('/switchUserPage',auth,function(req,res) {
         res.render('editUserProfile', {data: req.session.data});
})

app.get('/switchAdminPage',auth,function(req,res) {
         res.render('editUserProfile', {data: req.session.data});
})

app.get('/userestag',auth,function(req,res){ 
      res.render('Tags',{data: req.session.data});
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

app.use('/addnewuser',adminController.addnewuser);

app.use('/listusers',adminController.listusers);

app.use('/updateuserdetails',adminController.updateuserdetails);

app.use('/deativateuserdata',adminController.deativateuserdata);

app.use('/reativateuserdata',adminController.reativateuserdata);

app.use('/listcommunity',adminController.listcommunity);

app.use('/updatecommunitydetails',adminController.updatecommunitydetails);

app.use('/switchasuser',adminController.switchasuser);

app.use('/switchasadmin',adminController.switchasadmin);

app.use('/checktag',adminController.checktag);

app.use('/addtagtobase',adminController.addtagtobase);

app.use('/showtags',adminController.showtags);

app.use('/deleteTag/:pro',adminController.deleteTag);

app.use('/changePassword',adminController.changePassword);

app.use('/categoryOptions',adminController.categoryOptions);

app.use('/checkemail',adminController.checkemail);

module.exports = app;
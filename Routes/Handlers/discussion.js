let express = require('express');
var app = require('express').Router();
let path = require('path');

app.use(express.static(path.join(__dirname,'../../public')));
app.use(express.static(path.join(__dirname,'public/uploads')));

var auth=require('../../MiddleWares/auth');

let discussionController = require('../../Controllers/discussion');

// controllers //

app.use('/addnewDiscussion',auth.checkSession,discussionController.addnewDiscussion);

app.use('/getDiscussion',auth.checkSession,discussionController.getDiscussion);

app.use('/getComments',auth.checkSession,discussionController.getComments);

app.use('/getReplys',auth.checkSession,discussionController.getReplys);

app.use('/discussionOwner/:pros',auth.checkSession,discussionController.discussionOwner);

app.use('/deleteDiscussion/:pros',auth.checkSession,discussionController.deleteDiscussion);

app.use('/deleteComment/:pros',auth.checkSession,discussionController.deleteComment);

module.exports = app;
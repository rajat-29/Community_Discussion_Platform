let express = require('express');
var app = require('express').Router();
let path = require('path');

app.use(express.static(path.join(__dirname,'../../public')));
app.use(express.static(path.join(__dirname,'public/uploads')));

var auth=require('../../MiddleWares/auth');

let discussionController = require('../../Controllers/discussion');

// controllers //

app.use('/addnewDiscussion',auth,discussionController.addnewDiscussion);

app.use('/getDiscussion',auth,discussionController.getDiscussion);

app.use('/getComments',auth,discussionController.getComments);

app.use('/getReplys',auth,discussionController.getReplys);

app.use('/discussionOwner/:pros',auth,discussionController.discussionOwner);

app.use('/deleteDiscussion/:pros',auth,discussionController.deleteDiscussion);

app.use('/deleteComment/:pros',auth,discussionController.deleteComment);

module.exports = app;
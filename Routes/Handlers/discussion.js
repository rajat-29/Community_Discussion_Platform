let express = require('express');
var app = require('express').Router();
let path = require('path');

app.use(express.static(path.join(__dirname,'../../public')));
app.use(express.static(path.join(__dirname,'public/uploads')));

var auth=require('../../MiddleWares/auth');

let discussionController = require('../../Controllers/discussion');

// controllers //

app.use('/addnewDiscussion',discussionController.addnewDiscussion);

app.use('/getDiscussion',discussionController.getDiscussion);

app.use('/getComments',discussionController.getComments);

app.use('/getReplys',discussionController.getReplys);

app.use('/discussionOwner/:pros',discussionController.discussionOwner);

app.use('/deleteDiscussion/:pros',discussionController.deleteDiscussion);

app.use('/deleteComment/:pros',discussionController.deleteComment);

module.exports = app;
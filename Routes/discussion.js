let express = require('express');
var app = require('express').Router();
let path = require('path');
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static(path.join(__dirname,'../public')));
app.use(express.static(path.join(__dirname,'public/uploads')));

var mongoose = require('mongoose')

var users = require('../Models/UserSchema');
var discussion = require('../Models/DiscussionSchema');
var Comments = require('../Models/CommentSchema');
var Replies = require('../Models/ReplySchema');

var auth=require('../MiddleWares/auth');

/* create new discussion */
app.post('/addnewDiscussion',auth,function (req, res) {
      discussion.create(req.body,function(error,result)
      {
        if(error)
        throw error;
        else
        {}
      })
       res.send("data saved");
})

// fetch all community discussions
app.post('/getDiscussion',auth,function(req,res) {
    discussion.find({ "communityName" : req.body.communityName}).exec(function (err, result) {
     if (err) 
      return err;
    else {
      res.send(result)
    }
    })
})

// fetch all community discussions comments
app.post('/getComments',auth,function(req,res) {
    Comments.find({ "discussionId" : req.body.discussionId}).exec(function (err, result) {
     if (err) 
      return err;
    else {
      res.send(result)
    }
    })
})

// fetch all community discussions replies
app.post('/getReplys',auth,function(req,res) {
    Replies.find({ "commentId" : req.body.commentId}).exec(function (err, result) {
     if (err) 
      return err;
    else {
      res.send(result)
    }
    })
})

// discussion owner //
app.get('/discussionOwner/:pros',auth,function(req,res) {
      var id = req.params.pros.toString();
      users.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else {
              res.render('discussionOwnerInfo', {data: req.session.data,newdata:reses});
          }
      });
})

// delete discussions //
app.delete('/deleteDiscussion/:pros',auth,function(req,res) {
      var id = req.params.pros.toString();
      discussion.deleteOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else{}
      });

      Comments.deleteMany({ "discussionId": id },function(err,reses)
      {
          if(err)
          throw err;
          else{}
      });

      Replies.deleteMany({ "discussionId": id },function(err,reses)
      {
          if(err)
          throw err;
          else {
            res.send("data deleted SUCCESFULLY");
          }
      });
 })

// delete comments //
app.delete('/deleteComment/:pros',auth,function(req,res) {
      var id = req.params.pros.toString();
      Comments.deleteMany({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else{}
      });

      Replies.deleteMany({ "commentId": id },function(err,reses)
      {
          if(err)
          throw err;
          else {
            res.send("data deleted SUCCESFULLY");
          }
      });
 })

module.exports = app;
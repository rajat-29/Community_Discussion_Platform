let express = require('express');
var app = require('express').Router();
let path = require('path');

app.use(express.static(path.join(__dirname,'../public')));
app.use(express.static(path.join(__dirname,'public/uploads')));

var mongoose = require('mongoose')

var users = require('../Schemas/UserSchema');
var t = require('../Schemas/TagSchema');
var community = mongoose.model('communities');
var discussion = require('../Schemas/DiscussionSchema');
var Comments = require('../Schemas/CommentSchema');

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


/* create new discussion */
app.post('/addnewDiscussion',sessionCheck,function (req, res) {
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
app.post('/getDiscussion',sessionCheck,function(req,res) {
    discussion.find({ "communityName" : req.body.communityName}).exec(function (err, result) {
     if (err) 
      return err;
    else
    {
      res.send(result)
    }
    })
})

// fetch all community discussions comments
app.post('/getComments',sessionCheck,function(req,res) {
    Comments.find({ "discussionId" : req.body.discussionId}).exec(function (err, result) {
     if (err) 
      return err;
    else
    {
      res.send(result)
    }
    })
})

// discussion owner //
app.get('/discussionOwner/:pros',sessionCheck,function(req,res) {
      var id = req.params.pros.toString();
      users.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
              res.render('discussionOwnerInfo', {data: req.session.data,newdata:reses});
              //res.send("data deleted SUCCESFULLY")

          }
      });
})

// delete discussions //
app.delete('/deleteDiscussion/:pros',sessionCheck,function(req,res) {
      var id = req.params.pros.toString();
      discussion.deleteOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
            res.send("data deleted SUCCESFULLY");
          }
      });
 })


module.exports = app;
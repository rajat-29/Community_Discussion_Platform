var users = require('../Models/UserSchema');
var discussion = require('../Models/DiscussionSchema');
var Comments = require('../Models/CommentSchema');
var Replies = require('../Models/ReplySchema');

exports.addnewDiscussion = (req, res) => {
      discussion.create(req.body,function(error,result)
      {
        if(error)
        throw error;
        else
        {}
      })
       res.send("data saved");
}

exports.getDiscussion = (req,res) => {
    discussion.find({ "communityName" : req.body.communityName}).exec(function (err, result) {
     if (err) 
      return err;
    else {
      res.send(result)
    }
    })
}

exports.getComments = (req,res) => {
    Comments.find({ "discussionId" : req.body.discussionId}).exec(function (err, result) {
     if (err) 
      return err;
    else {
      res.send(result)
    }
    })
}

exports.getReplys = (req,res) => {
    Replies.find({ "commentId" : req.body.commentId}).exec(function (err, result) {
     if (err) 
      return err;
    else {
      res.send(result)
    }
    })
}

exports.discussionOwner = (req,res) => {
      var id = req.params.pros.toString();
      users.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else {
              res.render('discussionOwnerInfo', {data: req.session.data,newdata:reses});
          }
      });
}

exports.deleteDiscussion = (req,res) => {
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
 }

exports.deleteComment = (req,res) => {
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
}
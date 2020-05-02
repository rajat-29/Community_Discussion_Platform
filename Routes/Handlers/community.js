let express = require('express');
var app = require('express').Router();
let path = require('path');

app.use(express.static(path.join(__dirname,'../../public')));

var auth=require('../../MiddleWares/auth');

let communityController = require('../../Controllers/community');

app.get('/joinedCommunities',auth, function(req,res){
   res.render('joinedCommunities', {data: req.session.data,title : 'Joined Communities'});
})

app.get('/addNewCommunity',auth,function(req,res){ 
      res.render('addNewCommunity', {data: req.session.data,title : 'Add Community'});
})

app.get('/searchingCommunity',auth,function(req,res) {
      res.render('searchingCommunity', {data: req.session.data,title : 'Search Community'});
})

app.get('/invitedCommunity',auth,function(req,res) {
      res.render('invitedCommunity', {data: req.session.data,title : 'Invite Community'});
})

// controllers //

app.use('/addNewCommunitytobase',auth,communityController.addNewCommunitytobase);

app.use('/getOwnedCommunity',auth,communityController.getOwnedCommunity);

app.use('/getCommunityManagers',auth,communityController.getCommunityManagers);

app.use('/getJoinedCommunity',auth,communityController.getJoinedCommunity);

app.use('/getPendingCommunity',auth,communityController.getPendingCommunity);

app.use('/getCommunityforSearch',auth,communityController.getCommunityforSearch);

app.use('/getInvitationsForUser',auth,communityController.getInvitationsForUser);

app.use('/joincommunity',auth,communityController.joincommunity);

app.use('/joinInvitedcommunity',auth,communityController.joinInvitedcommunity);

app.use('/info/:pros',auth,communityController.info);

app.use('/setting/:pros',auth,communityController.setting);

app.use('/communityProfile/:pros',auth,communityController.communityProfile);

app.use('/viewprofile/:pros',auth,communityController.viewprofile);

app.use('/editCommunity/:pros',auth,communityController.editCommunity);

app.use('/updatecommdetails',auth,communityController.updatecommdetails);

app.use('/inviteUser/:pros',auth,communityController.inviteUser);

app.use('/discussion/:pros',auth,communityController.discussion);

app.use('/leaveCommunityBYUser',auth,communityController.leaveCommunityBYUser);

app.use('/leavePendingcommunity',auth,communityController.leavePendingcommunity);

app.use('/showCommunityMembers/:pros',auth,communityController.showCommunityMembers);

app.use('/getRequest',auth,communityController.getRequest);

app.use('/getManagers',auth,communityController.getManagers);

app.use('/getInvited',auth,communityController.getInvited);

app.use('/getUsers',auth,communityController.getUsers);

app.use('/leaveCommunity',auth,communityController.leaveCommunity);

app.use('/leaveCommunityForRequestUsers',auth,communityController.leaveCommunityForRequestUsers);

app.use('/leaveCommunityForManagers',auth,communityController.leaveCommunityForManagers);

app.use('/removeInvitedUser',auth,communityController.removeInvitedUser);

app.use('/requestedUserJoinCommunity',auth,communityController.requestedUserJoinCommunity);

app.use('/addManagerToCommunity',auth,communityController.addManagerToCommunity);

app.use('/demoteManagerFromCommunity',auth,communityController.demoteManagerFromCommunity);

app.use('/getUsersOtherThanInCommunity',auth,communityController.getUsersOtherThanInCommunity);

app.use('/inviteUserComm',auth,communityController.inviteUserComm);

module.exports = app;
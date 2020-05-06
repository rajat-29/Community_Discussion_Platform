let express = require('express');
var app = require('express').Router();
let path = require('path');

app.use(express.static(path.join(__dirname,'../../public')));

var auth=require('../../MiddleWares/auth');

let communityController = require('../../Controllers/community');

app.get('/joinedCommunities',auth.checkSession, function(req,res){
   res.render('joinedCommunities', {data: req.session.data,title : 'Joined Communities'});
})

app.get('/addNewCommunity',auth.checkSession,function(req,res){ 
      res.render('addNewCommunity', {data: req.session.data,title : 'Add Community'});
})

app.get('/searchingCommunity',auth.checkSession,function(req,res) {
      res.render('searchingCommunity', {data: req.session.data,title : 'Search Community'});
})

app.get('/acceptInvitation',auth.checkSession,function(req,res) {
      res.render('acceptInvitation', {data: req.session.data,title : 'Accept Invitation'});
})

// controllers //

app.use('/addNewCommunitytobase',auth.checkSession,communityController.addNewCommunitytobase);

app.use('/getOwnedCommunity',auth.checkSession,communityController.getOwnedCommunity);

app.use('/getCommunityManagers',auth.checkSession,communityController.getCommunityManagers);

app.use('/getJoinedCommunity',auth.checkSession,communityController.getJoinedCommunity);

app.use('/getPendingCommunity',auth.checkSession,communityController.getPendingCommunity);

app.use('/getCommunityforSearch',auth.checkSession,communityController.getCommunityforSearch);

app.use('/getInvitationsForUser',auth.checkSession,communityController.getInvitationsForUser);

app.use('/joincommunity', auth.checkSession,communityController.joincommunity);

app.use('/joinInvitedcommunity',auth.checkSession,communityController.joinInvitedcommunity);

app.use('/info/:pros',auth.checkSession,communityController.info);

app.use('/setting/:pros',auth.checkSession,communityController.setting);

app.use('/communityProfile/:pros',auth.checkSession,communityController.communityProfile);

app.use('/viewprofile/:pros',auth.checkSession,communityController.viewprofile);

app.use('/editCommunity/:pros',auth.checkSession,communityController.editCommunity);

app.use('/updatecommdetails',auth.checkSession,communityController.updatecommdetails);

app.use('/inviteUser/:pros',auth.checkSession,communityController.inviteUser);

app.use('/discussion/:pros',auth.checkSession,communityController.discussion);

app.use('/leaveCommunityBYUser',auth.checkSession,communityController.leaveCommunityBYUser);

app.use('/leavePendingcommunity',auth.checkSession,communityController.leavePendingcommunity);

app.use('/showCommunityMembers/:pros',auth.checkSession,communityController.showCommunityMembers);

app.use('/getRequest',auth.checkSession,communityController.getRequest);

app.use('/getManagers',auth.checkSession,communityController.getManagers);

app.use('/getInvited',auth.checkSession,communityController.getInvited);

app.use('/getUsers',auth.checkSession,communityController.getUsers);

app.use('/leaveCommunity',auth.checkSession,communityController.leaveCommunity);

app.use('/leaveCommunityForRequestUsers',auth.checkSession,communityController.leaveCommunityForRequestUsers);

app.use('/leaveCommunityForManagers',auth.checkSession,communityController.leaveCommunityForManagers);

app.use('/removeInvitedUser',auth.checkSession,communityController.removeInvitedUser);

app.use('/requestedUserJoinCommunity',auth.checkSession,communityController.requestedUserJoinCommunity);

app.use('/addManagerToCommunity',auth.checkSession,communityController.addManagerToCommunity);

app.use('/demoteManagerFromCommunity',auth.checkSession,communityController.demoteManagerFromCommunity);

app.use('/getUsersOtherThanInCommunity',auth.checkSession,communityController.getUsersOtherThanInCommunity);

app.use('/inviteUserComm',auth.checkSession,communityController.inviteUserComm);

module.exports = app;
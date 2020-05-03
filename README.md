# Community_Discussion_Platform

Website in which community can interact with each other.It is a Website developed under UCA class for our Web Project !!

## How To Run?

To run this website run this command on command prompt on root folder.

```
npm start or node app.js
```

It will run under the url http://127.0.0.1:3000/

## Login Details

Email and Password for Website:<br>

Admin :<br>
Email :admin@cq.com<br>
Password: admincq<br>

Community Builder :<br>
Email :community@cq.com<br>
Password: admincq<br>

Email :community1@cq.com<br>
Password: admincq<br>

User:<br>
Email : bro@gmail.com<br>
Password: admincq<br>

## Features

- Dynamic Data by mongoose database
- Different View For User, Admin and Super Admin
- Capable for real time chatting in different communities
- Capable of sending Mail using NodeMailer
- Responsive Layout
- Mobile Friendly
- Open Source

## How to Use ?
<ol type="number">
<li> Use mongorestore command to add database to your Local Machine.</li>
<li>Run Mongo Server</li>
<li>Run Server File app.js</li>
<li>Run local host on port number 8000</li>
<li>Login using admin id or user id (For id and password see database)</li>
<li>Users can join communities</li>
<li>Community Builders can create and join communities both</li>
<li>Admin can add Users,Community Builders</li>
<li>Manages Users</li>
</ol>

## Pre-requisites

- Node JS (Tested on v12.14.0)
- Mongoose
- Pre-requisites or Dependencies(Below)

## Dependencies :

<ul>
  <li>Mongoose</li>
  <li>Express</li>
  <li>Express-Session</li>
  <li>PATH</li>
  <li>EJS</li>
  <li>EJS Mate</li>
  <li>Node Mailer</li>
  <li>Multer</li>
  <li>Passport-GitHub</li>
  <li>Bcrypt</li>
  <li>HTTP</li>
</ul>

- Express

```
npm install express
```

- EJS

```
npm install ejs
```

- Express-Session

```
npm install express-session
```

- Multer

```
npm install multer
```

- Mongoose

```
npm install mongoose
```

- Node Mailer

```
npm install nodemailer
```

- Dotenv

```
npm install dotenv
```

- Bcrpty

```
npm install bcrpty  / npm i bcrpty
```

- Socket

```
npm install socket
```

## Schema

<h4><b>User Schema</b></h4>

| Name         | Type   | Required | Unique | Encrpyted |
| ------------ | ------ | -------- | ------ | --------- |
| Name         | String | Yes      | No     | No        |
| Email        | String | Yes      | Yes    | No        |
| Password     | String | Yes      | No     | Yes       |
| Phone No.    | String | Yes      | No     | No        |
| City         | String | Yes      | No     | No        |
| Gender       | String | Yes      | No     | No        |
| DOB          | String | Yes      | No     | No        |
| Role         | String | Yes      | No     | No        |
| Status       | String | Yes      | No     | No        |
| Flag         | String | No       | No     | No        |
| Interests    | String | No       | No     | No        |
| Bitmore      | String | No       | No     | No        |
| Expectations | String | No       | No     | No        |
| Photoname    | String | No       | No     | No        |

<h4><b>Community Schema</b></h4>

| Name         | Type                           | Required | Unique |
| ------------ | ------------------------------ | -------- | ------ |
| Name         | String                         | Yes      | Yes    |
| Rule         | String                         | Yes      | No     |
| Location     | String                         | No       | No     |
| Email        | String                         | No       | No     |
| Owner        | String                         | Yes      | No     |
| CreateDate   | String                         | No       | No     |
| Status       | String                         | No       | No     |
| Desc         | String                         | Yes      | No     |
| Commphoto    | String                         | Yes      | No     |
| OwnerId      | String                         | No       | No     |
| Memberno     | String                         | No       | No     |
| Commuser     | Array of ObjectId('User')      | No       | No     |
| Commasktojoin| Array of ObjectId('User')      | No       | No     |
| CommManagers | Array of ObjectId('User')      | No       | No     |
| Invited      | Array of ObjectId('User')      | No       | No     |

<h4><b>Tag Schema</b></h4>

| Name        | Type   | Required | Unique |
| ----------- | ------ | -------- | ------ |
| Tags        | String | Yes      | No     |
| Createdby   | String | Yes      | No     |
| Createddate | String | Yes      | No     |

<h4><b>Discussion Schema</b></h4>

| Name          | Type   |
| ------------- | ------ |
| Title         | String |
| Details       | String |
| Tag           | String |
| CommunityName | String |
| CreatedBy     | String |
| CreatedDate   | String |
| OwnerId       | String |
| CommunityId   | String |

<h4><b>Comment Schema</b></h4>

| Name         | Type   |
| ------------ | ------ | 
| Comment      | String | 
| DiscussionId | String |
| CommentedBy  | String | 
| OwnerId      | String |
| CommunityId  | String | 
| CreatedDate  | String |
| Photoname    | String | 

 <h4><b>Reply Schema</b></h4>

| Name         | Type   |
| ------------ | ------ |
| Reply        | String |
| CommentId    | String |
| DiscussionId | String |
| RepliedBy    | String |
| OwnerId      | String |
| CreatedDate  | String |
| Photoname    | String |


## Directory

```bash
|___ Root
|   |--- app.js
|   |
|   |--- Controller
|   |    |--- admin.js
|   |    |--- community.js
|   |    |--- discussion.js
|   |    |--- discussion.js
|   |    |--- login.js
|   |
|   |--- Dump (Mongoose Dump) (Dump)
|   |
|   |--- Middlewares
|   |    |--- middleware.js
|   |
|   |--- Models
|   |    |--- CommentSchema.js
|   |    |--- CommunitySchema.js
|   |    |--- DiscussionSchema.js
|   |    |--- ReplySchema.js
|   |    |--- TagSchema.js
|   |    |--- UserSchema.js
|   |
|   |--- Public
|   |    |--- css (Static)
|   |    |--- images (Staic and Dynamic)
|   |    |--- script (Static)
|   |
|   |--- Routes
|   |    |--- Handlers
|   |    |    |--- admin.ejs
|   |    |    |--- community.ejs
|   |    |    |--- discussion.ejs
|   |    |    |--- login.ejs
|   |    |--- index.js
|   |
|   |--- viwes
|   |    |--- layout
|   |    |    |--- layout.ejs
|   |    |--- partials
|   |    |    |--- header.ejs
|   |    |    |--- sidenavbar.ejs
|   |    |    |--- topar.ejs
|   |    |--- acceptInvitation.ejs
|   |    |--- addNewCommunity.ejs
|   |    |--- add_user.ejs
|   |    |--- changePassword.ejs
|   |    |--- communityDiscussions.ejs
|   |    |--- communityInformation.ejs
|   |    |--- communityProfileInfo.ejs
|   |    |--- communitySettings.ejs
|   |    |--- create_tag.ejs
|   |    |--- discussionOwnerInfo.ejs
|   |    |--- editcommunity.ejs
|   |    |--- editUserDetails.ejs
|   |    |--- home.ejs
|   |    |--- inviteUser.ejs
|   |    |--- joinedCommunities.ejs
|   |    |--- login.ejs
|   |    |--- manage_community.ejs
|   |    |--- manage_tags.ejs
|   |    |--- manage_users.ejs
|   |    |--- newUserDetails.ejs
|   |    |--- searchingCommunity.ejs
|   |    |--- showCommunitymembers.ejs
|   |    |--- switchAsUserAdmin.ejs
|   |    |--- viewProfile.ejs
```

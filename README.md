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
| name         | String                         | Yes      | Yes    |
| rule         | String                         | Yes      | No     |
| Location     | String                         | No       | No     |
| Email        | String                         | No       | No     |
| owner        | String                         | Yes      | No     |
| createDate   | String                         | No       | No     |
| status       | String                         | No       | No     |
| desc         | String                         | Yes      | No     |
| commphoto    | String                         | Yes      | No     |
| ownerId      | String                         | No       | No     |
| memberno     | String                         | No       | No     |
| commuser     | Array of ObjectId('User')      | No       | No     |
| commasktojoin| Array of ObjectId('User')      | No       | No     |
| commManagers | Array of ObjectId('User')      | No       | No     |
| invited      | Array of ObjectId('User')      | No       | No     |

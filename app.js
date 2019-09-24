var express = require('express')
var path = require('path')
var app = express()
var session = require('express-session');
var ejs = require('ejs');
var mongodb = require('mongodb');
var MongoDataTable = require('mongo-datatable');
var mailer = require('nodemailer');
var multer = require('multer');
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
var http = require("http").Server(app);
var io = require("socket.io")(http);
const bcrypt = require('bcrypt');
let saltRounds = 10
ObjectId = require('mongodb').ObjectID;
var MongoClient = mongodb.MongoClient;
var userdata = new Object();

//Set Storage Engine For images
var photoname ;
var community_photo = "uploads/defaultCommunity.jpg";

// user photo upload //
var storage = multer.diskStorage({
destination : './public/uploads/',
    filename : function(req, file, callback)
      {
        photoname=file.fieldname + '-' + Date.now() + '@' +path.extname(file.originalname)
        req.session.imagePath = photoname;
        callback(null,photoname);
      }
})

var upload = multer({
      storage : storage,
}).single('myFile');

// community photo upload //
var storagecomm = multer.diskStorage({
destination : './public/uploads/',
    filename : function(req, file, callback)
      {
        community_photo=file.fieldname + '-' + Date.now() + '@' +path.extname(file.originalname)
        req.session.imagePath = community_photo;
        callback(null,community_photo);
      }
})

var uploadcomm = multer({
      storage : storagecomm,
}).single('myFile');

// view engine setup
app.set('views', path.join(__dirname, 'Views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'/public'))) /*folder path*/
app.use(express.static(path.join(__dirname,'public/uploads')));

app.use(express.urlencoded({extended: true}))
app.use(express.json())									/*include express*/
app.use(session({
    secret: "xYzUCAchitkara",
    resave: false,
    saveUninitialized: true,
}))

var mongoose = require('mongoose');						/*include mongo*/
var mongoDB = 'mongodb://localhost/user';

mongoose.set('useFindAndModify', false);
mongoose.connect(mongoDB,{ useNewUrlParser: true});
mongoose.Promise = global.Promise;

mongoose.connection.on('error',(err) => {					/*database connect*/
    console.log('DB connection Error');
})

mongoose.connection.on('connected',(err) => {
    console.log('DB connected');
})

var users = require('./Schemas/UserSchema');
var t = require('./Schemas/TagSchema');

// community data base scheme //
var communitySchema = new mongoose.Schema({
    name: String,
    rule: String,
    location: String,
    email: String,
    owner: String,
    createDate: String,
    status: String,
    desc: String,
    commphoto: String,
    ownerId : String,
    memberno: String,
    commuser: [{'type': mongoose.Schema.Types.ObjectId , 'ref':users}],
    commasktojoin: [{'type': mongoose.Schema.Types.ObjectId , 'ref':users}],
})

var community = mongoose.model('communities', communitySchema);

var discussion = require('./Schemas/DiscussionSchema');
var Comments = require('./Schemas/CommentSchema');

// node mailler add your email and password here for email //
let transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    },
});

// Routing the routes //
app.use('/admin',require('./Routes/admin.js'));
app.use('/community',require('./Routes/community'));
app.use('/discussion',require('./Routes/discussion'));

// login checking //
app.post('/checkLogin',function (req, res)         /*post data */
  {
      req.session.isLogin = 0;
      var username = req.body.name;
      var pasword = req.body.password;
      users.findOne({email: username}, function(error,result)
      {
        if(error)
        throw error;

        if(!result) {
          res.send("not exits");
        }
        else
        {
          if(result.flag == 0)
          {
           res.send("false");
          }
          else 
          {
           bcrypt.compare(req.body.password,result.password,function(err,resi) {
            if(resi == true)
            {
                req.session.isLogin = 1;
                 req.session.email = req.body.name;
                 req.session.password = req.body.password;

                 userdata.name = result.name;
                 userdata.email = result.email;         
                 userdata.city = result.city;
                 userdata.role = result.role;
                 userdata.phone = result.phone;
                 userdata.gender = result.gender;
                 userdata.dob = result.dob;
                 userdata.status = result.status;
                 userdata.ides = result._id;
                 userdata.photoname = result.photoname;

                 req.session.data = userdata;
                 req.session.name = result.name;
                 req.session.iding = result._id;
                 res.send("true");
            }
            else {
              console.log(resi)
              res.send("false")
            }
          }) 
          }
        }
      })     
})

// admin side //
app.get('/home' , function(req,res){        /*get data */
    if(req.session.isLogin) 
    {
      if(req.session.data.role == 'Admin' || req.session.data.role == 'superAdmin') 
      {
        res.render('main', {data: req.session.data});
      }
      else if(req.session.data.role == 'User' || req.session.data.role == 'Community Manager')
      {
        if(req.session.data.dob == '')
        {
          res.render('newUserDetails', {data: req.session.data});
        }
        else
        {
          res.render('newUsereditProfile', {data: req.session.data});
        }         
      }
    } 
     else 
     {
      res.render('index');
     }
 })

// user deactivated //
app.get("/404" ,function(req,res) {
   res.render("404");
})

// logout the user and admin //
app.get('/yes', function(req,res) {
    req.session.isLogin = 0;
    req.session.destroy();
    res.render('index');
})

// upload admin image //
app.post('/upload',(req,res) => {
      upload(req,res,(err)=>{
        if(err)
        {
          throw error;
        }
        else{
          req.session.data.photoname = photoname;   
          res.render('editUserDetails', {data: req.session.data});
            
        }
      })
});

// upload community image //
app.post('/uploadcomm',(req,res) => {
      uploadcomm(req,res,(err)=>{
        if(err)
        {
          throw error;
        }
        else{
        }
      })
});

// upload user image //
app.post('/Userupload',(req,res) => {
      upload(req,res,(err)=>{
        if(err)
        {
          throw error;
        }
        else{
          req.session.data.photoname = photoname;
          res.render('newUserProfileDetails', {data: req.session.data});
            
        }
      })
});

app.post('/sendMail', function(request,response) {
      transporter.sendMail(request.body, (error, info) => {
        if(error) {
          console.log(error)
        } else {
          console.log("Mail sent");
        }
      })
})


// render edit button profile page //
app.get('/editUserProfile', function(req,res) {
    if(req.session.isLogin) {
      res.render('editUserProfile', {data: req.session.data});
       } else {
      res.render('index');
     }
})

// render update details of admin profile page //
app.get('/editUserDetails', function(req,res) {
    if(req.session.isLogin) {
      res.render('editUserDetails', {data: req.session.data});
    
       } else {
      res.render('index');
     }
})

// new user profile //
// render user edit button profile page //
app.get('/newUsereditProfile', function(req,res) {
    if(req.session.isLogin) {
      res.render('newUsereditProfile', {data: req.session.data});
       } else {
      res.render('index');
     }
})   

// update  
app.post('/updateeditUserDetails', function(req,res) {
        users.updateOne( { "email" : req.session.email}, {$set : req.body } , function(err,result)
        {
          if(err)
          throw err
          else
          {
            req.session.data.name = req.body.name;
           req.session.data.email = req.body.email;         
           req.session.data.city = req.body.city;
           req.session.data.phone = req.body.phone;
           req.session.data.gender = req.body.gender;
           req.session.data.interest = req.body.interest;
           req.session.data.bitmore = req.body.bitmore;
           req.session.data.expectation = req.body.expectation;
            res.send("DATA UPDATED SUCCESFULLY")
          }
        })
})

app.post('/updateeditUserDob', function(req,res) {
        users.updateOne( { "email" : req.session.email}, {$set : req.body } , function(err,result)
        {
          if(err)
          throw err
          else
          {
            req.session.data.dob = req.body.dob;
            req.session.data.name = req.body.name;
           req.session.data.email = req.body.email;         
           req.session.data.city = req.body.city;
           req.session.data.phone = req.body.phone;
           req.session.data.gender = req.body.gender;
           req.session.data.interest = req.body.interest;
           req.session.data.bitmore = req.body.bitmore;
           req.session.data.expectation = req.body.expectation;
            res.send("DATA UPDATED SUCCESFULLY")
          }
        })
})

app.get('/newUsereditProfile', function(req,res) {
      if(req.session.isLogin) {
      res.render('newUsereditProfile', {data: req.session.data});
    
       } else {
      res.render('index');
     }
})

app.get('/newUserProfileDetails', function(req,res) {
    if(req.session.isLogin) {
      res.render('newUserProfileDetails', {data: req.session.data});
    
       } else {
      res.render('index');
     }
})

app.get('/newUserchangePassword', function(req,res) {
    if(req.session.isLogin) {
      res.render('newUserchangePassword', {data: req.session.data});
    
       } else {
      res.render('index');
     }
})

// community pages //
app.get('/openCommunityPage' , function(req,res){
    if (req.session.isLogin) 
    {
      if(req.session.data.role == 'User' )
      {
         res.render('newUserCommunityPage', {data: req.session.data});
      } 
      else if(req.session.data.role == 'Community Manager' )
      {
         res.render('communityUserCommunityPage', {data: req.session.data});
      }
      else if(req.session.data.role == 'superAdmin' )
      {
         res.render('newUserCommunityPage', {data: req.session.data});
      }
    }
    else
    {
      res.render('index');
    }
})

 /*post data */
app.post('/changePhoto',function (req, res)        
  {
      req.session.photoname = req.body.name;
      res.send("true");
})

io.on('connection',function(socket){
    socket.on('comment',function(data){
        var commentData = new Comments(data);
        commentData.save();
        socket.broadcast.emit('comment',data);  
    });
});

console.log("Running on port 8000");
http.listen(8000)
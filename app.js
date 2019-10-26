var express = require('express')
var path = require('path')
var app = express()
var session = require('express-session');
var ejs = require('ejs');
var mongodb = require('mongodb');
var MongoDataTable = require('mongo-datatable');
var multer = require('multer');
var passport = require('passport');
var mongoStore = require('connect-mongo')(session);
app.use(passport.initialize());
app.use(passport.session());
var http = require("http").Server(app);
var io = require("socket.io")(http);
ObjectId = require('mongodb').ObjectID;
var MongoClient = mongodb.MongoClient;
var userdata = new Object();

//Set Storage Engine For images
var photoname ;
var community_photo = "uploads/defaultCommunity.jpg";

// user photo upload //
function sanitizeFile(file, cb) {
    // Define the allowed extension
    let fileExts = ['png', 'jpg', 'jpeg', 'gif']
    // Check allowed extensions
    let isAllowedExt = fileExts.includes(file.originalname.split('.')[1].toLowerCase());
    // Mime type must be an image
    let isAllowedMimeType = file.mimetype.startsWith("image/")
    if(isAllowedExt && isAllowedMimeType){
        return cb(null ,true) // no errors
    }
    else{
        // pass error msg to callback, which can be displaye in frontend
        cb('Error: File type not allowed!')
    }
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
      photoname = Date.now()+ file.fieldname+'.'+file.originalname.split('.')[1].toLowerCase();
      console.log(photoname) 
      cb(null, Date.now()+ file.fieldname+'.'+file.originalname.split('.')[1].toLowerCase())
    }
  })
   
  var upload = multer({ storage: storage ,
    limits: {
        fileSize: 1000000
    },
    fileFilter: function (req, file, cb) {
        sanitizeFile(file, cb);
    }
}).single('myFile')


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

var mongoose = require('mongoose');           /*include mongo*/
var mongoDB = 'mongodb://localhost/user';

mongoose.set('useFindAndModify', false);
mongoose.connect(mongoDB,{ useNewUrlParser: true});
mongoose.Promise = global.Promise;

var db = mongoose.connection;

app.use(express.urlencoded({extended: true}))
app.use(express.json())									/*include express*/
app.use(session({
    secret: "xYzUCAchitkara",
    resave: false,
    saveUninitialized: false,
    clear_interval: 900,
    store : new mongoStore({mongooseConnection:db}),
    autoRemove: 'native',
    cookie: {maxAge: 3000000}
}))

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
    commManagers: [{'type': mongoose.Schema.Types.ObjectId , 'ref':users}],
    invited: [{'type': mongoose.Schema.Types.ObjectId , 'ref':users}],
})

var community = mongoose.model('communities', communitySchema);

var discussion = require('./Schemas/DiscussionSchema');
var Comments = require('./Schemas/CommentSchema');
var Replies = require('./Schemas/ReplySchema');

// Routing the routes //
app.use('/login',require('./Routes/login'));
app.use('/admin',require('./Routes/admin.js'));
app.use('/community',require('./Routes/community'));
app.use('/discussion',require('./Routes/discussion'));
app.use('/user',require('./Routes/user'));

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

// upload admin image //

app.post('/upload',(req,res)=>{
    upload(req, res, (err) => {
        if (err){ 
            res.send({ 'msg': err})
        }else{
                 req.session.data.photoname = photoname;   
                 res.render('editUserDetails', {data: req.session.data});
            
        }
    
    })

})

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
           res.send({ 'msg': err})
        }
        else{
          req.session.data.photoname = photoname;
          res.render('newUserProfileDetails', {data: req.session.data});
            
        }
      })
});

// update  
app.post('/updateeditUserDetails', sessionCheck,function(req,res) {
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
           req.session.data.photoname = req.body.photoname;
            res.send("DATA UPDATED SUCCESFULLY")
          }
        })
})

app.post('/updateeditUserDob',sessionCheck, function(req,res) {
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
            req.session.data.photoname = req.body.photoname;
            res.send("DATA UPDATED SUCCESFULLY")
          }
        })
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

io.on('connection',function(socket){
    socket.on('reply',function(data){
        var replyData = new Replies(data);
        replyData.save();
        socket.broadcast.emit('reply',data);  
    });
});

console.log("Running on port 8000");
http.listen(8000)
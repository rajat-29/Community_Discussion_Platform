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
var port=8000;

//Set Storage Engine For images
var community_photo = "uploads/defaultCommunity.jpg";

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

var users = require('./Models/UserSchema');
var t = require('./Models/TagSchema');
var community = require('./Models/communitySchema');
var discussion = require('./Models/DiscussionSchema');
var Comments = require('./Models/CommentSchema');
var Replies = require('./Models/ReplySchema');

// Routing the routes //
app.use('/login',require('./Routes/login'));
app.use('/admin',require('./Routes/admin.js'));
app.use('/community',require('./Routes/community'));
app.use('/discussion',require('./Routes/discussion'));
app.use('/user',require('./Routes/user'));

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

app.listen(port,()=>{console.log("Running on port "+port);});
var express = require('express')
var path = require('path')
var app = express()
var session = require('express-session');
var ejs = require('ejs');
var mongodb = require('mongodb');
var mongoStore = require('connect-mongo')(session);
var http = require("http").Server(app);
var io = require("socket.io")(http);
ObjectId = require('mongodb').ObjectID;
var MongoClient = mongodb.MongoClient;
var port=8000;

app.set('views', path.join(__dirname, 'Views'));                   // view engine setup //
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'/public')))           // folder path  //
app.use(express.static(path.join(__dirname,'/public/uploads'))) 

var mongoose = require('mongoose');                               //  include mongo //
var mongoDB = 'mongodb://localhost/user';

mongoose.set('useFindAndModify', false);
mongoose.connect(mongoDB,{ useNewUrlParser: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;

app.use(express.urlencoded({extended: true}))
app.use(express.json())									         //  include express  //
app.use(session({
    secret: "xYzUCAchitkara",
    resave: false,
    saveUninitialized: false,
    clear_interval: 900,
    store : new mongoStore({mongooseConnection:db}),
    autoRemove: 'native',
    cookie: {maxAge: 3000000}
}))

mongoose.connection.on('error',(err) => {					    // database connect  //
    console.log('DB connection Error');
})

mongoose.connection.on('connected',(err) => {
    console.log('DB connected');
})

var Comments = require('./Models/CommentSchema');
var Replies = require('./Models/ReplySchema');

app.use('/login',require('./Routes/login'));                   // Routing the routes //
app.use('/admin',require('./Routes/admin.js'));
app.use('/community',require('./Routes/community'));
app.use('/discussion',require('./Routes/discussion'));
app.use('/user',require('./Routes/user'));

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

http.listen(port,()=>{console.log("Running on port "+port);});
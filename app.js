var express = require('express')
var engine = require("ejs-mate");
var path = require('path')
var app = express()
var session = require('express-session');
var ejs = require('ejs');
var mongodb = require('mongodb');
var http = require("http").Server(app);
var io = require("socket.io")(http);
ObjectId = require('mongodb').ObjectID;
var port = process.env.PORT || 3000;
var bodyParser = require("body-parser");
var mongoStore = require("connect-mongo")(session);

require("dotenv").config();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.engine("ejs", engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));                   // view engine setup //

app.use(express.static(path.join(__dirname,'/public')))           // folder path  //
app.use(express.static(path.join(__dirname,'/public/uploads'))) 

// DB //
require("./config/db");

/* Mongoose Connectopn */
var mongoose = require("mongoose");
var db = mongoose.connection;

app.use(express.urlencoded({extended: true}))
app.use(express.json())									         //  include express  //
app.use(session({
    secret: "xYzUCAchitkara",
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({
      mongooseConnection: db
    })
}))

var Comments = require('./Models/CommentSchema');
var Replies = require('./Models/ReplySchema');

app.use('/',require('./Routes/'));

app.get('/', function(req,res) {
  res.render('login');
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

http.listen(port,()=>{console.log("Running on port "+port);});
let express = require('express');
var app = require('express').Router();
let path = require('path');

app.use(express.static(path.join(__dirname,'../public')));
app.use(express.static(path.join(__dirname,'../public/uploads')));

app.use('/login',require('./login'));                   // Routing the routes //
app.use('/admin',require('./admin.js'));
app.use('/community',require('./community'));
app.use('/discussion',require('./discussion'));
app.use('/user',require('./user'));

module.exports = app;
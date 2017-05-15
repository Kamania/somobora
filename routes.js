var operations = require('./server/dbOperations');


var path = require('path');
var formidable = require('formidable');
var nodeStatic = require('node-static');
var fs = require('fs');

module.exports = function (app, io,address) {

    /*var sockets = require('./server/socket');
    var socket = sockets.initializeSockets(io);
    console.log(socket)*/
    
     var onlineUsers = [];
     var connectedIds = [];

     var socket;
     
    var chat = io.on('connection', function (sock) {
        socket = sock;
        
        console.log("connected one user "+socket.id);
        connectedIds.push(socket.id);
        socket.join(0);
        
        socket.emit("onlineUsers",onlineUsers);
         
       
   });
    
    app.get('/', function (req, res) {
        res.render('forum');
    });
     app.get('/profile', function (req, res) {
        res.render('profile');
    });
    app.get('/room', function (req, res) {
        res.render('rooms');
    });
    app.get('/forum_replies', function (req, res) {
        res.render('forum_replies');
    });
    app.post('/', function (req, res) {
            res.render('forum/?category=movies');
    });
    app.post('/login', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        operations.checkUser(data,function(result){
              onlineUsers.push(result);
              socket.in(0).broadcast.emit("gotOnline",result);
              res.status(200).send(result);
        });
    });
    app.post('/getPosts', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        operations.getPosts(data,function(result){
             res.status(200).send(result);
        });
    });
    app.post('/getPostReplies', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        operations.getPostReplies(data,function(result){
             res.status(200).send(result);
        });
    });
    app.post('/replyPost', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        operations.insertReply(data,function(result){
             res.status(200).send(result);
        });
    });
};
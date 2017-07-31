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
         
           // Somebody left the chat
        socket.on('disconnect', function () {
           
             connectedIds.pop(connectedIds.indexOf(socket.id),1);
             
            //if(socket.user_id != null && socket.user_id != ''){
                 onlineUsers.pop(onlineUsers.indexOf(socket.user_id),1);
                 console.log("disconnected socket "+socket.id+" user "+socket.user_id);
                 console.log("onlineUsers");
                 console.log(onlineUsers);
           //}
        });
    
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
              socket.user_id = result.user_id;
              socket.in(0).broadcast.emit("gotOnline",result);
              res.status(200).send(result);
        });
    });
    app.post('/registerUser', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        operations.registerUser(data,function(result){
              res.status(200).send(result);
        });
    });
     app.post('/getUserDetails', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        operations.getUserDetails(data,function(result){
              res.status(200).send(result);
        });
    });
 app.post('/registerProfile', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        operations.registerUserProfile(data,function(result){
              console.log(result);
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
     app.post('/createPost', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        operations.createPost(data,function(result){
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
    
     app.post('/uploadProfile', function(req, res){
         res.setHeader('Content-Type', 'application/json');
          var form = new formidable.IncomingForm();
          var fileName = "";
          form.multiples = true;
          form.uploadDir = path.join(__dirname, '/public/image_uploads/profile/');
          form.on('file', function(field, file) {
            fileName = file.name;  
            fs.rename(file.path, path.join(form.uploadDir, fileName));
          });
          form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
          });
          form.on('end', function() {
           res.status(200).send({profile_photo:fileName});
          });
          form.parse(req);
        });
        
    app.post('/uploadImagePost', function(req, res){
         res.setHeader('Content-Type', 'application/json');
          var form = new formidable.IncomingForm();
           var fileName = "";
          form.multiples = true;
          form.uploadDir = path.join(__dirname, '/public/image_uploads/bounds/');
          form.on('file', function(field, file) {
             fileName = file.name;  
            fs.rename(file.path, path.join(form.uploadDir, file.name));
          });
          form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
          });
          form.on('end', function() {
            res.status(200).send({fileName:fileName,message:"uploaded successfully !!"});
           res.end("uploaded successfully !!");
          });
          form.parse(req);
        });
        
};
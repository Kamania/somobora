var operations = require('./server/dbOperations');
var path = require('path');
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
     
    app.get('/getIdentifyImageQuestions', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        operations.getIdentifyImageQuestions(data,function(result){
              res.status(200).send(result);
        });
    });
    app.get('/getSelectPicQuestions', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var data = req.body;
        operations.getSelectPicQuestions(data,function(result){
              res.status(200).send(result);
        });
    });
 
    
};
var exports = module.exports = {};

function initializeSockets(io){

   //holds a list of all users who are online
   var onlineUsers = [];
   var myRooms = []
   var connectedIds = [];
     
    // Initialize a new socket.io application
    var chat = io.on('connection', function (socket) {
        socks = socket;
        console.log("connected one user "+socket.id);
        connectedIds.push(socket.id);
        
         socket.on('login', function (data) {
             console.login("Logging someone in ..");
             console.log(data);
         }); 
       
  });
  ;
}
  
 exports.initializeSockets = initializeSockets;

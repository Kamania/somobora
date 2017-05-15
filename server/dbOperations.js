var mysql = require('mysql');
var auth = require('./auth');
var posts = require('./forum');

var db_config = {
      host     : '127.0.0.1',
      user     : 'root',
      password : 'chowder60',
      database : 'forum_site',
 };

    var connection;

    function handleDisconnect() {

      connection = mysql.createConnection(db_config);

      connection.connect(function(err) {
        if(err) {
          console.log('error when connecting to db:', err);
          setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }  else{
          console.log("Successfully connected to Db");
        }                                   // to avoid a hot loop, and to allow our node script to
      });                                     // process asynchronous requests in the meantime.
                                              // If you're also serving http, display a 503 error.
      connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
          handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
          throw err;                                  // server variable configures this)
        }
      });
    }
 var checkUser = function(data,callback){
        auth.checkUser(connection,data,function(result){
           callback(result); 
        });
 }
    var getPosts = function(data,callback){
        posts.getPosts(connection,data,function(result){
           callback(result); 
        });
    }
     var getPostReplies = function(data,callback){
        posts.getPostReplies(connection,data,function(result){
           callback(result); 
        });
    }
    var insertReply = function(data,callback){
        posts.insertReply(connection,data,function(result){
           callback(result); 
        });
    }
    
    handleDisconnect();
    
    exports.getPosts = getPosts;
    exports.getPostReplies = getPostReplies;
    exports.insertReply = insertReply;
    exports.checkUser = checkUser;
    


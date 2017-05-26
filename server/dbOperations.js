var mysql = require('mysql');
var auth = require('./auth');
var posts = require('./posts');

var db_config = {
      host     : '127.0.0.1',
      user     : 'root',
      password : 'chowder60',
      database : 'forum_site',
 };

/*var db_config = {
      host     : 'us-cdbr-iron-east-04.cleardb.net',
      user     : 'b24451f926df20',
      password : '058c8002',
      database : 'heroku_4ea7a5d697457a3',
 };*/

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
  var getUserDetails = function(data,callback){
        auth.getUserDetails(connection,data,function(result){
           callback(result); 
        });
 }
 
  var registerUser = function(data,callback){
        auth.registerUser(connection,data,function(result){
           callback(result); 
        });
 }
   var registerUserProfile = function(data,callback){
        auth.registerUserProfile(connection,data,function(result){
           callback(result); 
        });
 }
    var getPosts = function(data,callback){
        if(data.category_id == "trending"){
            posts.getTrendingPosts(connection,data,function(result){
              callback(result); 
           });
        }else{
          posts.getPosts(connection,data,function(result){
           callback(result); 
         });  
        }
        
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
    var createPost = function(data,callback){
        posts.createPost(connection,data,function(result){
           callback(result); 
        });
    }
    
    handleDisconnect();
    
    exports.getPosts = getPosts;
    exports.getPostReplies = getPostReplies;
    exports.insertReply = insertReply;
    exports.createPost = createPost;
    exports.checkUser = checkUser;
    exports.registerUser = registerUser;
    exports.registerUserProfile = registerUserProfile
    exports.getUserDetails = getUserDetails;

    
    


function checkUser(connection,data,callback){
    
    var query = connection.query("SELECT `user`.`user_id`,`user`.`username` from `user` WHERE ? AND ?  ",[{password:data.password},{email:data.email}],function(err, rows, fields) {
          if (!err){
             // console.log(query.sql)
              if(rows.length > 0){
                     console.log("user exist proceed to login");
                      var userDetail = {
                        user_id:rows[0]['user_id'],
                        username:rows[0]['username'],
                        success:1
                    }
                     callback(userDetail);
              }else{
                  console.log("user Does NOT exist");
                  callback({success:0});
              }

          }else{
               console.log("errror in sql syntax<checkUser> "+err);
               callback({success:0});
          }
          });
}

var registerUser = function (connection,data,callback){
 
  var query = connection.query('INSERT INTO user SET ?', data, function(err, result) {
      if (!err){
             var response = {
                success:1,
                user_id:result.insertId
             };
             callback(response);
      }else{
          callback(0) ;
        console.log("errror "+err);
      }
  });
}

//handle profile
var registerUserProfile = function (connection,data,callback){

  var query = connection.query('UPDATE user SET ? WHERE ?',[{username:data.username},{user_id:data.user_id}], function(err, result) {
   
      if (!err){
          var data2 = {
               profile_photo:data.profile_photo,
               user_id:data.user_id
          };
          var query2 = connection.query('INSERT INTO user_details SET ?', data2, function(err2, result2) {

               if (!err2){
                var response = {
                    status:1,
                    user_id:data.user_id
                };
                 callback(response) ;
 
               console.log("user_id for user "+result.insertId);
               }else{
                var response = {
                    status:0,
                    message:"Could not upload profile,try again later !",
                    user_id:null
                };
                callback(response) ;
                console.log("errror "+err2);
               }
          });

      }else{
          callback({status:0,message:"Could not upload profile,try again later !"}) ;
        console.log("errror "+err);
      }
//  console.log("result "+result.insertId);
     console.log(query.sql);
  });
}

//edit profile
var editProfile = function (data,callback){

  var query = connection.query('UPDATE user SET ? WHERE ?',[{username:data.username},{user_id:data.user_id}], function(err, result) {
   console.log(query.sql);
   
      if (!err){
          var data2 = {
               status:data.status,
               profile_photo:data.profile_photo
          };
          var query2 = connection.query('UPDATE user_details SET ? WHERE ? ',[data2,{user_id:data.user_id}] , function(err2, result2) {
              console.log(query2.sql);
               if (!err2){

                var response = {
                    success:1,
                    user_id:data.user_id
                };

                 callback(response) ;
 
               }else{ 
                   console.log("errror "+err2);
                var response = {
                    success:0,
                    user_id:null
                };
                callback(response) ;
             
               }
                   

          });


      }else{
          callback(0) ;
        console.log("errror "+err);
      }
//  console.log("result "+result.insertId);
     console.log(query.sql);
  });
}

var getUserDetails = function(connection,data,callback){
    console.log(data);
    var query = connection.query("SELECT `user`.`user_id`,`user`.`username`,`user_details`.`profile_photo` from `user`  LEFT JOIN `user_details` ON `user`.`user_id` = `user_details`.`user_id` WHERE `user`.`user_id` = ? ",data.user_id,function(err, rows, fields) {
    if (!err){
      if(rows.length > 0){
            var userDetail = {
               user_id:rows[0]['user_id'],
               username:rows[0]['username'],
               profile_photo:rows[0]['profile_photo'],
               status:1
             }
             console.log(userDetail);
             callback(userDetail);
      }else{
          console.log("user Details do NOT exist");
          var userDetail = {
             status:0
          }
          callback(userDetail);    
      }

    }else{
         console.log("errror in sql syntax<getUserDetails> "+err);
           var userDetail = {
               success:0
            }
            callback(userDetail);
    }
  });
}
exports.getUserDetails = getUserDetails;
exports.registerUser = registerUser;
exports.registerUserProfile = registerUserProfile;
exports.editProfile = editProfile;
exports.checkUser = checkUser;

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
exports.checkUser = checkUser;

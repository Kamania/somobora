function getPosts(connection,data,callback){
 
    var query = connection.query("SELECT @post_id := `post_id` as `post_id`,@user_id := `user_id` as `user_id`,(SELECT `username` FROM `user` WHERE `user_id` = @user_id) as username,"+
      " `post_text`,(SELECT count(*) FROM `post_reply` WHERE `post_id` = @post_id) as no_replies,CASE WHEN (TIMESTAMPDIFF(SECOND,`posts`.`created_at`,CURRENT_TIMESTAMP()))   < 60"+
				" THEN  Concat((TIMESTAMPDIFF(SECOND,`posts`.`created_at`,CURRENT_TIMESTAMP())),' secs ago')"+
		                " WHEN (TIMESTAMPDIFF(MINUTE,`posts`.`created_at`,CURRENT_TIMESTAMP()))  < 60"+
		                " THEN  Concat((TIMESTAMPDIFF(MINUTE,`posts`.`created_at`,CURRENT_TIMESTAMP())),' min ago')"+
				" WHEN (TIMESTAMPDIFF(HOUR,`posts`.`created_at`,CURRENT_TIMESTAMP()))  <= 24"+
				" THEN  Concat((TIMESTAMPDIFF(HOUR,`posts`.`created_at`,CURRENT_TIMESTAMP())),' hours ago')"+
				" WHEN (TIMESTAMPDIFF(DAY,`posts`.`created_at`,CURRENT_TIMESTAMP()))  <= 30"+
				" THEN  Concat((TIMESTAMPDIFF(DAY,`posts`.`created_at`,CURRENT_TIMESTAMP())),' days ago')"+
				" WHEN (TIMESTAMPDIFF(MONTH,`posts`.`created_at`,CURRENT_TIMESTAMP()))  <= 12"+
				" THEN  Concat((TIMESTAMPDIFF(MONTH,`posts`.`created_at`,CURRENT_TIMESTAMP())),' months ago')"+
				" WHEN (TIMESTAMPDIFF(YEAR,`posts`.`created_at`,CURRENT_TIMESTAMP()))  >= 1"+
				" THEN  Concat((TIMESTAMPDIFF(YEAR,`posts`.`created_at`,CURRENT_TIMESTAMP())),' years ago')"+
				" END AS time_gone \n\
        from `posts` WHERE ? ",{category_id:data.category_id},function(err, rows, fields) {
   //console.log(query.sql);
   
    if (!err){
                
           if(rows.length > 0){
               var dataArray = [];
               for(var i= 0; i < rows.length; i++){
                   var post_info = {
                        user_id:rows[i]['user_id'],
                        post_id:rows[i]['post_id'],
                        username:rows[i]['username'],
                        post_text:rows[i]['post_text'],
                        time_gone:rows[i]['time_gone'],
                        no_replies:rows[i]['no_replies'],
                    }
                    dataArray.push(post_info);
               }
                callback({status:1,data:dataArray,message:"Success"});
           }else{
               callback({status:0,message:"No posts"});
           }
        
    }else{console.log("errror in sql syntax "+err);}
 });
}
function getPostData(connection,post_id,callback){
 
    var query = connection.query("SELECT @post_id := `post_id` as `post_id`,@user_id := `user_id` as `user_id`,(SELECT `username` FROM `user` WHERE `user_id` = @user_id) as username,"+
      " `post_text`,(SELECT count(*) FROM `post_reply` WHERE `post_id` = @post_id) as no_replies \n\
        from `posts` WHERE `post_id` = ? LIMIT 1",[post_id],function(err, rows, fields) {
   //console.log(query.sql);
   
    if (!err){
                
           if(rows.length > 0){
                   var post_info = {
                        user_id:rows[0]['user_id'],
                        post_id:rows[0]['post_id'],
                        username:rows[0]['username'],
                        post_text:rows[0]['post_text'],
                        no_replies:rows[0]['no_replies'],
                    }
                callback({status:1,data:post_info,message:"Success"});
           }else{
               callback({status:0,message:"No posts"});
           }
        
    }else{console.log("errror in sql syntax "+err);}
 });
}
function getPostReplies(connection,data,callback){
 
    var query = connection.query("SELECT @reply_id := `reply_id` as `reply_id`,@user_id := `user_id` as `user_id`,(SELECT `username` FROM `user` WHERE `user_id` = @user_id) as username,"+
      " `reply_text`,CASE WHEN (TIMESTAMPDIFF(SECOND,`post_reply`.`created_at`,CURRENT_TIMESTAMP()))   < 60"+
				" THEN  Concat((TIMESTAMPDIFF(SECOND,`post_reply`.`created_at`,CURRENT_TIMESTAMP())),' secs ago')"+
		                " WHEN (TIMESTAMPDIFF(MINUTE,`post_reply`.`created_at`,CURRENT_TIMESTAMP()))  < 60"+
		                " THEN  Concat((TIMESTAMPDIFF(MINUTE,`post_reply`.`created_at`,CURRENT_TIMESTAMP())),' min ago')"+
				" WHEN (TIMESTAMPDIFF(HOUR,`post_reply`.`created_at`,CURRENT_TIMESTAMP()))  <= 24"+
				" THEN  Concat((TIMESTAMPDIFF(HOUR,`post_reply`.`created_at`,CURRENT_TIMESTAMP())),' hours ago')"+
				" WHEN (TIMESTAMPDIFF(DAY,`post_reply`.`created_at`,CURRENT_TIMESTAMP()))  <= 30"+
				" THEN  Concat((TIMESTAMPDIFF(DAY,`post_reply`.`created_at`,CURRENT_TIMESTAMP())),' days ago')"+
				" WHEN (TIMESTAMPDIFF(MONTH,`post_reply`.`created_at`,CURRENT_TIMESTAMP()))  <= 12"+
				" THEN  Concat((TIMESTAMPDIFF(MONTH,`post_reply`.`created_at`,CURRENT_TIMESTAMP())),' months ago')"+
				" WHEN (TIMESTAMPDIFF(YEAR,`post_reply`.`created_at`,CURRENT_TIMESTAMP()))  >= 1"+
				" THEN  Concat((TIMESTAMPDIFF(YEAR,`post_reply`.`created_at`,CURRENT_TIMESTAMP())),' years ago')"+
				" END AS time_gone \n\
        from `post_reply` WHERE ? ",{post_id:data.post_id},function(err, rows, fields) {
   //console.log(query.sql);
   
    if (!err){
                
           if(rows.length > 0){
               var dataArray = [];
               for(var i= 0; i < rows.length; i++){
                   var reply_info = {
                        user_id:rows[i]['user_id'],
                        post_id:data.post_id,
                        username:rows[i]['username'],
                        reply_text:rows[i]['reply_text'],
                        time_gone:rows[i]['time_gone'],
                        no_replies:rows[i]['no_replies']
                    }
                    
                    dataArray.push(reply_info);
               }
                getPostData(connection,data.post_id,function(result){
                    var allData ={
                        postData:result,
                        replyData:dataArray
                    }
                    callback({status:1,data:allData,message:"Success"});
                });
           }else{
                getPostData(connection,data.post_id,function(result){
                    var allData ={
                        postData:result,
                    }
                   callback({status:0,message:"No Replies",data:allData});
                });
           }
        
    }else{console.log("errror in sql syntax "+err);}
 });
}
function insertReply(connection,data,callback){
     
     var insertDetails = {
         post_id:data.post_id,
         reply_text:data.reply_text,
         user_id:1,
     }
     
      var query = connection.query('INSERT INTO post_reply SET ?', insertDetails, function(err, result) {
       if(!err){
           var reply_info = {
            user_id:1,
            post_id:data.post_id,
            username:"Chrisadriane",
            reply_text:data.reply_text,
            time_gone:"Just Now",
         }
          callback({status:1,message:"Successful reply Insertion",data:[reply_info]});
       }else{
           console.log(err);
           callback({status:0,message:"Error while inserting reply"}); 
       }
       
      });
  }

exports.insertReply = insertReply;
exports.getPosts = getPosts;
exports.getPostReplies = getPostReplies;
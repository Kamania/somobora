var getIdentifyImageQuestions = function(connection,data,callback){
    
    var query = connection.query("SELECT * from `questions`  LEFT JOIN `identify_image` ON `questions`.`q_id` = `identify_image`.`q_id` ",function(err, rows, fields) {
    console.log(query.sql);
     if (!err){
      if(rows.length > 0){
          
          var dataArray = [];
          
          for(var i = 0; i < rows.length; i++){
             var userDetail = {
               question:rows[i]['question'],
               image_path:rows[i]['image_path'],
               correct_answer:rows[i]['correct_answer'],
               opt1:rows[i]['opt1'],
               opt2:rows[i]['opt2'],
               opt3:rows[i]['opt3'],
               index:i+1
             }
             dataArray.push(userDetail);
          }
             console.log(dataArray);
             callback({status:1,data:dataArray});
      }else{
          console.log("getQuestions has no data");
          var userDetail = {
             status:0
          }
          callback(userDetail);    
      }

    }else{
         console.log("errror in sql syntax<getQuestions> "+err);
           var userDetail = {
               success:0
            }
            callback(userDetail);
    }
  });
}
var getSelectPicQuestions = function(connection,data,callback){
    
    var query = connection.query("SELECT * from `questions`  LEFT JOIN `select_picture` ON `questions`.`q_id` = `select_picture`.`q_id` ",function(err, rows, fields) {
    console.log(query.sql);
     if (!err){
      if(rows.length > 0){
          
          var dataArray = [];
          
          for(var i = 0; i < rows.length; i++){
             var userDetail = {
               question:rows[i]['question'],
               image_path_1:rows[i]['image_path1'],
               image_path_2:rows[i]['image_path2'],
               image_path_3:rows[i]['image_path3'],
               correct_answer:rows[i]['correct_answer'],
               index:i+1
             }
             dataArray.push(userDetail);
          }
             console.log(dataArray);
             callback({status:1,data:dataArray});
      }else{
          console.log("getQuestions has no data");
          var userDetail = {
             status:0
          }
          callback(userDetail);    
      }

    }else{
         console.log("errror in sql syntax<getQuestions> "+err);
           var userDetail = {
               success:0
            }
            callback(userDetail);
    }
  });
}
exports.getIdentifyImageQuestions = getIdentifyImageQuestions;
exports.getSelectPicQuestions = getSelectPicQuestions;



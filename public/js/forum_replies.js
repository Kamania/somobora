 $(function () {

   
   var post_id = getCookie("post_id");
   
   $.ajax({type: "POST",  url: "getPostReplies", data:{post_id:post_id}
    }).done(function (res) {
        if(res["status"] == 1){
           handleData(res["data"],true);
        }else{
            handleData(res["data"],false);
        }
    });
    
  $("#replyForm").submit(function (e) {
      e.preventDefault();
      
        var reply_text = $("#reply_field").val();

        var replyData = {
            post_id: post_id,
            reply_text: reply_text
        };
    
        $.ajax({
          type: "POST",
          url: "replyPost",
          data:replyData
         }).done(function (res) {
             if(res["status"] == 1){
                 $("#reply_field").val("");
                  handleReplies(res.data,true);
             }else{
                 alert(res["message"]);
             }
            
         });
    
    });
    
    function handleData(data,hasReplies){
        var postData = data.postData.data;
     
        $("#post_text").text(postData.post_text);
        $("#username_poster").text("By @"+postData.username);
        $("#no_replies").attr("no_replies",postData.no_replies);
        $("#no_replies").text(postData.no_replies+" Replies");
        if(hasReplies){
              handleReplies(data.replyData,false); 
        }
    }
   
    function handleReplies(data,byMe){
           console.log(data)
         $("#posts_holder").empty();
         
         if(byMe){
             var no_replies = parseInt($("#no_replies").attr("no_replies")) + 1;
            $("#no_replies").text(no_replies+" Replies");
         }
         
        for(var i = 0; i < data.length; i++){
            
            var post_id = data[i].post_id;
            var reply_text = data[i].reply_text;
            var username = data[i].username;
            var time_gone = data[i].time_gone;
            
              var content = '<div class="box-comment" > '+
                                '<img class="img-circle img-sm" src="img/user1-128x128.jpg" alt="User Image">'+
                                '<div class="comment-text" >'+
                                '<span class="username">'+username+'<span class="text-muted pull-right">'+time_gone+'</span>'+
                                '</span>'+reply_text+
                                '</div>'+
                              '</div>';
               $("#reply_box").append(content);       
          }
              
    }
    
 });

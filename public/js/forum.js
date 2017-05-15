 $(function () {

    var socket = io.connect();
    var categoryName = decodeURI((RegExp("category" + '=' + '(.+?)(&|$)').exec(location.search)|| [, null])[1]);
    if(categoryName != "null"){
            $("#category_crumb").text(categoryName);
            $("#li_"+categoryName).addClass("active");
    }
    
    
    $("#onlineUsersDiv").hide();
   
   
   $.ajax({
     type: "POST",
     url: "getPosts",
     data:{category_id:categoryName}
    }).done(function (res) {
        if(res["status"] == 1){
           $("#no_posts_div").addClass("hidden");
           handlePosts(res["data"]);
        }else{
           $("#no_posts_div").removeClass("hidden");
        }
    });
   
   $("#loginForm").submit(function (e) {
      e.preventDefault();
      
    var password = $("#password").val();
    var email = $("#email").val();

    var loginData = {
        password: password,
        email: email
    };
    
    
   $.ajax({
     type: "POST",
     url: "login",
     data:loginData
    }).done(function (res) {
        if(res.success == 1){
            $("#ask_login_box").addClass("hidden");;
            $("#ask_post_box").removeClass("hidden");
            $('#login_modal').modal('hide');
        }else{
            alert("Could n!!");
        }
    });
    
    });
    
   $("#loginForm").submit(function (e) {
      e.preventDefault();
      
    var password = $("#password").val();
    var email = $("#email").val();

    var loginData = {
        password: password,
        email: email
    };
    
    
   $.ajax({
     type: "POST",
     url: "login",
     data:loginData
    }).done(function (res) {
        if(res.success == 1){
            $("#ask_login_box").addClass("hidden");;
            $("#ask_post_box").removeClass("hidden");
            $('#login_modal').modal('hide');
        }else{
            alert("Invalid credentials !!");
        }
    });
    
    });
    
    socket.on("onlineUsers",function(theData){
        for(var i = 0; i < theData.length; i++){
            var data = theData[i];
            var username = data.username;
            var user_id = data.user_id; 
            $("#onlineUsersHolder").append('<div class="contact" data="'+user_id+'">'+
                                '<img src="img/avatar5.png" alt="" class="contact__photo" />'+
                              '<span class="contact__name" >'+username+'</span>'+
                              '<span class="contact__status online"></span>'+
                            '</div>');
        }
        $("#onlineUsersDiv").show();
       
        
    });
    
    socket.on("gotOnline",function(data){
        var username = data.username;
        var user_id = data.user_id;
        $("#onlineUsersHolder").append('<div class="contact" data="'+user_id+'">'+
                                '<img src="img/avatar5.png" alt="" class="contact__photo" />'+
                              '<span class="contact__name" >'+username+'</span>'+
                              '<span class="contact__status online"></span>'+
                            '</div>');
    });
    
    function handlePosts(data){
       $("#posts_holder").empty();
        for(var i = 0; i < data.length; i++){
             var post_id = data[i].post_id;
            var post_text = data[i].post_text;
            var username = data[i].username;
            var no_replies = data[i].no_replies;
            var time_gone = data[i].time_gone;
            
           var content  = '<div class="media box box-widget topic" key='+post_id+'>'+
            ' <a>'+
                ' <div class="media-left">'+
                    ' <a href="#"><img class="media-object img" src="img/user1-128x128.jpg" alt="User Image"></a>'+  
                ' </div>'+
                ' <div class=" box-body media-right ">'+
                    ' <div class="media-body">'+
                        ' <span class="media-heading name">'+post_text+'</span>'+
                        ' <p class="text-muted">Last post '+time_gone+'</p>'+
                    ' </div>'+
                ' </div>'+
                ' <div class="chat_footer box-footer">'+
                    ' <a class=" text-muted">@'+username+'</a>'+
                    ' <span class="reply_text pull-right">'+no_replies+' Replies </span>'+   
                ' </div>'+
            ' </a>'+
        ' </div>';
        $("#posts_holder").append(content);
        }
        
        $(".topic").click(function(){
            var post_id = $(this).attr("key");
            window.location = "forum_replies";
            setCookie("post_id",post_id,1);
        });
    
    }
    
    
 });

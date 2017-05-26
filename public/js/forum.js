 $(function () {

    var socket = io.connect();
    var categoryName = decodeURI((RegExp("category" + '=' + '(.+?)(&|$)').exec(location.search)|| [, null])[1]);
    
    if(categoryName != "null"){
            $("#category_crumb").text(categoryName);
            $("#li_"+categoryName).addClass("active");
    }else{
         categoryName = "trending";
         $("#category_crumb").text(categoryName);
         $("#li_trending").addClass("active");
    }
    
    var user_id = getCookie("user_id");
    if( user_id != null && user_id != -1 ){
  
         $("#ask_login_box").addClass("hidden");;
        $("#ask_post_box").removeClass("hidden");
    }else{
          $("#ask_login_box").removeClass("hidden");;
        $("#ask_post_box").addClass("hidden");
      
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
   
 $("#registerForm").submit(function (e) {
      e.preventDefault();
      
    var password = $("#r_password").val();
    var conf_password = $("#conf_password").val();
    var email = $("#r_email").val();
    
    if(password && conf_password && email){
        
        if(password != conf_password){
            alert("Passwords don't match !");
        }else{
            var regData = {
                password: password,
                email: email
            };
            $.ajax({
              type: "POST",
              url: "registerUser",
              data:regData
             }).done(function (res) {
                 if(res.success == 1){
                     $("#ask_login_box").addClass("hidden");;
                     $("#ask_post_box").removeClass("hidden");
                     $('#register_modal').modal('hide');
                     $("#profile_modal").modal("show");
                      setCookie("user_id",res.user_id);
                 }else{
                     alert("Could n!!");
                 }
             });
     }
    }else{
        alert("Please fill all the fields !");
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
            setCookie("user_id",res.user_id);
            setCookie("username",res.username);
            setCookie("profile_photo",res.profile_photo);
        }else{
            alert("Invalid credentials !!");
        }
    });
    
    });
    
    function readUrl(input,field){
         if(input.files && input.files[0]){
            var reader = new FileReader();
             reader.onload = function(e){
                  if(field == "post"){
                       $('#post_img').attr('src',e.target.result);
                  }else if(field == "profile"){
                       $('#profile_img').attr('src',e.target.result);
                  }
             }
             reader.readAsDataURL(input.files[0]);
         }
    }
     var formData = new FormData();
     
    $('#post_input_file').on('change', function(){
        
       formData = new FormData();
       var files = $(this).get(0).files; 
       readUrl(this,"post");
        if (files.length > 0){
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            formData.append('uploads[]', file, file.name);
          }
      }
    });
    
      $('#profile_input_file').on('change', function(){
            formData = new FormData();
            var files = $(this).get(0).files;
            readUrl(this, "profile");
            if (files.length > 0) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    formData.append('uploads[]', file, file.name);
                }
            }
       });

    $("#postForm").submit(function (e) {
      e.preventDefault();
        $("#loadingPost").removeClass("hidden");
        upload(formData,'/uploadImagePost');         
    });
    
     $("#profileUploadForm").submit(function (e) {
      e.preventDefault();
        $("#loadingUploadProfile").removeClass("hidden");
        uploadProfile(formData,'/uploadProfile');
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
            var image_path = data[i].image_path;
            
           var content  = '<div class="media box box-widget topic" key='+post_id+'>'+
            ' <a>'+
                ' <div class="media-left">'+
                    ' <a href="#"><img class="media-object img" src="/image_uploads/posts/'+image_path+'" alt="User Image"></a>'+  
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
    function sendPost(image_path){
        var post_text = $("#postTA").val();
        var category_id = $("#selectCategory").val();
        
        var data = {
            category_id:category_id,
            user_id: getCookie("user_id"),
            post_text: post_text,
            topic_id:1,
            has_image:'Y',
            image_path:image_path
        }; 
        
         $.ajax({
          type: "POST",
          url: "createPost",
          data:data
         }).done(function (res) {
             if(res["status"] == 1){
                 $("#postTA").val("");
                 $("#post_modal").modal("hide");
                  location.reload();
             }else{
                 alert(res["message"]);
             }
            
         });
    }
    
    function registerProfile(data){
        
        var username = $("#usernameTa").val();
        
         setCookie("username",username,1);
         setCookie("profile_photo",data.profile_photo,1);
        
        var data = {
            user_id: getCookie("user_id"),
            username: username,
            profile_photo:data.profile_photo,
        }; 
        
         $.ajax({
          type: "POST",
          url: "registerProfile",
          data:data
         }).done(function (res) {
             if(res["status"] == 1){
                 $("#usernameTa").val("");
                 $("#profile_modal").modal("hide");
                
                  location.reload();
             }else{
                 alert(res["message"]);
             }
            
         });
    }
  function uploadProfile(formData,url){
     $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
           registerProfile(data);
      },
      xhr: function() {
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', function(evt) {
          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);
            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');
            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
                $("#loadingUploadProfile").addClass("hidden");
            }
          }
        }, false);

        return xhr;
      }
   });
}  
  function upload(formData,url){
     $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n' + data);
           sendPost(data.fileName);
      },
      xhr: function() {
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', function(evt) {
          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);
            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');
            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
                $("#loadingPost").addClass("hidden");
               
              return 0;
            }
          }
        }, false);

        return xhr;
      }
   });
}  
    
 });

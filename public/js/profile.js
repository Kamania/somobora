 $(function () {
     
      $.ajax({
        type: "POST",
        url: "getUserDetails",
        data:{user_id:getCookie("user_id")}
       }).done(function (res) {
           console.log(getCookie("user_id"));
           if(res["status"] == 1){
               setProfileDetails(res);
           }else{
               alert(res["message"]);
           }

       });
       
       function setProfileDetails(data){
           
           var username = data.username;
           var profile_photo = data.profile_photo;
           setCookie("username",username);
           setCookie("profile_photo",profile_photo);
           
           $(".profile-username").text(username);
           $(".profile-user-img").attr("src","/image_uploads/profile/"+profile_photo);
           
       }
 });

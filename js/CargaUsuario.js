document.addEventListener("DOMContentLoaded", (e) =>{
    "use strict";

    let user_name = document.getElementById("name");
    let user = JSON.parse(localStorage.getItem('usuario'));
    let user_email=document.getElementById("mail");
    
    user_name.innerHTML=user.username;
    user_email.innerHTML=user.email;
});
document.addEventListener("DOMContentLoaded", (e) =>{
    "use strict";
    setTimeout(()=>{
        addDatosUsuario();
    },100);



    function addDatosUsuario(){
            let user_name = document.getElementById("user_name");
            let user = JSON.parse(localStorage.getItem('usuario'));
            let user_email=document.getElementById("mail");
            
            user_name.innerHTML=user.username;
            user_email.innerHTML=user.email;
    }
});
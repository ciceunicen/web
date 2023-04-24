function logout(){
    let btn_close = document.querySelector(".closeSession"); 
    
    btn_close.addEventListener("click", () => {
        localStorage.removeItem("token");
        console.log("token destroy");

        /* window.location.replace("../html/login.html"); */ //Cambie el .replace debido a que te quita la posibilidad de volver para atras en historial
        window.location.href = "../html/login.html"; //Redirigo a Login 
    })
}
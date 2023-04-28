function logout(param = ".."){ //Si no viene nada default ".." Esto es debido a que si se hacia logout en la pagina principal "index", se iba de carpeta por demas
    let btn_close = document.querySelector(".closeSession"); 
    
    btn_close.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        /* window.location.replace("../html/login.html"); */ //Cambie el .replace debido a que te quita la posibilidad de volver para atras en historial
        window.location.href = `${param}/html/login.html`; //Redirigo a Login 
    })
}
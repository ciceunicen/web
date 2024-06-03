document.addEventListener("DOMContentLoaded", (e) =>{
    "use strict";

    let user_name = document.getElementById("name");
    let user = JSON.parse(localStorage.getItem('usuario'));
    
    user_name.innerHTML=user.username;
    logout(); //Debido a que para hacer andar el logout en el resto de la pagina que tiene PR, se tuvo que poner la funcionalidad en una funcion
    //y dicha func se llama desde otros js que se cargan siempre en distintas paginas

    const URL_EMPRENDEDORES = "http://localhost:8080/emprendedores"
    const tokin = localStorage.getItem("token");
    obtenerUsuarios(URL_EMPRENDEDORES);

    document.querySelector("#btn-back").addEventListener("click", ()=>{
        window.location.replace('./dashboard.html');
    });

    async function obtenerUsuarios(url) {

        console.log("El token es: " + tokin)
        try {
            let respuesta = await fetch(url, {
                "method": "GET",
                "headers": {
                    "Authorization": "Bearer " + tokin

                },
            })
            if (respuesta.ok) {
                let arreglo = await respuesta.json();
                console.log(arreglo);

                if (arreglo) {
                    cargarUsuarios(arreglo); ///



                    buttons_action();
                }
            }
        } catch (error) {
            console.log("Fallo al obtener el JSON de la API.");
            console.log(error);
        }
    }
});
document.addEventListener("DOMContentLoaded", (e) =>{
    "use strict";

    let user_name = document.getElementById("name");
    let user = JSON.parse(localStorage.getItem('usuario'));
    
    user_name.innerHTML=user.username;
    logout(); //Debido a que para hacer andar el logout en el resto de la pagina que tiene PR, se tuvo que poner la funcionalidad en una funcion
    //y dicha func se llama desde otros js que se cargan siempre en distintas paginas

    const URL_EMPRENDEDORES = "http://localhost:8080/emprendedores";
    const URL_ROL_USER = "http://localhost:8080/usuarios";
    const tokin = localStorage.getItem("token");
    obtenerUsuarios(URL_EMPRENDEDORES);

    document.querySelector("#btn-back").addEventListener("click", ()=>{
        window.location.replace('./dashboard.html');
    });

    async function obtenerUsuarios(url) {

        console.log("El token es: " + tokin)
        try {
            let respuesta = await fetch(url+"/Solicitudes", {
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
    let tabla = document.querySelector("#lista"); ////
    function cargarUsuarios(arregloUsuarios) {
        tabla.innerHTML = "";
        let datosUsuario = "";
        arregloUsuarios.forEach(usuario => {
            datosUsuario = "";
            if (!usuario.is_deleted) {
                datosUsuario =
                    `<td>${usuario.cuil_cuit}</td>
                <td>${usuario.email}</td>
                <td>${usuario.name+ " "+usuario.surname}</td>
                <td>${usuario.phone}</td>`
                datosUsuario += "<td > <button class='btn_save_rol btn-detalles btn-Aceptar' id='btnAceptar' data-id = '" + usuario.id + "'>Aceptar solicitud</button>";
            } 
            tabla.innerHTML += `<tr>${datosUsuario}</tr>`
        });
    }
    function buttons_action(){
        let btnsAceptarSolicitud= document.querySelectorAll(".btn-Aceptar");
        btnsAceptarSolicitud.forEach(btn=>{
            btn.addEventListener('click',e=>{
                 changeRol(btn.getAttribute("data-id"),btn);
            })
        })
    }
   
    
    //Modificar metodo para setear la columna is aceptada en entrepreneur y cambiar el rol del usuario a 3(emprendedor);

    async function changeRol(idUser,btn) {

       

       
        if (btn.textContent == 'Aceptar solicitud')
           btn.textContent='Deshacer cambios';
        else
          btn.textContent='Aceptar solicitud';

        try {
            let response = await fetch(URL_EMPRENDEDORES + "/" + idUser + "/validado", {
                "method": "PUT",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + tokin
                },
                // "body": JSON.stringify({


                //     "id": newId

                // })

                
            });

            if (response.ok) {
                const json = await response.json();
                console.log(json);
                obtenerUsuarios(URL_EMPRENDEDORES);
            } else if (response.status == 401) { // Unathorized
                console.error("No tiene los permisos para realizar esta acción");
            }
        } catch (e) {
            console.log(e)
        }



    }
});
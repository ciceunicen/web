document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    logout(); //Debido a que para hacer andar el logout en el resto de la pagina que tiene PR, se tuvo que poner la funcionalidad en una funcion
    //y dicha func se llama desde otros js que se cargan siempre en distintas paginas

    const URL_ROL_USER = "http://localhost:8080/usuarios"
    const tokin = localStorage.getItem("token");
    obtenerUsuarios(URL_ROL_USER);

    function buttons_action() {
        let btnsRol = document.querySelectorAll('.btn-detalles');
        btnsRol.forEach(btn => {
            btn.addEventListener("click", e => {
                changeRol(btn.getAttribute("data-id"), btn.innerHTML);
            })
        })
    }

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

    let tabla = document.querySelector("#lista"); ////

    function cargarUsuarios(arregloUsuarios) {
        tabla.innerHTML = "";
        arregloUsuarios.forEach(usuario => {
            if (usuario.role.id == 2 || usuario.role.id == 4) { //sòlo se muestran los usuarios que pueden ser admin, o los admin
                /* let datosUsuario =
                    `<td>${usuario.name}</td>
                <td>${usuario.surname}</td>
                <td>${usuario.email}</td>
                <td>${usuario.role.type}</td> ` */
                let datosUsuario =
                    `<td>${usuario.username}</td>
                <td>${usuario.email}</td>
                <td>${usuario.role.type}</td> `
                if (usuario.role.id == 2) {
                    datosUsuario += "<td > <button class='btn_save_rol btn-detalles'  data-id = '" + usuario.id + "'>Remover Admin</button>";
                } else if (usuario.role.id == 4) {
                    datosUsuario += "<td > <button class='btn_save_rol btn-detalles'  data-id = '" + usuario.id + "'>Agregar Admin</button> <button class='btn_delete_user btn-detalles'  data-id = '" + usuario.id + "'>Eliminar usuario</button>";
                }
                tabla.innerHTML += `<tr>${datosUsuario}</tr>`
            }
        });
    }

    async function changeRol(idUser, btnLabel) {

        /* btnText = document.getAttribute("data-id");
        console.log(btnText); */

        let newId;
        if (btnLabel == "Remover Admin")
            newId = 4;
        else
            newId = 2;

        try {
            let response = await fetch(URL_ROL_USER + "/" + idUser + "/rol", {
                "method": "PUT",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + tokin
                },
                "body": JSON.stringify({


                    "id": newId

                })


            });

            obtenerUsuarios(URL_ROL_USER);
        } catch (e) {
            console.log(e)
        }



    }

    /*  mostrar(array)

      async function mostrar(array) {
          let tabla = document.getElementById("lista");
          tabla.innerHTML = '';

          try {

              if (array.length > 0) {
                  for (let elem of array) {
                      let col1 = "<td >" + elem.nombre + "</td>";
                      let col2 = "<td >" + elem.apellido + "</td>";
                      let col3 = "<td >" + elem.email + "</td>";
                      let col4 = "<td >" + elem.rol + "</td>"
                      if (elem.rol.id == 1) {
                          let col5 = "<td > <button class='btn_save_rol btn-detalles'  data-id = '" + elem.id + "'>Remover Admin</button>";
                      }
                      tabla.innerHTML += "<tr>" + col1 + col2 + col3 + col4 + col5 + "</tr>";
                  }
              } else {
                  tabla.innerHTML += "<tr> No hay nada para mostrar </tr>";
              }
              //                                                                ver mas
              let eliminar = document.querySelectorAll(".btn-detalles");
              for (let elem of eliminar) {
                  elem.addEventListener("click", function() {
                      verDetalles(this.getAttribute("data-id"));
                  });
              }
          } catch (e) {
              console.log(e)
          }
      }

      async function verDetalles(id) {
          try {
              console.log(id)
          } catch (e) {}
      }

      document.getElementById("busqueda").addEventListener("keyup", function() {

          let seach = this.value;
          newArray = array.filter(function(valor) {
              if (valor.rol.includes(seach) || valor.email.includes(seach)) {

                  let resultado = { rol: valor.rol, email: valor.email }
                  return resultado;
              }
          })
          mostrar(newArray)
      })*/
})
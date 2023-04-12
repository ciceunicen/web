document.addEventListener("DOMContentLoaded", async(e) => {
    "use strict";
    const URL_ROL_USER = "http://localhost:8080/usuarios"

    obtenerUsuarios(URL_ROL_USER);

    async function obtenerUsuarios(url) {
        try {
            let respuesta = await fetch(url);
            if (respuesta.ok) {
                let arreglo = await respuesta.json();

                if (arreglo) {
                    cargarUsuarios(arreglo); ///
                    console.table(arreglo);
                    console.log("Es mayor a 0");
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
            let datosUsuario =
                `<td>${usuario.name}</td>
            <td>${usuario.surname}</td>
            <td>${usuario.email}</td>
                 <td>${usuario.rol.type}</td> `

            tabla.innerHTML +=
                `<tr>${datosUsuario}</tr>`
        });
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
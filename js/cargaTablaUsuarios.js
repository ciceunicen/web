document.addEventListener("DOMContentLoaded", (e) => {

    let newArray = [];
    let array = [
        {
            id: 1,
            nombre: "nombre 1",
            apellido: "apellido 1",
            email: "email@1",
            rol: "admin"
        },
        {
            id: 2,
            nombre: "nombre 2",
            apellido: "apellido 2",
            email: "email@2",
            rol: "super"
        },
        {
            id: 3,
            nombre: "nombre 3",
            apellido: "apellido 3",
            email: "email 3",
            rol: "emprendedor"
        },
    ]

    mostrar(array)

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
                    let col5 = "<td > <button class='btn_save_rol btn-detalles'  data-id = '" + elem.id + "'>detalles</button>";
                    tabla.innerHTML += "<tr>" + col1 + col2 + col3 + col4 + col5 + "</tr>";
                }
            } else {
                tabla.innerHTML += "<tr> No hay nada para mostrar </tr>";
            }
            //                                                                ver mas
            let eliminar = document.querySelectorAll(".btn-detalles");
            for (let elem of eliminar) {
                elem.addEventListener("click", function () {
                    verDetalles(this.getAttribute("data-id"));
                });
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    async function verDetalles(id) {
        try {
            console.log(id)
        }
        catch (e) {
        }
    }

    document.getElementById("busqueda").addEventListener("keyup", function () {

        let seach = this.value;
        newArray = array.filter(function (valor) {
            if (valor.rol.includes(seach) || valor.email.includes(seach)) {

                let resultado = { rol: valor.rol, email: valor.email }
                return resultado;
            }
        })
        mostrar(newArray)
    })
})

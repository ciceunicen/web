document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    logout();

    let url_editar_usuario = "http://localhost:8080/usuarios";

    let formEditarUsuario = document.getElementById("editar-datos-usuario"); //formulario
    let textPasswordStatus = document.getElementById("status-text");
    let textPasswordLength = document.getElementById('status-length');
    let btn_confirmar = document.querySelector('.form-submit-btn input');

    const checkEditarUsuarioInput = () => {
        let inputs = formEditarUsuario.querySelectorAll('input');
        return Array.from(inputs).every(input => {
            return input.value.trim().length >= 1;
        });
    }

    formEditarUsuario.addEventListener("submit", (e) => {
        e.preventDefault();
        editarUsuario();
    });

    document.querySelectorAll('.input-eye').forEach(fieldPassword => {
        fieldPassword.addEventListener("input", () => {
            checkPasswords();
        });
    });

    checkInputs();

    let btns_eyes = document.querySelectorAll(".eyes");
    for (const eye of btns_eyes) {
        eye.addEventListener("click", () => {
            let input = eye.previousElementSibling;

            if (input.type == 'password') {
                input.type = 'text'
                eye.innerHTML = ' <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"></path><path d="m1 1 22 22"></path><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>'
            } else {
                input.type = 'password'
                eye.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><path d="M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6z"></path>'
            }
        });
    }

    function checkPasswords() {
        let passwords = document.querySelectorAll('.input-eye');
        if (passwords[0].value !== passwords[1].value) {
            textPasswordStatus.innerHTML = "Las contraseñas no coinciden";
            passwords.forEach(p => {
                p.classList.add('wrong-status');
            });
        } else {
            textPasswordStatus.innerHTML = "";
            passwords.forEach(p => {
                if (p.classList.contains('wrong-status'))
                    p.classList.remove('wrong-status');
            });
        }
    }

    function checkInputs() {
        document.querySelectorAll('.editar_usuario').forEach(i => {
            let inputs = i.querySelectorAll('input');


            inputs.forEach(input => {
                input.onkeyup = () => {
                    if (checkEditarUsuarioInput()) {// Habilitar el botón de confirmar si los datos son válidos
                        btn_confirmar.removeAttribute('disabled');
                    } else {
                        // Deshabilitar el botón de confirmar si los datos no son válidos
                        btn_confirmar.setAttribute('disabled', 'true');
                    }
                };
            });
        });
    }

    async function editarUsuario() {

        let valoresInputs = getDatos();
        let datosEditarUsuario = JSON.stringify(valoresInputs);

        let usuarioGuardado = localStorage.getItem('usuario');
        let usuarioLogueado = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

        //si existe usuarioLogueado y si tiene un id procede
        if (usuarioLogueado && usuarioLogueado.id) {
            let id_usuario = usuarioLogueado.id;
            url_editar_usuario = `http://localhost:8080/usuarios/${id_usuario}`;

            try {
                let response = await fetch(url_editar_usuario, {
                    "method": "PUT",
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    },
                    "body": datosEditarUsuario,
                });
                let data = await response.json();

                if (!response.ok) {
                    throw { error: data.error, status: data.status }
                } else {
                    // Actualiza el email en el objeto del usuario en el localStorage para que
                    // se muestre correctamente en dashboard al redirigir
                    let usuarioActualizado = localStorage.getItem('usuario');
                    usuarioActualizado = usuarioActualizado ? JSON.parse(usuarioActualizado) : null;

                    if (usuarioActualizado) {
                        usuarioActualizado.email = valoresInputs.email;
                        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
                    }
                    alert("Datos actualizados con exito");
                    window.location.href = "./dashboard.html";
                }
            }
            catch (e) {
                console.error("Error en editarUsuario:", e);
                let errorMessage = e.error || 'Hubo un error al actualizar los datos. Por favor, intentelo nuevamente';
                alert(errorMessage);
            }
        } else {
            console.error('No se pudo obtener el ID del usuario.');
            window.location.href = "./login.html";
        }
    }

    function getDatos() {
        let username = document.getElementById("username").value;
        let email = document.getElementById("email").value;
        let currentPassword = document.getElementById("currentPassword").value;
        let newPassword = document.getElementById("newPassword").value;

        return {
            "username": username,
            "email": email,
            "currentPassword": currentPassword,
            "newPassword": newPassword,
        };
    }

});

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    logout();

    const URL_EDITAR_USUARIO = "http://localhost:8080/editar_usuario";

    let formEditarUsuario = document.getElementById("editar-datos-usuario"); //formulario
    let textPasswordStatus = document.getElementById("status-text");
    let textPasswordLength = document.getElementById('status-length');
    let btn_confirmar = document.querySelector('.form-submit-btn input');
    let existingUserError = document.getElementById("existingUserError");
    let invalidMailError = document.getElementById("invalidMailError");

    formEditarUsuario.addEventListener("submit", (e) => {
        e.preventDefault();
        editarUsuario();
    });
    document.querySelectorAll('.input-eye').forEach(fieldPassword => {
        fieldPassword.addEventListener("keyup", () => {
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

    const checkEditarUsuarioInput = () => {
        let inputs = formEditarUsuario.querySelectorAll('input');
        return Array.from(inputs).every(input => {
            return input.value.trim().length >= 1;
        });
    }

    /*async function editarUsuario() {
        let valoresInputs = getDatos();
        let datosEditarUsuario = JSON.stringify(valoresInputs);
        try {
            let response = await fetch(URL_EDITAR_USUARIO, {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                },
                "body": datosEditarUsuario,
            });

            //let data = await response.json();

            if (!response.ok) {
                let errorText
                switch(response.status){
                    case 400: //"Bad request", el email esta mal formateado
                        invalidMailError.style.display="block";
                        errorText = "Bad Request"
                        break;
                    case 409: //"Conflict", el email ya existe
                        existingUserError.style.display="block";
                        errorText = "Conflict"
                        break;
                    case 422: //"Unprocessable Entity", la contraseña es del largo equivocado (menor a 8 caracteres o mayor a 20)
                        textPasswordLength.style.display="block";
                        errorText = "Unprocessable Entity"
                        break;
                    default:
                        errorText = "Error"
                }
                throw { error: response.status , status: errorText }
            } else {
                invalidMailError.style.display="none";
                existingUserError.style.display="none";
                textPasswordLength.style.display="none";
                success();
                window.location.href = "./dashboard.html";

                console.log("Usuario editado exitosamente");
            }
        } catch (e) {
            console.error(e);
        }
    }*/
    async function editarUsuario() {

        let valoresInputs = getDatos();
        let datosEditarUsuario = JSON.stringify(valoresInputs);
        try {

            let response = await fetch(URL_EDITAR_USUARIO, {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                },
                "body": datosEditarUsuario,
            });
            let data = await response.json();
            if (!response.ok) {
                throw { error: data.error, status: data.status }
            } else {
                window.location.replace("http://localhost/proyectos/CICE/web/")
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    function getDatos() {
        let username = document.getElementById("username").value;
        let email = document.getElementById("email").value;
        let newPassword = document.getElementById("password").value;

        return {
            "username": username,
            "email": email,
            "newPassword": newPassword,
        };
    }

    function success() {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Datos actualizados exitosamente',
            showConfirmButton: false,
            timer: 2000,
        })
    }
});
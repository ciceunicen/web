document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    logout();

    let url_editar_usuario = "http://localhost:8080/usuarios";

    let formEditarUsuario = document.getElementById("editar-datos-usuario"); //formulario
    let textPasswordStatus = document.getElementById("status-text");
    let textPasswordLength = document.getElementById('status-length');
    let btn_confirmar = document.querySelector('.form-submit-btn input');

    document.querySelector("#btn-back").addEventListener("click", ()=>{
        window.location.replace('./dashboard.html');
    });

    const checkEditarUsuarioInput = () => {
        let inputs = formEditarUsuario.querySelectorAll('input');
        return Array.from(inputs).every(input => {
            return input.value.trim().length >= 1;
        });
    }

    formEditarUsuario.addEventListener("submit", (e) => {
        e.preventDefault();
        quitarMensajesDeErrores();
        editarUsuario();
    });

    function quitarMensajesDeErrores(){
        // Obtenemos todos posibles mensajes de error
        const mensajes = document.querySelectorAll(".errorMessage");
        // Desactivamos todos
        mensajes.forEach(mensaje => mensaje.classList.add("hidden"));
    }

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

    precargarDatos();

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


    /**
     * Busca en el localstorage el token y en caso 
     * de encontrarlo recupera el id del usuario.
     */
    function extraerIdDelToken(){
        let token = localStorage.getItem('token');
        
        //si el usuario tiene un token y tiene datos en el form procede
        if(!token){ throw new Error("No se encontró ningun token!"); }
        
        // Decodificamos el token del usuario para obtener su payload (la data)
        // El payload del token se encuentra en el atributo "sub" del objeto (id,email)
        let decodedToken = jwt_decode(token);

        return decodedToken.sub.split(",")[0];
    }

    async function editarUsuario() {
        let formValues;

        // Al intentar enviar el form se verifica que info sea valida, sino ni siquiera se envia el form.
        formValues = getDatosDelForm();
        if(!formValues) return;
        
        let idUsuario = extraerIdDelToken(); 
        
        let urlEditarUsuario = `http://localhost:8080/usuarios/${idUsuario}/datos`;
        
        const formContainer = document.querySelector(".container_form_input");
        const popup = document.createElement("div");
        popup.classList.add("popup");

        try {
            let response = await fetch(urlEditarUsuario, {
                "method": "PUT",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
                "body": formDataToJSON(formValues),
            });
            
            if (!response.ok) {
                popup.classList.add("popupError");
                // TODO: Aca se va a romper, ya que ahora los errores desde el back los envia como un JSON, no como un texto
                // TODO: cambiar el response.text() por un response.json();
                let errorMessage = await response.text();
                popup.innerText = errorMessage;
                console.error(`Error (${response.status}): ${errorMessage}`);
            } else {
                popup.classList.add("popupSuccess");
                popup.innerText = "Datos editados exitosamente!";
                
                let usuarioActualizado = localStorage.getItem('usuario');
                usuarioActualizado = usuarioActualizado ? JSON.parse(usuarioActualizado) : null;

                if (usuarioActualizado) {
                    usuarioActualizado.email = formValues.get("email");
                    usuarioActualizado.name = formValues.get("name");
                    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
                }
            }
        }
        catch (e) {
            console.error("Error en editar los datos del usuario:", e);
            let errorMessage = e.error || 'Hubo un error desconocido al actualizar los datos. Por favor, intentelo nuevamente';
            popup.innerText = errorMessage;
        }

        formContainer.appendChild(popup);
    }


    /**
     * Permite mostrarle al usuario sus datos precargados.
     */
    async function precargarDatos(){
        // Busco en el localstorage la info del usuario
        let res = localStorage.getItem('usuario');
        // Almaceno el email del usuario en la variable localStorageEmail
        let { email: localStorageEmail } = JSON.parse(res);
        
        // Busco los datos del usuario en base a su email
        let urlGetData = `http://localhost:8080/usuarios/email/${localStorageEmail}`;
        let data;
        
        try {
            let response = await fetch(urlGetData, {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                }
            });

            data = await response.json();

            // En caso de que el status no fue un 200 tira el error.
            if (!response.ok) { throw new Error({ error: data.error, status: data.status });} 
        }
        catch (e) {
            console.error("Error al precargar la data del usuario:", e);
            let errorMessage = e.error || 'Hubo un error al precargar los datos del usuario. Por favor, intentelo nuevamente';
            alert(errorMessage);
            return ;
        }
        
        // Saco los atributos del objeto data
        let { username, email } = data;
        
        // actualizo el valor de los inputs en el formulario
        document.getElementById("username").value = username;
        document.getElementById("email").value = email;
    }

    function getDatosDelForm() {
        let form = document.querySelector("#editar-datos-usuario");
        let err = false;
        const formData = new FormData(form);
        if(!formData.get("name")){ document.querySelector("#emptyName").classList.remove("hidden"); err = true; }
        if(!formData.get("email")){ document.querySelector("#emptyEmail").classList.remove("hidden"); err = true; }
        if(!formData.get("email").match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)){ document.querySelector("#invalidEmail").classList.remove("hidden"); err = true; }
        if(!formData.get("currentPassword").match(/^[\s\S]{8,20}$/)){ document.querySelector("#invalidPassword").classList.remove("hidden"); err = true; }
        if(formData.get("newPassword") || formData.get("newPasswordConfirmed")){
            console.log(formData.get("newPassword"));
            console.log(formData.get("newPasswordConfirmed"));
            if(!(formData.get("newPassword") == (formData.get("newPasswordConfirmed")))){document.querySelector("#notMatchingPasswords").classList.remove("hidden"); err = true;}
        }

        // Si hay almenos 1 error devuelve falso
        return err ? false : formData;
    }

    function formDataToJSON(formData){
        const jsonObject = {};
        formData.forEach((value, key) => {
            jsonObject[key] = value;
        });
        
        return JSON.stringify(jsonObject);
    }

});

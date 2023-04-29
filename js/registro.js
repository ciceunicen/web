document.addEventListener("DOMContentLoaded", async () => {
    "use strict";


    const URL_REGISTER = "http://localhost:8080/usuarios";
    const URL_LOGIN = "http://localhost:8080/auth/login";

    let signin_form = document.querySelector('#signin_form');
    let btn_register = document.querySelector('#btn-register');
    let textPassword_status = document.querySelector('#status-text');
    let textPassword_length = document.getElementById('status-length');
    let existingUserError = document.getElementById("existingUserError");
    let invalidMailError = document.getElementById("invalidMailError");

    
    document.querySelectorAll('.input-eye').forEach(field_password => { //checkeo cada vez que escriben en algun campo pw
        field_password.addEventListener("keyup", () => {
            checkPasswords();
        })
    });

    checkInputs();

    document.getElementById("register-form").addEventListener("submit", (e) => {
        e.preventDefault();
        
        register();
    })

    function checkPasswords(){
        let passwords = document.querySelectorAll('.input-eye');
        if (passwords[0].value != passwords[1].value) //los dos campos de password
        {
            textPassword_status.innerHTML = "Contraseñas no coinciden";
            passwords.forEach(p => {
                p.classList.add('wrong-status');
            });
        }
        else{
            textPassword_status.innerHTML = "";
            passwords.forEach(p => {
                if (p.classList.contains('wrong-status'))
                    p.classList.remove('wrong-status');
            });
        }
    }

    function success() {

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Registrado con exito',
            showConfirmButton: false,
            timer: 2000,
        })
    }

    /*function error(err) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: `${err.error} - ${err.status}`,
            showConfirmButton: true,
            // timer: 2000,
        })
    }*/

    function checkInputs() {
        document.querySelectorAll('.signin_form').forEach(i => {
            /* console.log(i) */
            let inputs = i.querySelectorAll('input')   /* Se cambia de QuerySelector a -> QuerySelectorAll debido a que
            al agarrar solo 1 input de cada clase .siging_form, no agarraba el segundo campo de pw y bugeaba el boton de registro */

            inputs.forEach(input => {
                input.onkeyup = () => {
                    if (checkSigninInput()) {
                        btn_register.removeAttribute('disabled')
    
                    } else {
                        btn_register.setAttribute('disabled', 'true')
    
                    }
                }
                
            });
        })
    }

    const checkSigninInput = () => {

        let inputs = signin_form.querySelectorAll('input')
        return Array.from(inputs).every(input => {
            return input.value.trim().length >= 1
        })
    }

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

    async function register() {

        let valoresInputs = getDatosInputsRegitro();

        let datosRegister = JSON.stringify(valoresInputs);

        try {

            let response = await fetch(URL_REGISTER, {
                "method": "POST",

                "headers": {
                    "Content-Type": "application/json",
                },

                "body": datosRegister,
            });

            // let data = await response.json();
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
                        textPassword_length.style.display="block";
                        errorText = "Unprocessable Entity"
                        break;
                    default: 
                        errorText = "Error"
                }
                throw { error: response.status , status: errorText }
            } else {
                invalidMailError.style.display="none";
                existingUserError.style.display="none";
                textPassword_length.style.display="none";
                success();
                setTimeout(() => {
                    //window.location.replace("http://localhost/proyectos/CICE/web/html/login.html")
                    //window.location.href = "./login.html";
                    loguearUser(valoresInputs.email, valoresInputs.password);
                }, 1500)
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function loguearUser(email, pw) { /////////////////////////// Logueamos dps de registrar
        let datosUser = {
            email: email,
            password: pw,
        }
        let datosLogin = JSON.stringify(datosUser);

        try {
            let response = await fetch(URL_LOGIN, {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                },
                "body": datosLogin,
            });

            let data = await response.json();
            
            if (response.ok) {
                localStorage.setItem("token", data.accessToken)
                localStorage.setItem("usuario", JSON.stringify(data.usuario));
                window.location.href = "./dashboard.html";
            }
        } catch (e) {
            console.log(e);
        }
    }

    function getDatosInputsRegitro() {
        let email = document.getElementById("email")?.value;
        let pass = document.getElementById("password")?.value;
        let name = document.getElementById("name")?.value;
        let surname = document.getElementById("surname")?.value;

        return {
            email: email,
            password: pass,
            name: name,
            surname: surname,
        }
      }  
    }
)

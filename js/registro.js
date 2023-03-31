document.addEventListener("DOMContentLoaded", async (e) => {
    "use strict";

    const URL_REGISTER = "http://localhost:8080/usuarios";

    let signin_form = document.querySelector('#signin_form')
    let btn_register = document.querySelector('#btn-register')

    document.getElementById("register-form").addEventListener("submit", () => {
        e.preventDefault();
        register();
    })

    document.querySelectorAll('.signin_form').forEach(i => {
        let input = i.querySelector('input')
        console.log(input)
        input.onkeyup = () => {
            if (checkSigninInput()) {
                btn_register.removeAttribute('disabled')
            } else {
                btn_register.setAttribute('disabled', 'true')
            }
        }
    })

    const checkSigninInput = () => {

        let inputs = signin_form.querySelectorAll('input')
        return Array.from(inputs).every(input => {
            return input.value.trim().length >= 1
        })
    }

    document.getElementById("eye").addEventListener("click", () => {
        e.preventDefault();
        let input = document.getElementById('password')
        let eye = document.getElementById('eye')
        if (input.type == 'password') {
            input.type = 'text'
            eye.innerHTML = ' <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"></path><path d="m1 1 22 22"></path><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>'
        } else {
            input.type = 'password'
            eye.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><path d="M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6z"></path>'
        }
    })

    async function register() {

        let valoresInputs = getDatosInputsLogin();

        let datosRegister = JSON.stringify(valoresInputs);

        try {

            let response = await fetch(URL_REGISTER, {
                "method": "POST",

                "headers": {
                    "Content-Type": "application/json",
                },

                "body": datosRegister,
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

    function getDatosInputsLogin() {
        let email = document.getElementById("email").value;
        let pass = document.getElementById("password").value;
        let name = document.getElementById("name").value;
        let surname = document.getElementById("surname").value;

        return {
            email: email,
            password: pass,
            name: name,
            surname: surname,
        }
    }
})

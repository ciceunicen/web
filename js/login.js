document.addEventListener("DOMContentLoaded", (e) => {
    "use strict";

    const URL_LOGIN = "http://localhost:8080/auth/login";

    /*   let sig_form = document.querySelector('.sig_form')*/
    let btnLog = document.querySelector('#btnLog')
    let btnReg = document.querySelector('#btnReg')
    let loginError = document.getElementById("loginUserPassError")

    checkInputs();

    function checkInputs() {
        document.querySelectorAll('input').forEach(i => {

            i.onkeyup = () => {
                if (checkSigninInput()) {

                    btnLog.removeAttribute('disabled')
                    // btnReg.removeAttribute('disabled')
                } else {

                    btnLog.setAttribute('disabled', 'true')
                    // btnReg.setAttribute('disabled', 'true')
                }
            }
        })
    }
    const checkSigninInput = () => {

        let inputs = document.querySelectorAll('input')

        return Array.from(inputs).every(input => {
            return input.value.trim().length >= 1
        })
    }

    document.getElementById("eye").addEventListener("click", (e) => {
        e.preventDefault();
        let input = document.getElementById('password-login')
        let eye = document.getElementById('eye')
        if (input.type == 'password') {
            input.type = 'text'
            eye.innerHTML = ' <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"></path><path d="m1 1 22 22"></path><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>'
        } else {
            input.type = 'password'
            eye.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><path d="M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6z"></path>'
        }
    })

    document.getElementById("btnReg").addEventListener("click", (e) => {
        e.preventDefault();
        console.log("first")
        //window.location.replace("http://localhost/proyectos/CICE/web/html/registro.html")
        window.location.href("./registro.html")
    })

    document.getElementById("btnLog").addEventListener("click", (e) => {
        e.preventDefault();
        login();
    })

    function success() {

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Sesion iniciada con exito',
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

    async function login() {

        let valoresInputs = getDatosInputsLogin();
        let datosLogin = JSON.stringify(valoresInputs);

        try {

            let response = await fetch(URL_LOGIN, {
                "method": "POST",

                "headers": {
                    "Content-Type": "application/json",
                },
                "body": datosLogin,
            });

            
            if (!response.ok) {
                let errorText
                switch(response.status){
                    case 400: //"Bad request", no se realizo login correctamente
                        loginError.style.display="block";
                        errorText = "Bad Request"
                        break;
                    case 401: //"Unauthorized", el email existe pero las credenciales son incorrectas
                        loginError.style.display="block";
                        errorText = "Unauthorized"
                        break;
                    default: 
                        errorText = "Error"
                }
                throw { error: response.status , status: errorText }
            } else {
                let data = await response.json();
                loginError.style.display="none";
                localStorage.setItem("token", data.accessToken)
                localStorage.setItem("usuario", data.usuario)

                success();
                
                setTimeout(() => {
                    //window.location.replace("http://localhost/proyectos/CICE/web/")
                    window.location.href = "./dashboard.html";
                }, 1500)
            }
        } catch (e) {
            console.log(e)
        }
    }

    function getDatosInputsLogin() {
        let email = document.getElementById("email-login")?.value;
        let pass = document.getElementById("password-login")?.value;
        console.log(email)
        console.log(pass)
        return {
            email: email,
            password: pass,
        }
    }

})


document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    logout();

    const URL_EMPRENDEDORES = "http://localhost:8080/emprendedores";
    const form = document.getElementById('register-emprendedor');
    const submitButton = document.querySelector('.form-submit-btn input');
    // Deshabilitar el botón al cargar la página
    submitButton.disabled = true;
    // Escuchar eventos de entrada en todos los campos del formulario
    form.addEventListener('input', checkFormValidity);

    function checkFormValidity() {
        // Verifica la validez del formulario
        if (form.checkValidity()) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    document.getElementById("fisica").addEventListener("click", () => {

        document.getElementById("div_apellido").style.display = "block";
        document.getElementById("tipo_razon").innerHTML = 'Nombre <span class="requerido">*</span>';
        document.getElementById("name").setAttribute("value", "carga default de nombre de la persona");
        document.getElementById("surname").setAttribute("value", "carga default de apellido de la persona");
        document.getElementById("email").setAttribute("value", "carga default de email de la persona");

    });

    document.getElementById("juridica").addEventListener("click", () => {
        document.getElementById("div_apellido").style.display = "none";
        document.getElementById("tipo_razon").innerHTML = 'Razon Social <span class="requerido">*</span>';
        document.getElementById("name").setAttribute("value", "carga default de razon social de la persona");
    });



    document.getElementById("register-emprendedor")?.addEventListener("submit", (e) => {
        e.preventDefault();
        register();
    })

    document.querySelector("#btn-back").addEventListener("click", ()=>{
        window.location.replace('./dashboard.html');
    });

    async function register() {

        let valoresInputs = getDatos();
        let datosRegister = JSON.stringify(valoresInputs);
        console.log(datosRegister);

        try {
            console.log(localStorage.getItem('token'));
            let response = await fetch(URL_EMPRENDEDORES, {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
                "body": datosRegister,
            });
            let data = await response.json();
            if (!response.ok) {
                throw { error: data.error, status: data.status }
            } else {
                window.location.href = "./dashboard.html";
            }
        }
        catch (e) {
            console.log(e)
        }
    }


    
    function getDatos() {
        /* let id = getUserId() */
        let name = document.getElementById("name").value;
        let surname= document.getElementById("surname").value;
        let email= document.getElementById("email").value;
        let phone= document.getElementById("phoneNumber").value;
        let cuil_cuit = document.getElementById("cuit_cuil").value;
        let howimeetcice= document.getElementById("como_conociste").value;
        let ispf = true
        let fisica = document.getElementById("fisica");
        if(fisica.checked){
            ispf = true
        }else{
            ispf = false
            surname = ""
        }

        // TODO: Checkear antes de siquiera mandar el form que los campos dni, name, surname, cuil_cuit y phone tengan maximo 20 caracteres.
        // TODO: Checkear antes de siquiera mandar el form que el campo email tenga como maximo 45 caracteres y que la RegEx checkee que email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)

        return {
            "name":name ,
            "surname":surname || null, // En caso de que apellido esté vacio con persona juridica, guarda un null
            "email": email,
            "cuil_cuit": cuil_cuit,
            "phone":phone,
            "howimeetcice":howimeetcice,
            "ispf":ispf,
            "id_user":1
        }
    }

})

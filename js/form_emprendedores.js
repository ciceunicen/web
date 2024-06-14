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

    function resetearForm(){
        document.getElementById("name").value = "";
        document.getElementById("surname").value = "";
        document.getElementById("phoneNumber").value = "";
        document.getElementById("email").value = "";
        document.getElementById("cuit_cuil").value = "";

    }

    document.getElementById("fisica").addEventListener("click", () => {
        document.getElementById("div_apellido").style.display = "block";
        document.getElementById("tipo_razon").innerHTML = 'Nombre <span class="requerido">*</span>';
        document.getElementById("name").setAttribute("placeholder", "Ingrese su Nombre");
        resetearForm();
    });

    document.getElementById("juridica").addEventListener("click", () => {
        document.getElementById("div_apellido").style.display = "none";
        document.getElementById("tipo_razon").innerHTML = 'Razon Social <span class="requerido">*</span>';
        document.getElementById("name").setAttribute("placeholder", "Ingrese su Razon Social");
        resetearForm();
    });


    document.getElementById("register-emprendedor")?.addEventListener("submit", (e) => {
        e.preventDefault();
        register();
    })

    document.querySelector("#btn-back").addEventListener("click", ()=>{
        window.location.replace('./dashboard.html');
    });

    async function register() {
        // Cada vez que se envia el form se eliminan todos los errores
        quitarMensajesDeErrores();
        // Se obtienen los datos (o no)
        let valoresInputs = getDatos();
        // Si los datos estan mal entonces ni siquiera se envia el form
        if(!valoresInputs){ return }

        let datosRegister = JSON.stringify(valoresInputs);

        const formContainer = document.querySelector(".container_form_input");
        const popup = document.createElement("div");
        popup.classList.add("popup");

        try {
            let response = await fetch(URL_EMPRENDEDORES, {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
                "body": datosRegister,
            });
            let data;
            try {
                data = await response.json();
            } catch (error) {
                throw new Error("La respuesta no es un JSON valido!");
            }

            if (!response.ok) {
                popup.classList.add("popupError");
                console.log(data);
                console.log(response.status);
                // Mostramos por pantalla todos los errores (Data es un HashMap, donde los value son los mensajes de error)
                for (const error of Object.values(data)) {
                    popup.innerText += error + "\n";
                }
                
                throw new Error ({ error: Object.values(data), status: data.status });
            } else {
                popup.classList.add("popupSuccess");
                popup.innerText = "Formulario enviado exitosamente!";
            }
        }
        catch (e) {
            popup.classList.add("popupError");
            popup.innerText += e.message;
            console.log(e);
        }

        formContainer.appendChild(popup);
    }


    
    function getDatos() {
        let name = document.getElementById("name").value;
        let surname= document.getElementById("surname").value;
        let email= document.getElementById("email").value;
        let phone= document.getElementById("phoneNumber").value;
        let cuil_cuit = document.getElementById("cuit_cuil").value;
        let howimeetcice= document.getElementById("como_conociste").value;
        let fisica = document.getElementById("fisica");
        
        if (!fisica.checked){
            surname = "";
        }
        let err = false;
        if(!name){ document.querySelector("#emptyName").classList.remove("hidden"); err = true; }
        if(name && name.length > 20){ document.querySelector("#longName").classList.remove("hidden"); err = true; }
        if(!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)){ document.querySelector("#invalidEmail").classList.remove("hidden"); err = true; }
        if(!email.length > 45){ document.querySelector("#longEmail").classList.remove("hidden"); err = true; }
        if(surname && surname.length > 20){ document.querySelector("#longSurname").classList.remove("hidden"); err = true; }
        if(!cuil_cuit){ document.querySelector("#emptyCuilCuit").classList.remove("hidden"); err = true; }
        if(cuil_cuit && cuil_cuit.length > 20){ document.querySelector("#longCuilCuit").classList.remove("hidden"); err = true; }
        if(phone && phone.length > 20){ document.querySelector("#longPhone").classList.remove("hidden"); err = true; }

        phone = phone ? Number(phone) : "";

        return err ? null : {
            "name": name,
            "surname": surname,
            "email": email,
            "cuil_cuit": cuil_cuit,
            "phone": phone,
            "howimeetcice": howimeetcice,
            "ispf": fisica.checked,
        }
    }

    function quitarMensajesDeErrores(){
        // Obtenemos todos posibles mensajes de error
        const mensajes = document.querySelectorAll(".errorMessage");
        // Desactivamos todos
        mensajes.forEach(mensaje => mensaje.classList.add("hidden"));
    }

})

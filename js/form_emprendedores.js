const URL_EMPRENDEDORES = "http://localhost:8080/emprendedores";
const URL_EMPRENDEDORES_REQUEST = "http://localhost:8080/emprendedores/solicitudes/usuario";

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

async function getEntrepeneurRequest(id){
    try {
        let response = await fetch(`${URL_EMPRENDEDORES_REQUEST}/${id}`, {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            },
        });

        let data;
        try {
            data = await response.json();
        } catch (error) {
            throw new Error("La respuesta no es un JSON válido.");
        }
        
        if (response.status == 404) {
            console.log("No existe ese recurso!");
            return false;
        } else if(!response.ok){
            throw new Error("Hubo un error al procesar su informacion, intenteló mas tarde.");
        }else{
            return true;
        }
    }
    catch (error) {
        console.error("Error al verificar si ya existe una peticion: ", error);
        
        return false;
    }
}

function getDatos() {
    /* let id = getUserId() */
    let name = document.getElementById("user_name").value;
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

    return {
        "name":name ,
        "surname":surname,
        "email": email,
        "cuil_cuit": cuil_cuit,
        "phone":phone,
        "howimeetcice":howimeetcice,
        "ispf":ispf,
        "id_user":1
    }
}

async function register() {
    let valoresInputs = getDatos();
    let datosRegister = JSON.stringify(valoresInputs);
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

function mostrarFormularioYaEnviado(){
    const form = document.getElementById("register-emprendedor");
    const message = document.querySelector(".pendingRequestContainer");
    console.log(form);
    console.log(message);

    message.classList.remove("hidden");
    form?.classList.add("hidden"); // TODO: En vez de agregarme la clase hidden la grega como "id". Raro.
}

function checkFormValidity(form, submitButton) {
    console.log("Validando");
    // Verifica la validez del formulario
    if (form.checkValidity()) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    "use strict";

    logout();

    document.querySelector("#btn-back")?.addEventListener("click", ()=>{
        window.location.replace('./dashboard.html');
    });
    
    const userID = extraerIdDelToken(localStorage.getItem("token"));
    // Verificamos si el usuario ya ha enviado este formulario en el pasado
    if(await getEntrepeneurRequest(userID)){ mostrarFormularioYaEnviado(); return;}

    // Sino mostramos el formulario para que el usuario lo pueda completar
    const contenedorForm = document.getElementById("register-emprendedor");
    const contenedorMensaje = document.querySelector(".pendingRequestContainer");
    contenedorForm.classList.remove("hidden");
    contenedorMensaje.classList.add("hidden");

    const submitButton = document.querySelector('.form-submit-btn input');
    // Deshabilitar el botón al cargar la página
    submitButton.disabled = true;

    // Cada vez que se modifica un input dentro del form se valida si los campos requeridos cumplen sus normas
    // En caso de que sean correctas habilita el boton de enviar
    contenedorForm.addEventListener("change", ()=> {

        if(!requiredInputsAreInserted()){
            submitButton.disabled = true;
            console.log("desactivado");
            return ;
        }

        console.log("Activado");
        submitButton.removeAttribute("disabled");
    });
    
    function resetearForm(){
        document.getElementById("user_name").value = "";
        document.getElementById("surname").value = "";
        document.getElementById("phoneNumber").value = "";
        document.getElementById("email").value = "";
        document.getElementById("cuit_cuil").value = "";

    }

    document.getElementById("fisica").addEventListener("click", () => {
        document.getElementById("div_apellido").style.display = "block";
        document.getElementById("tipo_razon").innerHTML = 'Nombre <span class="requerido">*</span>';
        document.getElementById("user_name").setAttribute("placeholder", "Ingrese su Nombre");
        resetearForm();
    });
  
    document.getElementById("juridica").addEventListener("click", () => {
        document.getElementById("div_apellido").style.display = "none";
        document.getElementById("tipo_razon").innerHTML = 'Razon Social <span class="requerido">*</span>';
        document.getElementById("user_name").setAttribute("placeholder", "Ingrese su Razon Social");
        resetearForm();
    });


    contenedorForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        // Checkeamos nuevamente que el usuario no haya enviado el formulario en el pasado
        if(await getEntrepeneurRequest(userID)){ mostrarFormularioYaEnviado(); return;}
        register();
    });

    async function register() {
        // Inhabilitamos el boton asi el user no puede hacer multiples requests
        submitButton.setAttribute("disabled", "disabled");
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
                // Mostramos por pantalla todos los errores (Data es un HashMap, donde los value son los mensajes de error)
                for (const error of Object.values(data)) {
                    const errMsgElement = document.createElement("span");
                    errMsgElement.innerText += error + ". ";
                    popup.appendChild(errMsgElement);
                }

                console.error(Object.values(data));
            } else {
                popup.classList.add("popupSuccess");
                popup.innerText = "Formulario enviado exitosamente!";
                // Una vez se muestre se termine de mostra el mensaje del popup success se redirige al usuario al dashboard
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                    submitButton.removeAttribute("disabled");
                }, 4000)
            }
        }
        catch (e) {
            popup.classList.add("popupError");
            popup.innerText += e.message;
            console.log(e);
        }

        formContainer.appendChild(popup);
        // Volvemos a habilitar el boton

        // Destruimos el popup una vez termine la animacion del css "utils"
        setTimeout(() => popup.remove(), 4000);
    }

    function requiredInputsAreInserted(){
        let name = document.getElementById("user_name").value;
        let email= document.getElementById("email").value;
        let cuil_cuit = document.getElementById("cuit_cuil").value;
        
        return (name && email && cuil_cuit);
    }
    
    function getDatos() {
        let name = document.getElementById("user_name").value;
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
        if(email.length > 45){ document.querySelector("#longEmail").classList.remove("hidden"); err = true; }
        if(surname && surname.length > 20){ document.querySelector("#longSurname").classList.remove("hidden"); err = true; }
        if(!cuil_cuit){ document.querySelector("#emptyCuilCuit").classList.remove("hidden"); err = true; }
        if(cuil_cuit && cuil_cuit.length > 20){ document.querySelector("#longCuilCuit").classList.remove("hidden"); err = true; }
        if(phone && phone.length > 20){ document.querySelector("#longPhone").classList.remove("hidden"); err = true; }

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
});

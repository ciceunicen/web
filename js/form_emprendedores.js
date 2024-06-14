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
        
        if (!response.ok) {
            console.log("Entró al throw");
            throw new Error({ error: data.error, status: data.status });
        } else {
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

    // Sino mostramos el formulario para que el usuario lo pueda completar
    const submitButton = document.querySelector('.form-submit-btn input');
    // Deshabilitar el botón al cargar la página
    submitButton.disabled = true;

    contenedorForm.addEventListener('input', () => checkFormValidity(contenedorForm, submitButton));

    // Agregamos los event listeners
    document.getElementById("fisica")?.addEventListener("click", () => {
        document.getElementById("div_apellido").style.display = "block";
        document.getElementById("tipo_razon").innerHTML = "Nombre";
        document.getElementById("name").setAttribute("value", "carga default de nombre de la persona");
        document.getElementById("surname").setAttribute("value", "carga default de apellido de la persona");
        document.getElementById("email").setAttribute("value", "carga default de email de la persona");
    });
    document.getElementById("juridica").addEventListener("click", () => {
        document.getElementById("div_apellido").style.display = "none";
        document.getElementById("tipo_razon").innerHTML = "Razon Social";
        document.getElementById("name").setAttribute("value", "carga default de razon social de la persona");
    });

    document.getElementById("register-emprendedor")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        // Checkeamos nuevamente que el usuario no haya enviado el formulario en el pasado
        if(await getEntrepeneurRequest(userID)){ mostrarFormularioYaEnviado(); return;}
        register();
    });

});
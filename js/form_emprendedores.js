document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    logout();

    const URL_EMPRENDEDORES = "http://localhost:8080/emprendedores";
    

    document.getElementById("fisica").addEventListener("click", () => {

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
        try {

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
})

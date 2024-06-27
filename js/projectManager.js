//GET
function getProjectManager(id) {
    let token = localStorage.getItem("token");

    return fetch(URLProjectManager + "/" + id, {
            mode: 'cors',

            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "Access-Control-Allow-Origin": "*",
            },
        })
        .then((response) => response.json())
        .then(json => { return json });
}

function getAllProjectManagers() {
    let token = localStorage.getItem("token");

    return fetch(URLProjectManager + "/page/" + page, {
            mode: 'cors',

            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "Access-Control-Allow-Origin": "*",
            },
        })
        .then((response) => response.json())
        .then(json => { return json })
}

function getAllProjectsByProjectManager(idProjectManager) {
    let token = localStorage.getItem("token");

    return fetch(URLProjectManager + "/" + idProjectManager + "/projects/page/" + page, {
            mode: 'cors',

            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "Access-Control-Allow-Origin": "*",
            },
        })
        .then((response) => response.json())
        .then(json => { return json })
}

//MOSTRAR RESPONSABLE DEL PROYECTO
function mostrarResponsableProyecto(id_project) {
    let btn = document.getElementById('projectManagerData')
    if (btn.className === 'hiddenData') {
        getReferentByID_project(id_project).then(json => showDataProjectManager(json));
        btn.className = 'showProjectManagerData';
        document.querySelector(".slideDownResponsible").innerHTML = "<img src='../img/icons8-flecha-contraer-50.png' class='slideDown'/>";
    } else {
        document.querySelector(".slideDownResponsible").innerHTML = "<img src='../img/expandir.png' class='slideDown'/>";
        btn.className = 'hiddenData';
    }
}

//carga datos en la tabla de datos de un emprendedor
 async function showDataProjectManager(referent) {
    //llamo a contenido donde se muestran los datos del emprendedor.
   await mostrarArchivoHTML("dataProjectManager.html").then(text_pm => {
        document.getElementById("projectManagerData").innerHTML = text_pm;
        //Completo datos del emprendedor
        console.log(referent);
        if(referent==undefined){
            document.querySelector("#fullName").innerHTML = "Por alguna razon no existe el referente de este proyecto";
            document.querySelector("#fullName").style.backgroundColor = "red";
        }else{
            let user=  getUserById(referent.id_user);
            if (user==undefined||user==null){
                document.querySelector("#fullName").innerHTML = "No es un usuario registrado";
            }else{
                getUserById(referent.id_user).then(user => {
                    if (user == undefined || user == null) {
                        document.querySelector("#fullName").innerHTML = "No es un usuario registrado";
                    } else {
                        document.querySelector("#fullName").innerHTML = user.username;
                        console.log(user);
                    }
                });
            }
            // document.querySelector("#fullName").innerHTML = "NOMBRE Y APELLIDO COMPLETO";
            // projectManager.name + " " + projectManager.surname;
            document.getElementById("localidad").innerHTML = referent.localidad;
            document.getElementById("ocupacion").innerHTML = referent.ocupacion;
            document.querySelector("#email").innerHTML = referent.mail;
            document.querySelector("#linkUnicen").innerHTML = referent.vinculacion;
            document.getElementById("FacultadPertenece").innerHTML = referent.facultad;
            document.querySelector("#phone").innerHTML = referent.telefono;
            document.querySelector("#medioConocimientoCice").innerHTML = referent.conocimiento;
            document.getElementById("organizacionAsociativa").innerHTML = referent.organizacion;
        }
    });
}

//TODO LISTA EMPRENDEDORES
function generarTablaEmprendedores(json) {
    // window.location.hash = 'emprendedores';

    let array = json.content;
    let container = document.querySelector(".projectManagersTable");
    container.innerHTML = "";
    for (let i = array.length - 1; i >= 0; i--) {
        const projectManager = array[i];
        var row = container.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var input = document.createElement("input");
        input.setAttribute("type", "button");
        input.setAttribute("value", "Ver más");
        input.setAttribute("id", projectManager.id_ProjectManager);
        input.setAttribute("class", "btn_save_green verMas");
        cell5.appendChild(input);
        document.querySelector(".verMas").addEventListener("click", () => { getProjectManager(projectManager.id_ProjectManager).then(json => mostrarEmprendedor(json, "emprendedores")) });
        cell1.innerHTML = projectManager.name;
        //cambiar cuando este la entidad administrador, utilizar nombre y apellido
        cell2.innerHTML = projectManager.surname;
        cell3.innerHTML = projectManager.email;
        cell4.innerHTML = projectManager.phone;
    }
}
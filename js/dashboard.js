document.addEventListener("DOMContentLoaded", (e) =>{
    "use strict";

    const USER = " <h2>Utilidades</h2><ul><li id='serEmprendedor'>Ser emprendedor</li></ul>"

    const EMPRENDEDOR = "<h2>Proyectos</h2><ul><li id='crearProject'>Crear Proyecto</li><li>Ver mis proyectos</li></ul><h2>Utilidades</h2><ul><li>Solicitar turno</li></ul>"

    const ADMIN = "<h2>Proyectos</h2><ul><li id='listProjectsManager'>Listar proyectos</li></ul><h2>Emprendedores</h2><ul><li id='listEntrepreneur'>Listar emprendedores</li></ul><h2>Utilidades</h2><ul><li>Turnos solicitados</li><li>Solicitar reporte</li></ul>"

    const SUPERADMIN = "<h2>Proyectos</h2><ul><li id='listProjectsManager'>Listar proyectos</li></ul><h2>Emprendedores</h2><ul><li id='listEntrepreneur'>Listar emprendedores</li></ul><h2>Utilidades</h2><ul><li>Turnos solicitados</li><li>Solicitar reporte</li><li id='AdmUsuariosRol'>Listar usuarios</li></ul>"


    let container = document.getElementById("directions")
    let user_name = document.getElementById("user_name")
    let user_email = document.getElementById("user_email")

    let user = JSON.parse(localStorage.getItem('usuario'))
    /* user.rolType.toLowerCase() */
    let rolUser = user.rolType.toLowerCase()

    user_name.innerHTML = user.name
    user_email.innerHTML = user.email
    
    if(rolUser == "defecto"){ 
        container.innerHTML += USER
    }else if(rolUser == "emprendedor"){
        container.innerHTML += EMPRENDEDOR
    }else if(rolUser == "admin"){
        container.innerHTML += ADMIN
    }else if(rolUser == "superadmin"){
        container.innerHTML += SUPERADMIN
    }

    logout(); //La carga del EventListener tiene que suceder dps de que se modifica el container.html
    // sino deja de tener funcionalidad el logout

    /*Interactions*/
    /*Default */
    if(document.getElementById('serEmprendedor')!=null){
        let BtnSerEmprededor = document.getElementById('serEmprendedor').addEventListener('click', ()=>{
            window.location.href = "./form_emprendedores.html";
        })
    }
    

    /*Emprendedor */
    if(document.getElementById('crearProject')!=null){
        let BtnCrearProject = document.getElementById('crearProject').addEventListener('click', ()=>{
            window.location.href = "./cargarProjects.html";
        })
    }
    

    /*Admin / Superadmin */
    if(document.getElementById('listProjectsManager')!=null){
        let BtnListProjectsManager = document.getElementById('listProjectsManager').addEventListener('click', ()=>{
            window.location.href = "./home.html";
        })
    }

    if(document.getElementById('listEntrepreneur')!=null){
        let BtnListProjectsManager = document.getElementById('listEntrepreneur').addEventListener('click', ()=>{
            window.location.href = "./home.html";
        })
    }

    if(document.getElementById('cambioDeRol')!=null){
        let BtnListProjectsManager = document.getElementById('cambioDeRol').addEventListener('click', ()=>{
            window.location.href = "./cambioDeRol.html";
        })
    }

    if(document.getElementById('AdmUsuariosRol')!=null){
        let BtnListProjectsManager = document.getElementById('AdmUsuariosRol').addEventListener('click', ()=>{
            window.location.href = "./cambioDeRol.html";
        })
    }

})
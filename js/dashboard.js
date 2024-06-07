document.addEventListener("DOMContentLoaded", (e) =>{
    "use strict";

    const USER = " <h2>Utilidades</h2><ul><li id='serEmprendedor'>Ser emprendedor</li><li id='editarDatosUsuario'>Editar mis datos</li></ul>"

    const EMPRENDEDOR = "<h2>Proyectos</h2><ul><li id='crearProject'>Crear Proyecto</li><li id='listProjectsEntrepreneur'>Ver mis proyectos</li></ul><h2>Utilidades</h2><ul><li>Solicitar turno</li></ul>"

    const ADMIN = "<h2>Proyectos</h2><ul><li id='listProjectsManager'>Listar proyectos</li><li id='crearProject'>Crear Proyecto</li></ul><h2>Emprendedores</h2><ul><li id='listEntrepreneur'>Listar emprendedores</li></ul><h2>Utilidades</h2><ul><li>Turnos solicitados</li><li>Solicitar reporte</li></ul>"

    const SUPERADMIN = "<h2>Proyectos</h2><ul><li id='listProjectsManager'>Listar proyectos</li></ul><h2>Emprendedores</h2><ul><li id='listEntrepreneur'>Listar emprendedores</li></ul><h2>Utilidades</h2><ul><li>Turnos solicitados</li><li>Solicitar reporte</li><li id='AdmUsuariosRol'>Listar usuarios</li></ul>"

    const PERSONAL_CICE = "<h2>Proyectos</h2><ul><li id='listProjectsManager'>Listar proyectos</li></ul>"


    let container = document.getElementById("directions")
    let user_name = document.getElementById("user_name")
    let user_email = document.getElementById("user_email")

    let user = JSON.parse(localStorage.getItem('usuario'))
    /* user.rolType.toLowerCase() */
    let rolUser = user.rolType.toLowerCase()


    user_name.innerHTML = user.username
    user_email.innerHTML = user.email
    
    if(rolUser == "defecto"){ 
        container.innerHTML += USER
    }else if(rolUser == "emprendedor"){
        container.innerHTML += EMPRENDEDOR
    }else if(rolUser == "admin"){
        container.innerHTML += ADMIN
    }else if(rolUser == "superadmin"){
        container.innerHTML += SUPERADMIN
    }else if(rolUser == "personal del cice"){
        container.innerHTML += PERSONAL_CICE
    }

    logout(); //La carga del EventListener tiene que suceder dps de que se modifica el container.html
    // sino deja de tener funcionalidad el logout

    /*Interactions*/
    /*Default */
    document.getElementById('serEmprendedor')?.addEventListener('click', ()=> window.location.href = "./form_emprendedores.html");
    document.getElementById('editarDatosUsuario')?.addEventListener('click', ()=> window.location.href = "./form_edicionDatosUsuario.html");
    
    /*Emprendedor */
    document.getElementById('crearProject')?.addEventListener('click', ()=> window.location.href = "./home.html?crearProyecto");
    document.getElementById('listProjectsEntrepreneur')?.addEventListener('click', ()=> window.location.href = "./home.html?misProyectos");   
    
    /*Admin / Superadmin */
    document.getElementById('listEntrepreneur')?.addEventListener('click', ()=> window.location.href = "./home.html");   
    
    // Se supone que estos 3 son para admins/superadmins pero por el momento no hacen nada (ya que nunca se crean en el HTML) 
    document.getElementById('listProjectsManager')?.addEventListener('click', ()=> window.location.href = "./home.html?proyectos");   
    document.getElementById('cambioDeRol')?.addEventListener('click', ()=> window.location.href = "./cambioDeRol.html");   
    document.getElementById('AdmUsuariosRol')?.addEventListener('click', ()=> window.location.href = "./cambioDeRol.html");
})
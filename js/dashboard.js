document.addEventListener("DOMContentLoaded", (e) =>{
    "use strict";
    
    const USER = " <h2>Acceso</h2><ul><li>Logout</li></ul><h2>Utilidades</h2><ul><li>Ser emprendedor</li></ul>"

    const EMPRENDEDOR = "<h2>Acceso</h2><ul><li>Logout</li></ul><h2>Proyectos</h2><ul><li>Crear Proyecto</li><li>Ver mis proyectos</li></ul><h2>Utilidades</h2><ul><li>Solicitar turno</li></ul>"

    const ADMIN = "<h2>Acceso</h2><ul><li>Logout</li></ul><h2>Proyectos</h2><ul><li>Listar proyecto</li></ul><h2>Emprendedores</h2><ul><li>Listar emprendedores</li></ul><h2>Utilidades</h2><ul><li>Turnos solicitados</li><li>Solicitar reporte</li><li>Listar usuarios</li></ul>"

    const SUPERADMIN = "<h2>Acceso</h2><ul><li>Logout</li></ul><h2>Proyectos</h2><ul><li>Listar proyecto</li></ul><h2>Emprendedores</h2><ul><li>Listar emprendedores</li></ul><h2>Utilidades</h2><ul><li>Turnos solicitados</li><li>Solicitar reporte</li><li>Listar usuarios</li></ul>"


    let container = document.getElementById("directions")
    let user_name = document.getElementById("user_name")
    let user_email = document.getElementById("user_email")

    let user = JSON.parse(localStorage.getItem('usuario'))
    /* user.rolType.toLowerCase() */
    let rolUser = user.rolType.toLowerCase()

    user_name.innerHTML = user.name
    user_email.innerHTML = user.email
    
    if(rolUser == "defecto"){ 
        container.innerHTML = USER
    }else if(rolUser == "emprendedor"){
        container.innerHTML = EMPRENDEDOR
    }else if(rolUser == "admin"){
        container.innerHTML = ADMIN
    }else if(rolUser == "superadmin"){
        container.innerHTML = SUPERADMIN
    }


    
    


})
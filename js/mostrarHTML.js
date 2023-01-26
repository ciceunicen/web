//Muestra un archivo html el param rutaArchivo es la ruta del archivo html
function mostrarArchivoHTML(rutaArchivo){
  return fetch(rutaArchivo).then((response) => response.text())
  .then(text => {return text});
}

//Muestra el home de la pagina
function mostrarHome(){
  mostrarArchivoHTML("html/navbar.html",".navbar").then(text => {
      document.querySelector(".navbar").innerHTML = text;
      document.querySelector("#proyectos").addEventListener("click", ()=>{
        drawClickNav("proyectos");
        page=1;
        getAllProjects().then(json=>mostrarProyectos(json));
      });
      document.querySelector("#emprendedores").addEventListener("click", ()=>{
        drawClickNav("emprendedores");
        mostrarListaEmprendedores();
        //mostrarCargaProyecto();
      });
      //HOME TEMPORAL
      document.querySelector("#emprendedores").click();
    })
}

//Cambio de pantalla a proyectos eliminados
function showTableProjectsRemoved(){
    mostrarArchivoHTML("html/listProjectsRemoved.html").then(text =>{
      document.querySelector(".main-container").innerHTML = text;
      //configuro dropdown que lleva a sección de tabla de todos los proyectos
      let id_btn_change_screen = 'btn_section_projects';
      configDropdown(id_btn_change_screen, "projects")
      page=1;
      getAllDeleteProjects(page).then(json => {
        mostrarTabla(json,true);
        mostrarPaginado(json.totalPages,"proyectosEliminados");
      });
    });
}

//muestra la lista de proyectos
function mostrarProyectos(json) {
  mostrarArchivoHTML("html/listProjects.html").then(text =>{
    document.querySelector(".main-container").innerHTML = text;
    //AGREGO DROPDOWN DE PROYECTOS ELIMINADOS Y EVENTOS DE CAMBIOS DE PANTALLA
    let id_btn_change_screen = 'btn_section_projects_removed';
    configDropdown(id_btn_change_screen, "projects_removed");
    //funcionalidad boton ver mas de la lista
    //FILTROS
    //Traigo de la base de datos y muestro en el DOM las necesidades, asistencias y estadios existentes
    //le paso la url y el Id del DOM donde se van a mostrar los elementos
    getAllBaseURL(URLNeeds, 'needs');
    getAllBaseURL(URLAssitances, 'assists');
    getAllBaseURL(URLStages, 'stadiums');
    document.querySelector("#btn_filter").addEventListener("click", function(){
      captureSelectedOptions();
    //Acá hacer fetch a la API pidiendo los proyectos filtrados, usando JSON "json_filters"
    //...
    });
    mostrarPaginado(json.totalPages,"proyectos");
    mostrarTabla(json,false);
  });
}


//muestra la seccion del paginado
function mostrarPaginado(pages,tablaUtilizada,datosFiltro = []){
  mostrarArchivoHTML("html/pagination.html").then(text =>{
    document.querySelector(".footer-list-projects").innerHTML=text;
    document.querySelector("#pageNumber").innerHTML=page;
    comportamientoPaginado(pages,datosFiltro,tablaUtilizada);
  });
}


//MOSTRAR PROYECTO
function mostrarProyecto(proyecto){
  mostrarArchivoHTML("html/proyecto.html").then(text=>{
    document.querySelector(".main-container").innerHTML = text;
    document.querySelector("#titulo").innerHTML+=proyecto.title;
    document.querySelector("#descripcion").innerHTML+=proyecto.description;
    document.querySelector("#estadio").innerHTML+=proyecto.stage.stage_type;
    mostrarArray("#asistencia",proyecto.assistances,"elemento.type");
    mostrarArray("#necesidades",proyecto.needs,"elemento.needType");
    partialRendercargaDatosEmprendedorYHistorial(".datosEmprendedor",proyecto.projectManager.id_ProjectManager);
    mostrarArray("#files",proyecto.files,"elemento.file");
    document.querySelector("#editarProyecto").addEventListener("click", ()=>{
      mostrarEditarProyecto(proyecto.id_Project,proyecto);
    });
  })
}

//MUESTRA FORMULARIO CARGA PROYECTOS
function mostrarCargaProyecto() {
  mostrarArchivoHTML("html/cargarProjects.html").then(text=>{
      document.querySelector(".main-container").innerHTML = text;
      document.querySelector(".iborrainputfile").addEventListener("click", saveAttachments);
      inicializarCargaProyecto();
      cargaRenderNecesidades();
      cargaRenderAsistencia();
      let id_emprendedor=1;
      partialRendercargaDatosEmprendedorYHistorial(".datosEmprendedor",id_emprendedor);
      //Configuro Ckeckboxs dinamico de estadios
      getAllBaseURL(URLStages, 'estadios_checks');
  });
}

function partialRendercargaDatosEmprendedorYHistorial(div,id_emprendedor){
  mostrarArchivoHTML("html/datosEmprendedor.html").then(text=>{
    document.querySelector(div).innerHTML = text;
    document.querySelector('.slideDownResponsible').addEventListener("click",()=>{
      mostrarResponsableProyecto(id_emprendedor);
    });
    document.querySelector('.slideDownHistory').addEventListener("click", mostrarHistorialProyecto);
  });
}

function cargaRenderNecesidades(){
  mostrarArchivoHTML("html/cargaDeNecesidades.html").then(text =>{
    document.querySelector(".datosNecesidades").innerHTML = text;
    document.querySelector("#saveNecesidad").addEventListener("click", guardarNecesidades);
    //Configuro Dropdown de necesidades
    getAllBaseURL(URLNeeds, 'needs_created');
  });
}

function cargaRenderAsistencia(){
  mostrarArchivoHTML("html/cargaDeAsistencias.html").then(text =>{
    document.querySelector(".datosAsistencias").innerHTML = text;
    document.querySelector("#saveAsistencia").addEventListener("click", guardarAsistencias);
    //Configuro Dropdown de asistencias
    getAllBaseURL(URLAssitances, 'assistances_created');
  });  
}
function mostrarListaEmprendedores(){//recibe un json por parametro
  mostrarArchivoHTML("html/listProjectsManager.html").then(text =>{
      document.querySelector(".main-container").innerHTML = text;
  });
}


//MOSTRAR EDITAR PROYECTO
function mostrarEditarProyecto(id_proyecto,proyecto){
  mostrarArchivoHTML("html/cargarProjects.html").then(text=>{
    document.querySelector(".main-container").innerHTML = text;
    document.querySelector("#title").value=proyecto.title;
    document.querySelector("#description").value=proyecto.description;
    console.log(id_proyecto);
    selecionarSoloUnEstadio();
    cargarCheckboxes(URLStages, proyecto,'estadios_checks');
    mostrarArchivoHTML("html/cargaDeNecesidades.html").then(text =>{
      document.querySelector(".datosNecesidades").innerHTML = text;
      document.querySelector("#saveNecesidad").addEventListener("click", guardarNecesidades);
      //Configuro Dropdown de necesidades
      cargarCheckboxes(URLNeeds, proyecto,'needs_created');
      cargarNecesidadesoAsistenciasCreadas(URLNeeds);
    
    });
    mostrarArchivoHTML("html/cargaDeAsistencias.html").then(text =>{
      document.querySelector(".datosAsistencias").innerHTML = text;
      document.querySelector("#saveAsistencia").addEventListener("click", guardarAsistencias);
      //Configuro Dropdown de asistencias
      cargarCheckboxes(URLAssitances, proyecto,'assistances_created');
      cargarNecesidadesoAsistenciasCreadas(URLAssitances);
    });  
    mostrarAdjuntos(proyecto);
    partialRendercargaDatosEmprendedorYHistorial(".datosEmprendedor",proyecto.projectManager.id_ProjectManager);  
    
  })
}

function mostrarAdjuntos(proyecto){
  proyecto.files.forEach(element => {
    document.querySelector(".editSelectedFiles").innerHTML+=element.file + " ";
  }); 
  
}

function cargarCheckboxes(URL, proyecto,dato){
  getAllBaseURL(URL, dato).then(()=>{
    let checkboxes=[];
    if(dato==="needs_created"){
      checkboxes=document.querySelector('#necesidades_checks').querySelectorAll('.necesidadesCheckboxes, input[type=checkbox]');
    }else if(dato=="assistances_created"){
      checkboxes=document.querySelector('#asistencias_checks').querySelectorAll('.asistenciasCheckboxes, input[type=checkbox]');
    }else{
      checkboxes=document.querySelector('#estadios_checks').querySelectorAll('.asistenciasCheckboxes, input[type=checkbox]');
    }
    checkboxes.forEach(checkbox => {
      if(dato==="needs_created"){
        for (let i = 0; i < proyecto.needs.length; i++) {
          if(proyecto.needs[i].id_Need==checkbox.value){
            checkbox.innerHTML+=proyecto.needs[i].type;
            checkbox.checked=true;
          }
        }
      }else if("assistances_created"){
        for (let i = 0; i < proyecto.assistances.length; i++) {
          if(proyecto.assistances[i].id_Assistance==checkbox.value){
            checkbox.checked=true;
          }
        }
      }else{   
        if(proyecto.stage.id_Stage==checkbox.value){
          checkbox.checked=true;
        }
      }
    });
  });  
}
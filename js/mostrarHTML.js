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
        getAllProjects().then(json=>mostrarProyectos(json));
      });
      document.querySelector("#emprendedores").addEventListener("click", ()=>{
        drawClickNav("emprendedores");
        mostrarCargaProyecto();
      });
      //HOME TEMPORAL
      document.querySelector("#emprendedores").click();
    })
}

//Cambio de pantalla a proyectos eliminados
function showTableProjectsRemoved(){
    mostrarArchivoHTML("html/listProjectsRemoved.html").then(text =>{
                    document.querySelector(".main-container").innerHTML = text;
                    getAllDeleteProjects().then(json => mostrarTabla(json,true));
    });
}

//muestra la lista de proyectos
function mostrarProyectos(json) {
  mostrarArchivoHTML("html/listProjects.html").then(text =>{
    document.querySelector(".main-container").innerHTML = text;
    //AGREGO DROPDOWN DE PROYECTOS ELIMINADOS Y EVENTOS DE CAMBIOS DE PANTALLA
    configDropdowProjectsRemoved();
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
    mostrarPaginado(json.totalPages);
    let container= document.querySelector(".list");
    mostrarTabla(json,false,container);
  });
}

//muestra la seccion del paginado
function mostrarPaginado(pages){
  mostrarArchivoHTML("html/pagination.html").then(text =>{
    document.querySelector(".footer-list-projects").innerHTML=text;
    document.querySelector("#pageNumber").innerHTML=page;
    comportamientoPaginado(pages);
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
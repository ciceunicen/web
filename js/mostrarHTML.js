//Muestra un archivo html el param rutaArchivo es la ruta del archivo html
function mostrarArchivoHTML(rutaArchivo){
  return fetch(rutaArchivo).then((response) => response.text())
  .then(text => {return text});
}

//Muestra el home de la pagina
function mostrarHome(actualPage = 1){
  mostrarArchivoHTML("navbar.html",".navbar").then(text => {
      document.querySelector(".navbar").innerHTML = text;
      document.querySelector("#proyectos").addEventListener("click", ()=>{
        drawClickNav("proyectos");
        page=actualPage;
        getAllProjects().then(json=>mostrarProyectos(json));
      });
      document.querySelector("#emprendedores").addEventListener("click", ()=>{
        drawClickNav("emprendedores");
        mostrarListaEmprendedores();
      });
      //HOME TEMPORAL
      document.querySelector("#emprendedores").click();

      logout(); //Una vez cargado el NAV (se carga con parcial render), le agrego funcionalidad al boton creado
    })
}

function mostrarHomeEmprendedor(){

  //let emprendedor = JSON.parse(localStorage.getItem('emprendedor'));
  let user = JSON.parse(localStorage.getItem('usuario'));

  // Verifica si el usuario es un emprendedor y obtener su ID
  if (user && user.rolType && user.rolType.toLowerCase() === 'emprendedor' && user.id) {
    let emprendedorId = user.id;

    mostrarArchivoHTML("navbarEntrepreneur.html", ".navbar").then(
        text => {
          document.querySelector(".navbar").innerHTML = text;
          getAllProjectsByEntrepreneur(emprendedorId).then(json => mostrarProyectosDeEmprendedor(json));
          logout();
        }
    );
  } else {
    console.error('Error al obtener el ID del emprendedor desde el local storage.');
  }
}

//Cambio de pantalla a proyectos eliminados
function showTableProjectsRemoved(){
    mostrarArchivoHTML("listProjectsRemoved.html").then(text =>{
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
  let user = JSON.parse(localStorage.getItem('usuario'));
  
  let listadoHTML = "";
  if (user.rolType.toLowerCase() == 'personal del cice') {
    listadoHTML = "listProjectsPersonalCICE.html";
  } else {
    listadoHTML = "listProjects.html";
  }

  mostrarArchivoHTML(listadoHTML).then(text =>{
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

function mostrarProyectosDeEmprendedor(json) {
  console.log(json);
  mostrarArchivoHTML("listProjectsEntrepreneur.html").then(text =>{
    document.querySelector(".main-container").innerHTML = text;

    mostrarPaginado(json.totalPages,"proyectos");
    mostrarTablaProyectosEmprendedor(json);
  });
}

//muestra la seccion del paginado
function mostrarPaginado(pages,tablaUtilizada,datosFiltro = [],div=".footer-list-projects"){
  mostrarArchivoHTML("pagination.html").then(text =>{
    document.querySelector(div).innerHTML=text;
    document.querySelector("#pageNumber").innerHTML=page;
    comportamientoPaginado(pages,datosFiltro,tablaUtilizada);
  });
}


//MOSTRAR PROYECTO
function mostrarProyecto(proyecto){
  let user = JSON.parse(localStorage.getItem('usuario'));
  mostrarArchivoHTML("proyecto.html").then(text=> {
    document.querySelector(".main-container").innerHTML = text;
    document.querySelector("#titulo").innerHTML += proyecto.title;
    document.querySelector("#descripcion").innerHTML += proyecto.description;
    document.querySelector("#estadio").innerHTML += proyecto.stage.stage_type;

    if (user.rolType.toLowerCase() == "personal del cice" || user.rolType.toLowerCase() == "emprendedor") {
      let estadoDiv = document.querySelector("#estadoDiv");
      estadoDiv.classList.remove("hide");
      estadoDiv.innerHTML += `<h6 class="h6_description_stage">Estado</h6><p id="estado"></p>`;
      if (proyecto._active) {
        document.querySelector("#estado").innerHTML += "Activo";
      } else {
        document.querySelector("#estado").innerHTML += "No activo";
      }
    }
    mostrarArray("#asistencia", proyecto.assistances, "elemento.type");
    mostrarArray("#necesidades", proyecto.needs, "elemento.needType");
    partialRendercargaDatosEmprendedor(".datosEmprendedor", proyecto.projectManager.id_ProjectManager);
    partialRenderHistorialProject(".historyProject", proyecto.id_Project);
    //carga sección de archivos adjuntos
    mostrarArchivoHTML("files.html").then(text => {
      document.getElementById("div_adjuntos").innerHTML = text;
      mostrarArray("#files", proyecto.files, "elemento.file", proyecto);
      //evento para poder descargar todos sus archivos adjuntos
      downloadAllAttachmentsByProject(proyecto.title);
    });

    console.log(user);
    console.log(user.rolType);
    if (user && user.rolType && user.rolType.toLowerCase() === 'emprendedor') {
      // ocultar el botón de editar
      let editarProyectoBtn = document.querySelector("#editarProyecto");
      if (editarProyectoBtn) {
        editarProyectoBtn.style.display = 'none';
      }
    }
    else {
      document.querySelector("#editarProyecto").addEventListener("click", () => {
        mostrarEditarProyecto(proyecto.id_Project, proyecto);
      });
    }
  });
}

//MUESTRA FORMULARIO CARGA PROYECTOS
function mostrarCargaProyecto(id_ProjectManager) {
  mostrarArchivoHTML("cargarProjects.html").then(text=>{
      document.querySelector(".main-container").innerHTML = text;
      //document.querySelector(".iborrainputfile").addEventListener("click", saveAttachments);
      inicializarCargaProyecto(id_ProjectManager);
      cargaRenderNecesidades();
      cargaRenderAsistencia();
      partialRendercargaDatosEmprendedor(".datosEmprendedor",id_ProjectManager);
      //Configuro Ckeckboxs dinamico de estadios
      getAllBaseURL(URLStages, 'estadios_checks');
  });
}

function partialRendercargaDatosEmprendedor(div,id_emprendedor){
  mostrarArchivoHTML("datosEmprendedor.html").then(text=>{
    document.querySelector(div).innerHTML = text;
    document.querySelector('.slideDownResponsible').addEventListener("click",()=>{
      mostrarResponsableProyecto(id_emprendedor);
    });
    //document.querySelector('.slideDownHistory').addEventListener("click", mostrarHistorialProyecto);
  });
}

function cargaRenderNecesidades(){
  mostrarArchivoHTML("cargaDeNecesidades.html").then(text =>{
    document.querySelector(".datosNecesidades").innerHTML = text;
    document.querySelector("#saveNecesidad").addEventListener("click", guardarNecesidades);
    //Configuro Dropdown de necesidades
    getAllBaseURL(URLNeeds, 'needs_created');
  });
}

function cargaRenderAsistencia(){
  mostrarArchivoHTML("cargaDeAsistencias.html").then(text =>{
    document.querySelector(".datosAsistencias").innerHTML = text;
    document.querySelector("#saveAsistencia").addEventListener("click", guardarAsistencias);
    //Configuro Dropdown de asistencias
    getAllBaseURL(URLAssitances, 'assistances_created');
  });  
}
//MUESTRA LA LISTA DE EMPRENDEDORES
function mostrarListaEmprendedores(){//recibe un json por parametro
  mostrarArchivoHTML("listProjectsManager.html").then(text =>{
      document.querySelector(".main-container").innerHTML = text;
      page=1;
      getAllProjectManagers().then(json => {
        generarTablaEmprendedores(json);
        mostrarPaginado(json.totalPages,"emprendedores",[],".footer-list-emprendedores")
      });
  });
}

function partialRenderHistorialProject(div, id_project){
  mostrarArchivoHTML("ProjectHistory.html").then(text=>{
    document.querySelector(div).innerHTML = text;
    document.querySelector('.slideDownHistory').addEventListener("click", mostrarHistorialProyecto);
    page=1;
    getProjectHistory(id_project).then(json => generarTablaHistorial(json));
  });
}

//muestra un emprendedor
function mostrarEmprendedor(emprendedor){
  mostrarArchivoHTML("projectManager.html").then(text =>{
    document.querySelector(".main-container").innerHTML=text;
    //cargo tabla de datos del emprendedor
    showDataProjectManager(emprendedor);
    //evento cambio de pantalla a formulario de crear proyecto
    document.getElementById("btn_add_project").addEventListener("click", ()=>{
      mostrarCargaProyecto(emprendedor.id_ProjectManager);
    });
    page=1;
    getAllProjectsByProjectManager(emprendedor.id_ProjectManager).then(json=>{
      mostrarTabla(json,false,true);
      mostrarPaginado(json.totalPages,"proyectosEmprendedor",[emprendedor.id_ProjectManager]);
    });
  });
}

function showDataProjectManager(projectManager){
  //llamo a contenido donde se muestran los datos del emprendedor.
  mostrarArchivoHTML("dataProjectManager.html").then(text_pm =>{
    document.getElementById("projectManagerData").innerHTML=text_pm;
    //Completo datos del emprendedor
    document.querySelector("#fullName").innerHTML=projectManager.name+" "+projectManager.surname;
    document.querySelector("#email").innerHTML=projectManager.email;
    document.querySelector("#linkUnicen").innerHTML=projectManager.linkUnicen;
    document.querySelector("#phone").innerHTML=projectManager.phone;
    document.querySelector("#medioConocimientoCice").innerHTML=projectManager.medioConocimientoCice;
  });
}


//MOSTRAR EDITAR PROYECTO
function mostrarEditarProyecto(id_proyecto,proyecto){
  mostrarArchivoHTML("cargarProjects.html").then(text=>{
    document.querySelector(".main-container").innerHTML = text;
    document.querySelector("#title").value=proyecto.title;
    document.querySelector("#description").value=proyecto.description;
    selecionarSoloUnEstadio();
    cargarCheckboxes(URLStages, proyecto,'estadios_checks');
    mostrarArchivoHTML("cargaDeNecesidades.html").then(text =>{
      document.querySelector(".datosNecesidades").innerHTML = text;
      document.querySelector("#saveNecesidad").addEventListener("click", guardarNecesidades);
      //Configuro Dropdown de necesidades
      cargarCheckboxes(URLNeeds, proyecto,'needs_created');
      //getNecesidadesoAsistenciasCreadas(URLNeeds);
    
    });
    mostrarArchivoHTML("cargaDeAsistencias.html").then(text =>{
      document.querySelector(".datosAsistencias").innerHTML = text;
      document.querySelector("#saveAsistencia").addEventListener("click", guardarAsistencias);
      //Configuro Dropdown de asistencias
      cargarCheckboxes(URLAssitances, proyecto,'assistances_created');
      //getNecesidadesoAsistenciasCreadas(URLAssitances);
    });
    //carga sección de archivos adjuntos
    mostrarFilesEditar(proyecto);
    changeCountInputFile();
    partialRendercargaDatosEmprendedor(".datosEmprendedor",proyecto.projectManager.id_ProjectManager);
    partialRenderHistorialProject(".historyProject", proyecto.id_Project);
    saveNewData(id_proyecto, proyecto);
    validFileType();
  })
}

function mostrarFilesEditar(proyecto){
  mostrarArchivoHTML("filesEdit.html").then(text =>{
    let container = document.getElementById("div_adjuntos");
    container.innerHTML = "";
    container.innerHTML = text;
    mostrarArray("#files_edit",proyecto.files,"elemento.file",proyecto);
    //evento para poder eliminar todos sus archivos adjuntos
    removedAllAttachmentsByProject(proyecto);
    mostrarAdjuntos(proyecto);
  });
}

function mostrarAdjuntos(proyecto){
  proyecto.files.forEach(element => {
    if(element!=null){
      document.querySelector(".selectedFiles").innerHTML+=element.file + " ";
    }    
  }); 
  
}






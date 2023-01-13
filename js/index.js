//VARIABLES GLOBALES
const URLProjectManager="http://localhost:8080/projectmanagers";
const URLProject="http://localhost:8080/projects";
const URLNeeds = "http://localhost:8080/needs";
const URLAssitances = "http://localhost:8080/assistances";
const URLStages = "http://localhost:8080/stages";
let necesidades=[];
let asistencias = [];
let attachments=[];
let page=1;

//Para guardar los id por lo que se va a filtrar
var json_filters = {};

document.addEventListener("DOMContentLoaded",function(){
  fetch("html/navbar.html").then(
    function(response){
      response.text().then(
    function(texto){
      document.querySelector(".navbar").innerHTML = texto;
      document.querySelector("#proyectos").addEventListener("click", ()=>{
        drawClickNav("proyectos");
        getAllProjects();
      });
      document.querySelector("#emprendedores").addEventListener("click", ()=>{
        drawClickNav("emprendedores");
        mostrarCargaProyecto();
      });
      //HOME TEMPORAL
      document.querySelector("#emprendedores").click();
    }
  );
    }
  );
})
//Pinta de color verde obscuro el botón del navegador en el que se encuentra la página.
function drawClickNav(click_nav){
  //traiigo del DOM todos los botones de la barra de navegación
  let link_nav = document.querySelectorAll(".click_nav");
  //los recorro
  link_nav.forEach(link => {
    //aplico clase si es en el que se hizo click
    if(link.id == click_nav){
      link.classList.add("click");
    }else{//remuevo clase si no se le hizo click
      link.classList.remove("click");
    }
  });
}
function mostrarProyectos(json) {
  fetch("html/listProjects.html").then(
    function(response){
      response.text().then(
        function(texto){
          document.querySelector(".main-container").innerHTML = texto;
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
            fetch("html/pagination.html").then(
              function(response){
                response.text().then(
                  function(texto){
                    document.querySelector(".footer-list-projects").innerHTML=texto;
                    document.querySelector("#pageNumber").innerHTML=page;
                    if(page==1){
                      document.querySelector("#previousPage").ariaDisabled;
                      document.querySelector("#previousPage").style.color="grey"; 
                      document.querySelector("#previousPage").setAttribute("disabled", "true");
                    }
                    let pages=json.totalPages;
                   // console.log(json);
                    if(page==pages){
                        document.querySelector("#nextPage").style.color="grey";
                        document.querySelector("#nextPage").setAttribute("disabled", "true");
                        document.querySelector("#nextPage").ariaDisabled;
                       
                    }
                    document.querySelector("#nextPage").addEventListener("click", ()=>{
                      page++;
                      if(page<=pages){
                          getAllProjects(page);
                      }
                    
                    });
                    document.querySelector("#previousPage").addEventListener("click",()=>{
                      page--;
                      if(page>=1){
                        getAllProjects(page);
                      }
                      
                    });
              }
            );
            mostrarTabla(json);
         }); 
          
    }
  );
});
}

//Mostrar tabla de proyectos
function mostrarTabla(json){
  let array=json.content;
  let container = document.querySelector(".list");
  container.innerHTML="";
  for (let i = array.length-1; i >=0 ; i--) {
            const proyecto = array[i];
            var input = document.createElement("input");
            input.setAttribute("type", "button");
            input.setAttribute("value", "Ver más");
            input.setAttribute("id", proyecto.id_Project);
            input.setAttribute("class", "btn_save_green verMas");
            var row = container.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            cell1.innerHTML = proyecto.title;
            cell2.innerHTML = proyecto.projectManager.name + " " + proyecto.projectManager.surname;
            cell3.innerHTML = proyecto.stage.stage_type;
            cell4.appendChild(input);
            document.querySelector(".verMas").addEventListener("click", getProyecto);
            //creo botón de borrar para cada proyecto
            var btn_delete = document.createElement("input");
            btn_delete.setAttribute("type", "button");
            btn_delete.setAttribute("value", "Borrar");
            btn_delete.setAttribute("id", proyecto.id_Project);
            btn_delete.setAttribute("class", "btn_save_green");
            //le agrego el evento al botón de eliminar
            let id_Admin=proyecto.administrador;
            btn_delete.addEventListener("click", ()=>{borrarProyecto(proyecto.id_Project, id_Admin)});
            cell4.appendChild(btn_delete);
  }
}

function captureSelectedOptions(){
  json_filters = {filters:[]};
  //capturo que necesidades fueron seleccionadas
  let needsOptions = document.querySelector("#needs");
  //json_filters.needs = [];
  for (var option of needsOptions.options) {
    if(option.selected){
      json_filters.filters.push(option.label);
    }
  }
  //capturo que asistencias fueron seleccionadas
  let assitemcesOptions = document.querySelector("#assists");
  //json_filters.assitences = []
  for (var option of assitemcesOptions.options) {
    if(option.selected){
      json_filters.filters.push(option.label);
    }
  }
  //capturo que Estadios fueron seleccionados
  let assitemcesStadiums = document.querySelector("#stadiums");
  //json_filters.stadiums = []
  for (var option of assitemcesStadiums.options) {
    if(option.selected){
      json_filters.filters.push(option.label);
    }
  }
  getFilterProjects(json_filters);
  //console.log(json_filters);
}

//GET All reutilizable del Filtro para Necesidades,Asistencias y Estadios
  function getAllBaseURL(url, elementDOM){
    fetch(url)
      .then((response) => response.json())
      .then(json => createOptionsSelectDOM(json, elementDOM));
  }

  function createOptionsSelectDOM(json, elementDOM){
    innerHTML(json, elementDOM);
    new MultiSelectTag(elementDOM, 'btn_reset_filter');
  }

  function innerHTML(json, elementDOM){
    let select = document.getElementById(elementDOM);
    if(elementDOM == 'needs' || elementDOM == 'needs_created'){
      for (e of json) {
        select.innerHTML+= "<option value="+e.id_Need+">"+e.needType+"</option>";
      }
    }
    if(elementDOM == 'assists' || elementDOM ==  'assistances_created'){
      for (e of json) {
        select.innerHTML+= "<option value="+e.id_Assistance+">"+e.type+"</option>";
      }
    }
    if(elementDOM == 'stadiums'){
      for (e of json) {
        select.innerHTML+= "<option value="+e.id_Stage+">"+e.stage_type+"</option>";
      }
    }
    if(elementDOM = 'estadios_checks'){
      for (e of json) {
        select.innerHTML+="<input type='checkbox' class='estadiosCheckboxes' value="+e.id_Stage+" name='estadiosCheckboxes' />";
        select.innerHTML+= "<label for='ideaNegocio' class='label_estadios'>"+e.stage_type+"</label>";
      }
    }
  }
//GET filtro de proyectos
function getFilterProjects(datos){
  let url = new URL(URLProject + "/filters/page/" + page);
  let params = new URLSearchParams(datos);
  fetch(url+"?"+params)
  .then(response => response.json())
  .then(json => mostrarTabla(json));
}

//OBTENER PROYECTOS
function getAllProjects(){
  fetch(URLProject + "/page/" + page)
 .then(response => response.json())
 .then(json => mostrarProyectos(json));
}

//MUESTRA FORMULARIO CARGA PROYECTOS
function mostrarCargaProyecto() {
  fetch("html/cargarProjects.html").then(
    function(response){
      response.text().then(
    function(texto){
      document.querySelector(".main-container").innerHTML = texto;
      document.querySelector(".iborrainputfile").addEventListener("click", saveAttachments);
      inicializarCargaProyecto();
      document.querySelector("#saveNecesidad").addEventListener("click", guardarNecesidades);
      document.querySelector("#saveAsistencia").addEventListener("click", guardarAsistencias);
      let id_emprendedor=1;
      partialRendercargaDatosEmprendedorYHistorial(".datosEmprendedor",id_emprendedor);
      //Configuro Ckeckboxs dinamico de estadios
      getAllBaseURL(URLStages, 'estadios_checks');
      //Configuro Dropdown de necesidades
      getAllBaseURL(URLNeeds, 'needs_created');
      //Configuro Dropdown de asistencias
      getAllBaseURL(URLAssitances, 'assistances_created');
    }
  );
    }
  );
}

function partialRendercargaDatosEmprendedorYHistorial(div,id_emprendedor){
  fetch("html/datosEmprendedor.html").then(
    function(response){
      response.text().then(
    function(texto){
      document.querySelector(div).innerHTML = texto;
      document.querySelector('.slideDownResponsible').addEventListener("click",()=>{
        mostrarResponsableProyecto(id_emprendedor);
      });
      document.querySelector('.slideDownHistory').addEventListener("click", mostrarHistorialProyecto);
    }
  );
    }
  );
}

function inicializarCargaProyecto(){
  let id = (id) => document.getElementById(id);
let classes = (classes) => document.getElementsByClassName(classes);
let title = id("title"),
description= id("description"), errorMsg = document.getElementsByClassName("error"),  
successIcon = classes("success-icon"),
failureIcon = classes("failure-icon");
let asistenciaTecnica=document.querySelector("#asistenciaTecnica");
let capacitacion=document.querySelector("#capacitacion");
let networking=document.querySelector("#networking");  
let financiamiento=document.querySelector("#financiamiento");  
let otraNecesidad=document.querySelector("#otraNecesidad");
let tecnica=document.querySelector("#tecnica");
let aplicacionFinanciamiento=document.querySelector("#lineasFinanciamiento");
let convocatoria=document.querySelector("#convocatoria");
let otraAsistencia=document.querySelector("#otraAsistencia");



document.getElementById("save").addEventListener("click", (e) => {
  e.preventDefault();
  let necesidadesCheckboxes = document.querySelectorAll('input[name="necesidadesCheckboxes"]:checked');
  necesidadesCheckboxes.forEach((checkbox) => {
      necesidades.push(checkbox.value);
  });
  let asistenciasCheckboxes = document.querySelectorAll('input[name="asistenciaCheckboxes"]:checked');
  asistenciasCheckboxes.forEach((checkbox) => {
      asistencias.push(checkbox.value);
  });
  let estadio= document.querySelector('input[name="estadiosCheckboxes"]:checked');
  saveAttachments();
  if((title.value!="" && title.value!="undefined")&&(description.value!="" && description.value!="undefined")&&necesidades.length>0&&
  asistencias.length>0 && estadio!=null){
    document.querySelector("#titleError").innerHTML ="";
    document.querySelector("#descriptionError").innerHTML ="";
    document.querySelector("#necesidadesError").innerHTML="";
    document.querySelector("#asistenciasError").innerHTML="";
    document.querySelector("#estadioError").innerHTML="";
    let successImg=document.getElementsByClassName("success-icon");
    successImg[0].style.opacity = "1";
    successImg[1].style.opacity = "1";
    let datos={
      "id_ProjectManager":1,
      "title":title.value,
      "description":description.value,
      "stage":estadio.value, 
      "assitanceType":
          asistencias,
      "files":
          attachments,
      "needs":
          necesidades,
      "id_Admin":1
    }      
    saveProject(datos);
    }else{
      if(title.value=="" || title.value=="undefined"){
        document.querySelector("#titleError").innerHTML ="Ingrese un título al proyecto";
      }else{
        document.querySelector("#titleError").innerHTML ="";
      }
      if(description.value=="" || description.value=="undefined"){
        document.querySelector("#descriptionError").innerHTML ="Ingrese una descripción al proyecto";
      }else{
        document.querySelector("#descriptionError").innerHTML ="";
      }
      if(necesidades.length==0){
        document.querySelector("#necesidadesError").innerHTML="Seleccione al menos una necesidad";
      }else{
        document.querySelector("#necesidadesError").innerHTML="";
      }
      if(asistencias.length==0){
        document.querySelector("#asistenciasError").innerHTML="Seleccione al menos un tipo de asistencia";
      }else{
        document.querySelector("#asistenciasError").innerHTML="";
      }
      if(estadio==null){
        document.querySelector("#estadioError").innerHTML="Seleccione un estadio";
      }else{
        document.querySelector("#estadioError").innerHTML="";
      }
    }
});
}



//GUARDAR ARCHIVOS ADJUNTOS
function saveAttachments(){
  let inputs = document.getElementsByClassName("inputfile");
	Array.prototype.forEach.call( inputs, function( input ){
		let label	 = input.nextElementSibling,
			labelVal = label.innerHTML;
      input.addEventListener('change', function( e ){
			  let fileName = " ";
			  if( this.files && this.files.length > 1 ){
          fileName = (this.getAttribute('data-multiple-caption') || '' ).replace( '{count}', this.files.length );
          for(let i=0;i<this.files.length;i++){
            attachments.push(e.target.value.split( '\\' ).pop());
        }
        } else
				  fileName = e.target.value.split( '\\' ).pop();
          attachments.push(fileName);
			  if( fileName ){
				  label.querySelector('span').innerHTML = fileName;
        }
			  else
				  label.innerHTML = labelVal;
		});
	});
}

//GUARDAR NECESIDADES
function guardarNecesidades(){
  event.preventDefault();
  necesidades.push(document.querySelector("#otraNecesidad").value);
  console.log(necesidades);
}

//GUARDAR ASISTENCIAS
 function guardarAsistencias(){
  event.preventDefault();
  asistencias.push(document.querySelector("#otraAsistencia").value);
  console.log(asistencias);
}

//POST
async function saveProject(datos){
  console.log(datos);
  await fetch(URLProject,{
    method: "POST",
    mode: 'cors',
    body: JSON.stringify(datos),
    headers: {"Access-Control-Allow-Origin":"*" ,},
    headers: {"Content-type": "application/json; charset=UTF-8",}
  })
  .then(response => response.json())
  .then(json => showSucess());
  //setTimeout(mostrarCargaProyecto,8000)
}

function showSucess(datos){
  document.querySelector(".generalSave").innerHTML= 
        "<p> Se han cargado los datos exitosamente</p>";
}

//SELECCIONAR SOLO UN ESTADIO
let checkedStage = null;
for (let CheckBox of document.getElementsByClassName('estadiosCheckboxes')){
	CheckBox.onclick = function(){
  	if(checkedStage!=null){
      checkedStage.checked = false;
      checkedStage = CheckBox;
    }
    checkedStage = CheckBox;
  }
}


//GET
function getProjectManager(id){
  fetch(URLProjectManager+ "/"+id)
    .then((response) => response.json())
    .then(json =>readDomProductManager(json));
     
}
//FUNCION PARA MOSTRAR DATOS EN HTML
function readDomProductManager(json){
 let divProductManager = document.querySelector("#projectManagerData");
 divProductManager.innerHTML = "";
 divProductManager.innerHTML=
                        " <div id='projectManagerData'>"
                        +"<p> Nombre: " + json.name + " " + json.surname +"</p>"
                        +"<p> Teléfono: "+ json.phone+ "</p>"
                        + "<p> Localidad: agregar en entidad </p>"
                        + "<p> Email: " +json.email+ "</p>"
                        + "<p> Ocupación: agregar en entidad </p>"
                        + "<p> Vinculación con UNICEN: agregar en entidad </p>"
                        + "<p> Facultad a la que pertenece: </p>"
                        + "<p> Medio de conocimiento del CICE: " + json.medioConocimientoCice + "</p>"
                        + "<p> Organización asociativa: agregar en entidad </p>"
                        + "</div>" ;
}

//MOSTRAR RESPONSABLE
function mostrarResponsableProyecto(id){
    let btn = document.getElementById('projectManagerData')
    if (btn.className === 'hiddenData') {
      getProjectManager(id);
      btn.className = 'showProjectManagerData';
      document.querySelector(".slideDownResponsible").innerHTML="<img src='img/icons8-flecha-contraer-50.png' class='slideDown'/>";
    } else {
        document.querySelector(".slideDownResponsible").innerHTML="<img src='img/expandir.png' class='slideDown'/>";
        btn.className = 'hiddenData';
    }
}

//MOSTRAR HISTORIAL
function mostrarHistorialProyecto(){
  let btn = document.getElementById('projectDataHistory')
  if (btn.className === 'hiddenData') {
    btn.className = 'showDataHistory';
    document.querySelector(".slideDownHistory").innerHTML="<img src='img/icons8-flecha-contraer-50.png' class='slideDown'/>";
  } else {
      document.querySelector(".slideDownHistory").innerHTML="<img src='img/expandir.png' class='slideDown'/>";
      btn.className = 'hiddenData';
  }
}


//MOSTRAR PROYECTO
function mostrarProyecto(proyecto){
  fetch("html/proyecto.html").then(
    function(response){
      response.text().then(
    function(texto){
      document.querySelector(".main-container").innerHTML = texto;
      document.querySelector("#titulo").innerHTML+=proyecto.title;
      document.querySelector("#descripcion").innerHTML+=proyecto.description;
      document.querySelector("#estadio").innerHTML+=proyecto.stage.stage_type;
      mostrarArray("#asistencia",proyecto.assitances,"elemento.type");
      mostrarArray("#necesidades",proyecto.needs,"elemento.needType");
      partialRendercargaDatosEmprendedorYHistorial(".datosEmprendedor",proyecto.projectManager.id_ProjectManager);
      mostrarArray("#files",proyecto.files,"elemento.file");
    
    }
  );
    }
  );
  
}


//PASAR ARRAY A LISTA()
function mostrarArray(contenedor,arreglo,dato){
  for (let i = 0; i < arreglo.length; i++) {
    var elemento=arreglo[i];
    if(contenedor == "#files"){//para adjuntos
      document.querySelector(contenedor).innerHTML+="<p class='p_file'>"+eval(dato)+"</p>";
    }else{//para necesidades y asistencias
      document.querySelector(contenedor).innerHTML+="<p><i class='fa fa-check-circle' aria-hidden='true'></i>"+eval(dato)+"</p>";

    }
  }
}

//GET PROYECTO
function getProyecto(){
  let id = this.id;
  fetch(URLProject+"/"+id)
  .then(response => response.json())
  .then(json => mostrarProyecto(json));
}
  
//BORRAR UN PROYECTO EN PARTICULAR
function borrarProyecto(id_Project,id_Admin){
  console.log(id_Project, id_Admin);
  fetch(URLProject + "/idProject/" + id_Project + "/idAdmin/" + id_Admin,{
    method: 'DELETE',
    headers: {"Access-Control-Allow-Origin":"*" ,},
    headers: {"Content-type": "application/json; charset=UTF-8",}
  })
  .then(response=>response.json())
  .then(getAllProjects());

}
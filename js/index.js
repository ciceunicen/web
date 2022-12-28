//VARIABLES GLOBALES
const URLProjectManager="http://localhost:8080/projectmanagers";
const URLProject="http://localhost:8080/projects";
let necesidades=[];
let asistencias = [];
let attachments=[];

document.addEventListener("DOMContentLoaded",function(){
  fetch("html/navbar.html").then(
    function(response){
      response.text().then(
    function(texto){
      document.querySelector(".navbar").innerHTML = texto;
      document.querySelector(".proyectos").addEventListener("click", mostrarProyectos);
      document.querySelector(".emprendedores").addEventListener("click", mostrarCargaProyecto);
      mostrarCargaProyecto();
    }
  );
    }
  );
})


function mostrarProyectos() {
  fetch("html/listProjects.html").then(
    function(response){
      response.text().then(
    function(texto){
      document.querySelector(".main-container").innerHTML = texto;
    }
  );
    }
  );
}


function mostrarCargaProyecto() {
  fetch("html/cargarProjects.html").then(
    function(response){
      response.text().then(
    function(texto){
      document.querySelector(".main-container").innerHTML = texto;
      document.querySelector('.slideDownResponsible').addEventListener("click", mostrarResponsableProyecto);
      document.querySelector('.slideDownHistory').addEventListener("click", mostrarHistorialProyecto);
      document.querySelector(".iborrainputfile").addEventListener("click", saveAttachments);
      inicializarCargaProyecto();
      document.querySelector("#saveNecesidad").addEventListener("click", guardarNecesidades);
      document.querySelector("#saveAsistencia").addEventListener("click", guardarAsistencias);
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
  setTimeout(mostrarCargaProyecto,8000)
}

function showSucess(datos){
  document.querySelector(".generalSave").innerHTML+= 
        "<p> Se han cargado los datos exitosamente<p>";
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
function getProjectManager(){
  fetch(URLProjectManager+ "/1")
    .then((response) => response.json())
    .then(json =>readDomProductManager(json));
     
}
//FUNCION PARA MOSTRAR DATOS EN HTML
function readDomProductManager(json){
 let divProductManager = document.querySelector("#projectManagerData");
 divProductManager.innerHTML = "";
 divProductManager.innerHTML+=
                       " <div class='showProjectManagerData' id='projectManagerData'>"
                        +"<h3> Nombre: " + json.name + " " + json.surname +"</h3>" 
                        +"<h3> Teléfono: "+ json.phone+ "</h3>"
                        + "<h3> Localidad: agregar en entidad </h3>"
                        + "<h3> Email: " +json.email+ "</h3>"
                        + "<h3> Ocupación: agregar en entidad </h3>"
                        + "<h3> Vinculación con UNICEN: agregar en entidad </h3>"
                        + "<h3> Facultad a la que pertenece: </h3>"
                        + "<h3> Medio de conocimiento del CICE: " + json.medioConocimientoCice + "</h3>"
                        + "<h3> Organización asociativa: agregar en entidad </h3>"
                        + "</div>" ;
}

//MOSTRAR RESPONSABLE
function mostrarResponsableProyecto(){
    let btn = document.getElementById('projectManagerData')
    if (btn.className === 'hiddenData') {
      getProjectManager();
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
  

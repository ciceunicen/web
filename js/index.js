
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
let necesidades=[];
let asistencias = [];
//  let estadios = [];
// let estadiosAProbar=null;
   
let attachments=[];
  
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
  let estadio= document.querySelector('input[name="estadiosCheckboxes"]:checked').value;
  saveAttachments();
  if((title.value!="" && title.value!="undefined")&&(description.value!="" && description.value!="undefined")){
    document.querySelector("#titleError").innerHTML ="";
    document.querySelector("#descriptionError").innerHTML ="";
    let successImg=document.getElementsByClassName("success-icon");
    successImg[0].style.opacity = "1";
    successImg[1].style.opacity = "1";
    let datos={
      "id_ProjectManager":2,
      "title":title.value,
      "description":description.value,
      "stage":estadio, 
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
        document.querySelector("#descriptionError").innerHTML ="";
      }
      if(description.value=="" || description.value=="undefined"){
        document.querySelector("#titleError").innerHTML ="";
        document.querySelector("#descriptionError").innerHTML ="Ingrese una descripción al proyecto";
      }
      if((title.value=="" || title.value=="undefined") && (description.value=="" || description.value=="undefined")){
        document.querySelector("#titleError").innerHTML ="Ingrese un título al proyecto";
        document.querySelector("#descriptionError").innerHTML ="Ingrese una descripción al proyecto";
      }
    }
});

//GUARDAR ARCHIVOS ADJUNTOS
document.querySelector(".iborrainputfile").addEventListener("click", saveAttachments);
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
document.querySelector("#saveNecesidad").addEventListener("click", ()=>{
  event.preventDefault();
  necesidades.push(document.querySelector("#otraNecesidad").value);
  console.log(necesidades);
})

//GUARDAR ASISTENCIAS
document.querySelector("#saveAsistencia").addEventListener("click", ()=>{
  event.preventDefault();
  asistencias.push(document.querySelector("#otraAsistencia").value);
  console.log(asistencias);
})

//POST
async function saveProject(datos){
  console.log(datos);
  await fetch("http://localhost:8080/Project",{
    method: "POST",
    mode: 'cors',
    body: JSON.stringify(datos),
    headers: {"Access-Control-Allow-Origin":"*" ,},
    headers: {"Content-type": "application/json; charset=UTF-8",}
  })
  .then(response => response.json())
  .then(json => showSucess(datos));
  //.catch(err => console.log(err));
}

function showSucess(datos){
  document.querySelector(".projectLoading").innerHTML= 
        "<div class='showData'>"
        +  "<p class='title'>Datos cargados<p>"
        +  "<p>Título del proyecto: "+ datos.title+ "</p>"
        +  "<p>Descripción: " +datos.description+"</p>"
        +  "<p>Necesidades: " + datos.needs+"</p>"
        +  "<p>Asistencias: " + datos.assitanceType+"</p>"
        +  "<p>Estadio: " + datos.stage+"</p>"
        +  "<p>Adjuntos: " + datos.files+"</p>"
        + "</div>";
 
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


// //GET

//  document.querySelector(".slideDownResponsible").addEventListener("click", getProjectManager());
//  async function getProjectManager(){
//  await fetch("http://localhost:8080/ProjectManager/getProjectManager/1")
//     .then((response) => response.json())
//     .then((data) => console.log(data));
//  }
// })
// .then(response => response.json())
// .then(json => console.log(json));

// fetch('http://example.com/movies.json')
//   .then((response) => response.json())
//   .then((data) => console.log(data));
//   const response= await fetch("https://localhost:8080/ProjectManager/getProjectManager/1");
//   const manager=response.json();
//   document.querySelector("#showProjectManager").innerHTML+=
//                           "<div>"
//                          +"<h3>Nombre: " + manager.name+"</h3>"
//                         //   <h3>Teléfono: </h3>
//                         //   <h3>Localidad:</h3>
//                         //   <h3>Email:</h3>
//                         //   <h3>Ocupación:</h3>
//                         //   <h3>Vinculación con UNICEN</h3>
//                         //   <h3>Facultad a la que pertenece:</h3>
//                         //   <h3>Medio de conocimiento del CICE:</h3>
//                         //   <h3>Organización asociativa</h3>
//                         // </div>"
   
// }

//}


//MOSTRAR RESPONSABLE
document.querySelector('.slideDownResponsible').addEventListener('click', ()=>{
  let btn = document.getElementById('projectManagerData')
  if (btn.className === 'hiddenData') {
    btn.className = 'showProjectManagerData';
    document.querySelector(".slideDownResponsible").innerHTML="<img src='img/icons8-flecha-contraer-50.png' class='slideDown'/>";
  } else {
      document.querySelector(".slideDownResponsible").innerHTML="<img src='img/expandir.png' class='slideDown'/>";
      btn.className = 'hiddenData';
  }
});

//MOSTRAR HISTORIAL
document.querySelector('.slideDownHistory').addEventListener('click', ()=>{
  let btn = document.getElementById('projectDataHistory')
  if (btn.className === 'hiddenData') {
    btn.className = 'showDataHistory';
    document.querySelector(".slideDownHistory").innerHTML="<img src='img/icons8-flecha-contraer-50.png' class='slideDown'/>";
  } else {
      document.querySelector(".slideDownHistory").innerHTML="<img src='img/expandir.png' class='slideDown'/>";
      btn.className = 'hiddenData';
  }
});

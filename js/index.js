
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
let estadios = [];
let estadiosAProbar=null;
   
let attachments=[];
  
document.getElementById("save").addEventListener("click", (e) => {
  e.preventDefault();
  engine(title, 0, "Ingrese un título al proyecto");
  engine(description, 1, "Ingrese una descripción al proyecto");
  title=title.value;
  description=description.value;
  let necesidadesCheckboxes = document.querySelectorAll('input[name="necesidadesCheckboxes"]:checked');
  necesidadesCheckboxes.forEach((checkbox) => {
      necesidades.push(checkbox.value);
      //console.log(necesidades);
  });
  let asistenciasCheckboxes = document.querySelectorAll('input[name="asistenciaCheckboxes"]:checked');
  asistenciasCheckboxes.forEach((checkbox) => {
      asistencias.push(checkbox.value);
     // console.log(asistencias);
  });
    estadiosAProbar = document.querySelector('input[name="estadiosCheckboxes"]:checked').value;
  // let estadiosCheckboxes = document.querySelectorAll('input[name="estadiosCheckboxes"]:checked');

  // estadiosCheckboxes.forEach((checkbox) => {
  //     estadios.push(checkbox.value);
  //     console.log(estadios);
  // });
  saveAttachments();
  // attachments.forEach((attachment)=>{
  //   console.log(attachment);
  // })
  let datos={
    "id_ProjectManager":2,
    "title":title,
    "description":description,
    "stage":estadiosAProbar, 
    "assitanceType":
        asistencias,
    "files":
        attachments,
    "needs":
        necesidades,
    "id_Admin":1
  }
  saveProject(datos);
         
});

let engine = (id, serial, message) => {
  if (id.value.trim() === "") {
    errorMsg[serial].innerHTML = message;
    id.style.border = "2px solid red";
    // icons
    failureIcon[serial].style.opacity = "1";
    successIcon[serial].style.opacity = "0";
  } else {
    errorMsg[serial].innerHTML = "";
    id.style.border = "2px solid green";
     // icons
     failureIcon[serial].style.opacity = "0";
     successIcon[serial].style.opacity = "1";
  }
};

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

document.querySelector("#saveNecesidad").addEventListener("click", ()=>{
  event.preventDefault();
  // console.log(document.querySelector("#otraNecesidad").value);
  necesidades.push(document.querySelector("#otraNecesidad").value);
})

document.querySelector("#saveAsistencia").addEventListener("click", ()=>{
  event.preventDefault();
  // console.log(document.querySelector("#otraAsistencia").value);
  necesidades.push(document.querySelector("#otraAsistencia").value);
})
//POST
async function saveProject(datos){
  await fetch("http://localhost:8080/Project",{
    method: "POST",
    mode: 'cors',
    body: JSON.stringify(datos),
    headers: {"Access-Control-Allow-Origin":"*" ,},
    headers: {"Content-type": "application/json; charset=UTF-8",}
  })
  .then(response => response.json())
  .then(json => console.log(json));
  //.catch(err => console.log(err));
}


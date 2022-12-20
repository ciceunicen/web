
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
  necesidades.push(document.querySelector("#otraNecesidad").value);
  console.log(necesidades);
})

document.querySelector("#saveAsistencia").addEventListener("click", ()=>{
  event.preventDefault();
  asistencias.push(document.querySelector("#otraAsistencia").value);
  console.log(asistencias);
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

// document.querySelector("#slideUp").addEventListener("click", getProjectManager());
//  function getProjectManager(){
//  fetch("https://localhost:8080/ProjectManager/getProjectManager/1")
//     .then((response) => response.json())
//     .then((data) => console.log(data));
  
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


// document.querySelector("#slideUp").addEventListener("click",(event)=>{
 
//   if(!event.target.matches('.drop-button')) {
//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     var i;
//     for (i = 0;  i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       //Busca dentro de drop-content los elementos con la clase show
//       if (openDropdown.classList.contains('show')){
//         //elimina la clase show de los elementos dentro de drop-content
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// });



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

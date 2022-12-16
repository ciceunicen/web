
let id = (id) => document.getElementById(id);
let classes = (classes) => document.getElementsByClassName(classes);
let title1 = id("title"),
description1= id("description"), errorMsg = document.getElementsByClassName("error"),  
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

document.querySelector("#save").addEventListener('click', (event) => {
            let necesidadesCheckboxes = document.querySelectorAll('input[name="necesidadesCheckboxes"]:checked');
            let output = [];
            necesidadesCheckboxes.forEach((checkbox) => {
                output.push(checkbox.value);
            });
            // alert(output);
            let asistenciasCheckboxes = document.querySelectorAll('input[name="asistenciaCheckboxes"]:checked');
            let output2 = [];
            asistenciasCheckboxes.forEach((checkbox) => {
                output2.push(checkbox.value);
            });
            // alert(output2);
});    
// Adjuntar archivos
// Seleccionar 
  
document.getElementById("save").addEventListener("click", (e) => {
  e.preventDefault();
  engine(title1, 0, "Ingrese un título al proyecto");
  engine(description1, 1, "Ingrese una descripción al proyecto");

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




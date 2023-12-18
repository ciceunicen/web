//VARIABLES GLOBALES
const URLProjectManager = "http://localhost:8080/projectmanagers";
const URLNeeds = "http://localhost:8080/needs";
const URLAssitances = "http://localhost:8080/assistances";
const URLStages = "http://localhost:8080/stages";
const URLUsers = "http://localhost:8080/usuarios/rol/2";
let necesidades = [];
let asistencias = [];
let attachments = [];
let token = localStorage.getItem("token");


//Para guardar los id por lo que se va a filtrar
var json_filters = {};
//variables que guardan comportamiento de multiselects
var multiSelectsNeedsCreated;
var multiSelectsAssistancesCreated;

document.addEventListener("DOMContentLoaded", function () {
  let user = JSON.parse(localStorage.getItem('usuario'));
  console.log(user);
  let rolUser = user.rolType.toLowerCase();

  // Muestra contenido según el rol del usuario
  if (rolUser === "emprendedor") {
    mostrarHomeEmprendedor();
  } else {
    // Para otros roles (admin/super admin)
    mostrarHome();
  }
})


//Pinta de color verde obscuro el botón del navegador en el que se encuentra la página.
function drawClickNav(click_nav) {
  //traigo del DOM todos los botones de la barra de navegación
  let link_nav = document.querySelectorAll(".click_nav");
  //los recorro
  link_nav.forEach(link => {
    //aplico clase si es en el que se hizo click
    if (link.id == click_nav) {
      link.classList.add("click");
    } else {//remuevo clase si no se le hizo click
      link.classList.remove("click");
    }
  });
}

//GET All reutilizable del Filtro para Necesidades,Asistencias y Estadios
function getAllBaseURL(url, elementDOM) {
  return fetch(url, {
    mode: 'cors',

    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then((response) => response.json())
    .then(json => createOptionsSelectDOM(json, elementDOM));
}

function createOptionsSelectDOM(json, elementDOM) {
  innerHTML(json, elementDOM);
  if (elementDOM == 'needs_created') {
    multiSelectsNeedsCreated = MultiSelectTag(elementDOM, 'btn_reset_filter', 'saveNecesidad');
  } else if (elementDOM == 'assistances_created') {
    multiSelectsAssistancesCreated = MultiSelectTag(elementDOM, 'btn_reset_filter', 'saveAsistencia');
  } else if (elementDOM != 'estadios_checks') {
    new MultiSelectTag(elementDOM, 'btn_reset_filter');
  }
}
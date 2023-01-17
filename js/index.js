//VARIABLES GLOBALES
const URLProjectManager = "http://localhost:8080/projectmanagers";
const URLNeeds = "http://localhost:8080/needs";
const URLAssitances = "http://localhost:8080/assistances";
const URLStages = "http://localhost:8080/stages";
let necesidades = [];
let asistencias = [];
let attachments = [];


//Para guardar los id por lo que se va a filtrar
var json_filters = {};
//variables que guardan comportamiento de multiselects
var multiSelectsNeedsCreated;
var multiSelectsAssistancesCreated;

document.addEventListener("DOMContentLoaded", function () {
  mostrarHome();
})


//Pinta de color verde obscuro el botón del navegador en el que se encuentra la página.
function drawClickNav(click_nav) {
  //traiigo del DOM todos los botones de la barra de navegación
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

//AGREGA EL DESPLEGABLE PARA ENTRAR EN LOS PROYECTOS BORRADOS
function configDropdowProjectsRemoved() {
  //Agrego Dropdown de sección de proyectos eliminados
  //clase que guarda funciones del dropdown
  let sectionDelete = new DropdownBtnSectionProjectsDelete();
  //renderizo el dropdown (es un partialrender)
  sectionDelete.showDropdown('div_dropdown_projects_removed');
  //ocupo setTimeout ya que desde la clase después de un fetch no me toma las finciones propias de la clase, no reconoce el this.
  setTimeout(() => {
    //busco del DOM botón que cambia de pantalla
    let btn_section_projects_removed = document.getElementById('btn_section_projects_removed');
    //agrego eventos de animación de dropdown
    sectionDelete.addEventListenerArrowRight(btn_section_projects_removed);
    //cambio de pantalla a proyectos eliminados
    btn_section_projects_removed.addEventListener("click", () => {
      //cambio de pantalla a proyectos eliminados(es un partialrender)
      showTableProjectsRemoved();
      //pinto otra vez el dropdown (es un partialrender)
      sectionDelete.showDropdown('div_dropdown_projects_removed');
      //espero a que se pinte el dropdown y agrego eventos, no los toma sino.
      setTimeout(() => {
        //////////////////////////////
        //ACÁ AGREGAR FETCH PARA TRAER PROYECTOS ELIMINADOS Y CARGARLOS EN LA TABLA.
        ///////////////////////////////
        //cambio que botón de cambio de pantalla se muestra, muestro uno que lleve a la tabla de proyectos
        sectionDelete.changeBtnScreenProjectsRemoved()
        //Agrego animaciones al dropdown
        sectionDelete.addEventListenerArrowRight(btn_section_projects);
        //busco del DOM botón que cambia de pantalla
        //evento que cambia de pantalla a tabla proyectos
        document.getElementById('btn_section_projects').addEventListener("click", () => { page=1;getAllProjects().then(json => mostrarProyectos(json)); });
      }, 500);
    });
  }, 500);
}



//GET All reutilizable del Filtro para Necesidades,Asistencias y Estadios
function getAllBaseURL(url, elementDOM) {
  fetch(url)
    .then((response) => response.json())
    .then(json => createOptionsSelectDOM(json, elementDOM));
}

function createOptionsSelectDOM(json, elementDOM){
    innerHTML(json, elementDOM);
    if(elementDOM == 'needs_created'){
      multiSelectsNeedsCreated = MultiSelectTag(elementDOM, 'btn_reset_filter', 'saveNecesidad');
    }else if(elementDOM == 'assistances_created'){
      multiSelectsAssistancesCreated = MultiSelectTag(elementDOM, 'btn_reset_filter', 'saveAsistencia');
    }else if(elementDOM != 'estadios_checks'){
      new MultiSelectTag(elementDOM, 'btn_reset_filter');
    }
}

//GET
function getProjectManager(id) {
  fetch(URLProjectManager + "/" + id)
    .then((response) => response.json())
    .then(json => readDomProductManager(json));

}



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
        document.getElementById('btn_section_projects').addEventListener("click", () => { getAllProjects().then(json => mostrarProyectos(json)); });
      }, 500);
    });
  }, 500);
}

function captureSelectedOptions() {
  json_filters = { filters: [] };
  //capturo que necesidades fueron seleccionadas
  let needsOptions = document.querySelector("#needs");
  //json_filters.needs = [];
  for (var option of needsOptions.options) {
    if (option.selected) {
      json_filters.filters.push(option.label);
    }
  }
  //capturo que asistencias fueron seleccionadas
  let assitemcesOptions = document.querySelector("#assists");
  //json_filters.assitences = []
  for (var option of assitemcesOptions.options) {
    if (option.selected) {
      json_filters.filters.push(option.label);
    }
  }
  //capturo que Estadios fueron seleccionados
  let assitemcesStadiums = document.querySelector("#stadiums");
  //json_filters.stadiums = []
  for (var option of assitemcesStadiums.options) {
    if (option.selected) {
      json_filters.filters.push(option.label);
    }
  }
  getFilterProjects(json_filters);
  //console.log(json_filters);
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

  function innerHTML(json, elementDOM){
    let select = document.getElementById(elementDOM);
    if(elementDOM == 'needs'){
      for (e of json) {
        select.innerHTML+= "<option value="+e.id_Need+">"+e.needType+"</option>";
      }
    }
    if(elementDOM == 'assists'){
      for (e of json) {
        select.innerHTML+= "<option value="+e.id_Assistance+">"+e.type+"</option>";
      }
    }
    if(elementDOM == 'stadiums'){
      for (e of json) {
        select.innerHTML+= "<option value="+e.id_Stage+">"+e.stage_type+"</option>";
      }
    }
    if(elementDOM == 'estadios_checks'){
      for (e of json) {
        select.innerHTML+="<input type='checkbox' class='estadiosCheckboxes' value="+e.id_Stage+" name='estadiosCheckboxes' />";
        select.innerHTML+= "<label for="+e.stage_type+" class='label_estadios'>"+e.stage_type+"</label>";
      }
    }
    if(elementDOM == 'assistances_created'){
      for (e of json){
        if(e.default){
          document.getElementById('asistencias_checks').innerHTML+= 
          "<input type='checkbox' class='estadiosCheckboxes' value="+e.id_Assistance+" name='asistenciaCheckboxes' />"
          +"<label for="+e.type+" class='label_estadios'>"+e.type+"</label>";
        }else{
          select.innerHTML+= "<option value="+e.id_Assistance+">"+e.type+"</option>";
        }
      }
    }
    if(elementDOM == 'needs_created'){
      for (e of json){
        if(e.default){
          document.getElementById('necesidades_checks').innerHTML+= 
          "<input type='checkbox' class='necesidadesCheckboxes' value="+e.id_Need+" name='asistenciaCheckboxes' />"
          +"<label for="+e.needType+" class='label_estadios'>"+e.needType+"</label>";
        }else{
          select.innerHTML+= "<option value="+e.id_Need+">"+e.needType+"</option>";         
        }
      }
    }
  }
}



function inicializarCargaProyecto() {
  let id = (id) => document.getElementById(id);
  let classes = (classes) => document.getElementsByClassName(classes);
  let title = id("title"),
    description = id("description"), errorMsg = document.getElementsByClassName("error"),
    successIcon = classes("success-icon"),
    failureIcon = classes("failure-icon");
  let asistenciaTecnica = document.querySelector("#asistenciaTecnica");
  let capacitacion = document.querySelector("#capacitacion");
  let networking = document.querySelector("#networking");
  let financiamiento = document.querySelector("#financiamiento");
  let otraNecesidad = document.querySelector("#otraNecesidad");
  let tecnica = document.querySelector("#tecnica");
  let aplicacionFinanciamiento = document.querySelector("#lineasFinanciamiento");
  let convocatoria = document.querySelector("#convocatoria");
  let otraAsistencia = document.querySelector("#otraAsistencia");
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
    let estadio = document.querySelector('input[name="estadiosCheckboxes"]:checked');
    saveAttachments();
    if ((title.value != "" && title.value != "undefined") && (description.value != "" && description.value != "undefined") && necesidades.length > 0 &&
      asistencias.length > 0 && estadio != null) {
      document.querySelector("#titleError").innerHTML = "";
      document.querySelector("#descriptionError").innerHTML = "";
      document.querySelector("#necesidadesError").innerHTML = "";
      document.querySelector("#asistenciasError").innerHTML = "";
      document.querySelector("#estadioError").innerHTML = "";
      let successImg = document.getElementsByClassName("success-icon");
      successImg[0].style.opacity = "1";
      successImg[1].style.opacity = "1";
      let datos = {
        "id_ProjectManager": 1,
        "title": title.value,
        "description": description.value,
        "stage": estadio.value,
        "assistanceType":
          asistencias,
        "files":
          attachments,
        "needs":
          necesidades,
        "id_Admin": 1
      }
      saveProject(datos);
    } else {
      if (title.value == "" || title.value == "undefined") {
        document.querySelector("#titleError").innerHTML = "Ingrese un título al proyecto";
      } else {
        document.querySelector("#titleError").innerHTML = "";
      }
      if (description.value == "" || description.value == "undefined") {
        document.querySelector("#descriptionError").innerHTML = "Ingrese una descripción al proyecto";
      } else {
        document.querySelector("#descriptionError").innerHTML = "";
      }
      if (necesidades.length == 0) {
        document.querySelector("#necesidadesError").innerHTML = "Seleccione al menos una necesidad";
      } else {
        document.querySelector("#necesidadesError").innerHTML = "";
      }
      if (asistencias.length == 0) {
        document.querySelector("#asistenciasError").innerHTML = "Seleccione al menos un tipo de asistencia";
      } else {
        document.querySelector("#asistenciasError").innerHTML = "";
      }
      if (estadio == null) {
        document.querySelector("#estadioError").innerHTML = "Seleccione un estadio";
      } else {
        document.querySelector("#estadioError").innerHTML = "";
      }
    }
  });
}



//GUARDAR ARCHIVOS ADJUNTOS
function saveAttachments() {
  let inputs = document.getElementsByClassName("inputfile");
  Array.prototype.forEach.call(inputs, function (input) {
    let label = input.nextElementSibling,
      labelVal = label.innerHTML;
    input.addEventListener('change', function (e) {
      let fileName = " ";
      if (this.files && this.files.length > 1) {
        fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
        for (let i = 0; i < this.files.length; i++) {
          attachments.push(e.target.value.split('\\').pop());
        }
      } else
        fileName = e.target.value.split('\\').pop();
      attachments.push(fileName);
      if (fileName) {
        label.querySelector('span').innerHTML = fileName;
      }
      else
        label.innerHTML = labelVal;
    });
  });
}

//GUARDAR NECESIDADES
function guardarNecesidades(){
  let json = {"needType":document.getElementById('new_need').value};
  fetch(URLNeeds,{
    method: "POST",
    mode: 'cors',
    body: JSON.stringify(json),
    headers: {"Access-Control-Allow-Origin":"*" ,},
    headers: {"Content-type": "application/json; charset=UTF-8",}
  })
  .then(response => response.json())
  .then(json => actualizacionSelectNecesidades(json));
}

//GUARDAR ASISTENCIAS
 function guardarAsistencias(){
  let json = {"type":document.getElementById('new_assistance').value};
  fetch(URLAssitances,{
    method: "POST",
    mode: 'cors',
    body: JSON.stringify(json),
    headers: {"Access-Control-Allow-Origin":"*" ,},
    headers: {"Content-type": "application/json; charset=UTF-8",}
  })
  .then(response => response.json())
  .then(json => actualizacionSelectAsistencias(json));
}



function showSucess(datos) {
  document.querySelector(".generalSave").innerHTML =
    "<p> Se han cargado los datos exitosamente</p>";
}

//SELECCIONAR SOLO UN ESTADIO
let checkedStage = null;
for (let CheckBox of document.getElementsByClassName('estadiosCheckboxes')) {
  CheckBox.onclick = function () {
    if (checkedStage != null) {
      checkedStage.checked = false;
      checkedStage = CheckBox;
    }
    checkedStage = CheckBox;
  }
}


//GET
function getProjectManager(id) {
  fetch(URLProjectManager + "/" + id)
    .then((response) => response.json())
    .then(json => readDomProductManager(json));

}


//MOSTRAR RESPONSABLE
function mostrarResponsableProyecto(id) {
  let btn = document.getElementById('projectManagerData')
  if (btn.className === 'hiddenData') {
    getProjectManager(id);
    btn.className = 'showProjectManagerData';
    document.querySelector(".slideDownResponsible").innerHTML = "<img src='img/icons8-flecha-contraer-50.png' class='slideDown'/>";
  } else {
    document.querySelector(".slideDownResponsible").innerHTML = "<img src='img/expandir.png' class='slideDown'/>";
    btn.className = 'hiddenData';
  }
}

//MOSTRAR HISTORIAL
function mostrarHistorialProyecto() {
  let btn = document.getElementById('projectDataHistory')
  if (btn.className === 'hiddenData') {
    btn.className = 'showDataHistory';
    document.querySelector(".slideDownHistory").innerHTML = "<img src='img/icons8-flecha-contraer-50.png' class='slideDown'/>";
  } else {
    document.querySelector(".slideDownHistory").innerHTML = "<img src='img/expandir.png' class='slideDown'/>";
    btn.className = 'hiddenData';
  }
}



function actualizacionSelectAsistencias(json){
  let select = document.getElementById('assistances_created');
  let option = document.createElement('option');
  option.setAttribute('value', json.id_Assistance);
  option.setAttribute('label', json.type);
  option.selected = true;
  select.appendChild(option);
  multiSelectsAssistancesCreated.updateSelect(json.id_Assistance);
}

function cargaRenderNecesidades(){
  fetch('html/cargaDeNecesidades.html').then(
    function(response){
      response.text().then(
    function(texto){
      document.querySelector(".datosNecesidades").innerHTML = texto;
      document.querySelector("#saveNecesidad").addEventListener("click", guardarNecesidades);
      //Configuro Dropdown de necesidades
      getAllBaseURL(URLNeeds, 'needs_created');
    });
  });  
}
function cargaRenderAsistencia(){
  fetch('html/cargaDeAsistencias.html').then(
    function(response){
      response.text().then(
    function(texto){
      document.querySelector(".datosAsistencias").innerHTML = texto;
      document.querySelector("#saveAsistencia").addEventListener("click", guardarAsistencias);
      //Configuro Dropdown de asistencias
      getAllBaseURL(URLAssitances, 'assistances_created');
    });
  });   
}
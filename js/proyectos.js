let page = 1;
const URLProject = "http://localhost:8080/projects";
const URLEntrepreneurProjects = "http://localhost:8080/emprendedores";
const URLFiles = "http://localhost:8080/files";
let statusFile = true;//guarda si los archivos cargados tienen una estención válida.
//METODOS DE ABM

//POST
async function saveProject(datos) {

  await fetch(URLProject, {
    method: "POST",
    mode: 'cors',
    body: JSON.stringify(datos),
    headers: { "Access-Control-Allow-Origin": "*", },
    headers: { "Content-type": "application/json; charset=UTF-8", }
  })
    .then(response => response.json())
    .then(json => {
      showSucess();
      setTimeout(mostrarCargaProyecto(json.projectManager.id_ProjectManager), 5000);
    });
}

//BORRAR UN PROYECTO EN PARTICULAR
function borrarProyecto(id_Project, id_Admin, projectManager = 0) {
  let token = localStorage.getItem("token");

  page = 1;
  fetch(URLProject + "/idProject/" + id_Project + "/idAdmin/" + id_Admin, {
    method: 'DELETE',
    mode: 'cors',

    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then(response => {
      if (projectManager != 0) {
        getAllProjectsByProjectManager(projectManager).then(lista => {
          mostrarTabla(lista, false, true);
          mostrarPaginado(lista.totalPages, "proyectosEmprendedor", [projectManager]);
        })
      } else {
        getAllProjects().then(lista => {
          mostrarPaginado(lista.totalPages, "proyectos");
          mostrarTabla(lista, false);
        })
      }
    });
}

//GET PROYECTO
function getProyecto(id) {
  return fetch(URLProject + "/" + id,{
    mode: 'cors',

    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then(response => response.json())
    .then(json => { return json });
}

//GET DE TODOS LOS PROYECTOS
function getAllProjects() {
  let token = localStorage.getItem("token")
  console.log(token)
  return fetch(URLProject + "/page/" + page, {
    mode: 'cors',
    "headers": {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
    },

  })
    .then(response => response.json())
    .then(json => { return json });
}

//GET DE TODOS LOS PROYECTOS de un emprendedor
function getAllProjectsByEntrepreneur(entrepreneurId) {
  let token = localStorage.getItem("token")
  console.log(token)
  return fetch(URLEntrepreneurProjects + `/${entrepreneurId}/mis_proyectos`, {
    mode: 'cors',
    "headers": {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
    },

  })
      .then(response => response.json())
      .then(json => { return json });
}

//GET DE TODOS LOS PROYECTOS BORRADOS
function getAllDeleteProjects(page = 1) {
  return fetch(URLProject + "/removed/page/" + page,{
    mode: 'cors',
    "headers": {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
    },

  })
    .then((response) => response.json())
    .then(json => { return json });
}

//GET DE LOS PROYECTOS FILTRADOS
function getFilterProjects(datos, pagina) {
  let url = new URL(URLProject + "/filters/page/" + pagina);
  let params = new URLSearchParams(datos);
  return fetch(url + "?" + params,{
    mode: 'cors',
    "headers": {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
    },

  })
    .then(response => response.json())
    .then(json => { return json });
}

//GET HISTORIAL DE PROYECTO
function getProjectHistory(id) {
  return fetch(URLProject + "/" + id + "/administrationRecords/page/" + page,{
    mode: 'cors',
    "headers": {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
    },

  })
    .then(response => response.json())
    .then(json => { return json });
}

//MODIFICAR DATOS DE UN PROYECTO
async function modificarProyecto(id_proyecto, proyecto) {
  await fetch(URLProject + "/" + id_proyecto, {
    method: "PUT",
    mode: 'cors',
    body: JSON.stringify(proyecto),
    headers: { "Access-Control-Allow-Origin": "*", },
    headers: { "Content-type": "application/json; charset=UTF-8", }
  })
    .then(response => { response.json().then(json => mostrarProyecto(json)) })
}

function getNecesidadesoAsistenciasCreadas(URL) {
  return fetch(URL)
    .then(response => response.json())
    .then(json => { return json });
}

//BORRAR FILES DE UN PROYECTO EN PARTICULAR
async function borrarFilesProyecto(id_Project, idFile = false) {
  let url;
  if (!idFile) {
    url = URLProject + "/removeFiles/idProject/" + id_Project;
  } else {
    url = URLFiles + "/idFile/" + idFile;;
  }
  await fetch(url, {
    method: 'DELETE',
    headers: { "Access-Control-Allow-Origin": "*", },
    headers: { "Content-type": "application/json; charset=UTF-8", }
  })
    .then(response => response);
}

//TODO DE LA SECCION DE LISTA DE PROYECTOS

//maneja el funcionamiento del paginado de la tabla de proyectos
function comportamientoPaginado(pages, datosFiltro, tablaUtilizada) {
  comportamientoBotonesPaginado(pages);
  document.querySelector("#nextPage").addEventListener("click", () => {
    if (page <= pages) {
      page++;
      cambiarNumeroPaginado(datosFiltro, tablaUtilizada, pages);
    }
  });
  document.querySelector("#previousPage").addEventListener("click", () => {
    if (page > 1) {
      page--;
      cambiarNumeroPaginado(datosFiltro, tablaUtilizada, pages);
    }
  });
}

//Cambia el numero que se muestra en la seccion de paginado
function cambiarNumeroPaginado(datosFiltro, tablaUtilizada, pages) {
  document.querySelector("#pageNumber").innerHTML = page;
  if (tablaUtilizada == "proyectosFiltrados") {
    getFilterProjects(datosFiltro, page).then(json => {
      mostrarTabla(json, false);
      comportamientoBotonesPaginado(pages);
    });
  } else if (tablaUtilizada == "proyectos") {
    getAllProjects(page).then(json => {
      mostrarTabla(json, false);
      comportamientoBotonesPaginado(pages);
    });
  } else if (tablaUtilizada == "proyectosEliminados") {
    getAllDeleteProjects(page).then(json => {
      mostrarTabla(json, true);
      comportamientoBotonesPaginado(pages);
    });
  } else if (tablaUtilizada == "emprendedores") {
    getAllProjectManagers(page).then(json => {
      generarTablaEmprendedores(json);
      comportamientoBotonesPaginado(pages);
    })
  } else if (tablaUtilizada == "proyectosEmprendedor") {
    getAllProjectsByProjectManager(datosFiltro[0]).then(json => {
      mostrarTabla(json, false);
      comportamientoBotonesPaginado(pages);
    });
    }else if (tablaUtilizada == "proyectos") {
      getAllProjectsByEntrepreneur(page).then(json => {
        mostrarTablaProyectosEmprendedor(json);
        comportamientoBotonesPaginado(pages);
      });
  }
}

//Activa o desactiva los botones de paginado
function comportamientoBotonesPaginado(pages) {
  if (page == 1) {
    document.querySelector("#previousPage").ariaDisabled;
    document.querySelector("#previousPage").style.color = "grey";
    document.querySelector("#previousPage").setAttribute("disabled", "true");
  } else if (document.querySelector("#previousPage").hasAttribute("disabled")) {
    document.querySelector("#previousPage").ariaHidden;
    document.querySelector("#previousPage").style.color = "#0d6efd";
    document.querySelector("#previousPage").removeAttribute("disabled");
  }
  if (page == pages || pages == 0) {
    document.querySelector("#nextPage").style.color = "grey";
    document.querySelector("#nextPage").setAttribute("disabled", "true");
    document.querySelector("#nextPage").ariaDisabled;
  } else if (document.querySelector("#nextPage").hasAttribute("disabled")) {
    document.querySelector("#nextPage").ariaHidden;
    document.querySelector("#nextPage").style.color = "#0d6efd";
    document.querySelector("#nextPage").removeAttribute("disabled");
  }
}
//Generar tabla de proyectos
function mostrarTabla(json, borrados, projectManager = false) {
  let array = json.content;
  let container;
  if (borrados) {
    container = document.querySelector("#tbody_projects_removed");
  } else {
    container = document.querySelector(".list");
  }
  container.innerHTML = "";
  for (let i = array.length - 1; i >= 0; i--) {
    const proyecto = array[i];
    var row = container.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    if (borrados) {
      var cell5 = row.insertCell(4);
      cell1.innerHTML = proyecto.project.title;
      cell2.innerHTML = proyecto.project.projectManager.name + " " + proyecto.project.projectManager.surname;
      cell3.innerHTML = proyecto.project.stage.stage_type;
      cell4.innerHTML = proyecto.id_admin;
      cell5.innerHTML = proyecto.date_delete;
    } else {
      cell1.innerHTML = proyecto.title;
      cell2.innerHTML = proyecto.projectManager.name + " " + proyecto.projectManager.surname;
      cell3.innerHTML = proyecto.stage.stage_type;
      var input = document.createElement("input");
      input.setAttribute("type", "button");
      input.setAttribute("value", "Ver más");
      input.setAttribute("id", proyecto.id_Project);
      input.setAttribute("class", "btn_save_green verMas");
      cell4.appendChild(input);
      document.querySelector(".verMas").addEventListener("click", () => { getProyecto(proyecto.id_Project).then(json => mostrarProyecto(json)) });
      //creo botón de borrar para cada proyecto
      var btn_delete = document.createElement("input");
      btn_delete.setAttribute("type", "button");
      btn_delete.setAttribute("value", "Borrar");
      btn_delete.setAttribute("id", proyecto.id_Project);
      btn_delete.setAttribute("class", "btn_save_green btn_borrar");
      //le agrego el evento al botón de eliminar
      let id_Admin = proyecto.administrador;
      if (projectManager) {
        btn_delete.addEventListener("click", () => { borrarProyecto(proyecto.id_Project, id_Admin, proyecto.projectManager.id_ProjectManager) });
      } else {
        btn_delete.addEventListener("click", () => { borrarProyecto(proyecto.id_Project, id_Admin) });
      }
      cell4.appendChild(btn_delete);
    }
  }
}

//muestra los proyectos de un emprendedor
function mostrarTablaProyectosEmprendedor(json) {
  let array = json;

  if (Array.isArray(array) && array.length > 0) {
    let container = document.querySelector(".list");
    container.innerHTML = "";
    for (let i = array.length - 1; i >= 0; i--) {
      const proyecto = array[i];
      var row = container.insertRow(0);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);

      cell1.innerHTML = proyecto.title;
      cell2.innerHTML = proyecto.projectManager.name + " " + proyecto.projectManager.surname;
      cell3.innerHTML = proyecto.stage.stage_type;
      let input = document.createElement("input");
      input.setAttribute("type", "button");
      input.setAttribute("value", "Ver más");
      input.setAttribute("id", proyecto.id_Project);
      input.setAttribute("class", "btn_save_green verMas");
      cell4.appendChild(input);
      //revisar que anden TODOS los botones ver mas. Me parece que solo hace andar al primero. sino intentar el codigo
      //comentado de abajo
      document.querySelector(".verMas").addEventListener("click", () => { getProyecto(proyecto.id_Project).then(json => mostrarProyecto(json)) });
      //delegación de eventos para asignar el evento a todos los botones de manera más eficiente
      /*container.addEventListener("click", (event) => {
        if (event.target.classList.contains("verMas")) {
          const projectId = event.target.id;
          getProyecto(projectId).then(json => mostrarProyecto(json));
        }
      });*/
    }
  } else {
    console.error("El array de proyectos está vacío o no está definido.");
  }
}

//CAPTURA LAS OPCIONES SELECCIONADAS DEL FILTRO DE PROYECTOS
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

  page = 1;
  getFilterProjects(json_filters, page).then(json => {
    mostrarTabla(json, false);
    mostrarPaginado(json.totalPages - 1, "proyectosFiltrados", json_filters);
  });
}

//////////////////////////////////////////////////////////////////////////////////////
//TODO DE CARGAR PROYECTOS

//MOSTRAR HISTORIAL DEL PROYECTO
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


//ACTUALIZA EL DROPDOWN DE CREACION DE PROYECTOS CUANDO CREAS UNA NUEVA ASISTENCIA O UNA NUEVA NECESIDAD
function actualizacionSelect(value, label, idElemento, funcion) {
  let select = document.getElementById(idElemento);
  let option = document.createElement('option');
  option.setAttribute('value', value);
  option.setAttribute('label', label);
  option.selected = true;
  select.appendChild(option);
  eval(funcion).updateSelect(value);
}



//GENERA LAS OPCIONES DEL FORMULARIO DE CREACION DE PROYECTOS
function innerHTML(json, elementDOM) {
  let select = document.getElementById(elementDOM);
  if (elementDOM == 'needs') {
    for (e of json) {
      select.innerHTML += "<option value=" + e.id_Need + ">" + e.needType + "</option>";
    }
  }
  if (elementDOM == 'assists') {
    for (e of json) {
      select.innerHTML += "<option value=" + e.id_Assistance + ">" + e.type + "</option>";
    }
  }
  if (elementDOM == 'stadiums') {
    for (e of json) {
      select.innerHTML += "<option value=" + e.id_Stage + ">" + e.stage_type + "</option>";
    }
  }
  if (elementDOM == 'estadios_checks') {
    for (e of json) {
      select.innerHTML += "<input type='checkbox' class='estadiosCheckboxes' value=" + e.id_Stage + " name='estadiosCheckboxes' />";
      select.innerHTML += "<label for=" + e.stage_type + " class='label_estadios'>" + e.stage_type + "</label>";
    }
    selecionarSoloUnEstadio();
  }
  if (elementDOM == 'assistances_created') {
    for (e of json) {
      if (e.default) {
        document.getElementById('asistencias_checks').innerHTML +=
          "<input type='checkbox' class='asistenciasCheckboxes' value=" + e.id_Assistance + " name='asistenciaCheckboxes' />"
          + "<label for=" + e.type + " class='label_estadios'>" + e.type + "</label>";
      } else {
        select.innerHTML += "<option value=" + e.id_Assistance + ">" + e.type + "</option>";
      }
    }
  }
  if (elementDOM == 'needs_created') {
    for (e of json) {
      if (e.default) {
        document.getElementById('necesidades_checks').innerHTML +=
          "<input type='checkbox' class='necesidadesCheckboxes' value=" + e.id_Need + " name='necesidadesCheckboxes' />"
          + "<label for=" + e.needType + " class='label_estadios'>" + e.needType + "</label>";
      } else {
        select.innerHTML += "<option value=" + e.id_Need + ">" + e.needType + "</option>";
      }
    }
  }
}

//COMPRUEBA LOS CAMPOS DE CARGA DE PROYECTOS
function inicializarCargaProyecto(id_ProjectManager) {
  changeCountInputFile();//comportamiento de input file, siempre activo, cuenta cuantos archivos hay seleccionados
  //validación de typo de archivos admitidos
  validFileType();
  let id = (id) => document.getElementById(id);
  let classes = (classes) => document.getElementsByClassName(classes);
  let title = id("title"),
    description = id("description"), errorMsg = document.getElementsByClassName("error"),
    successIcon = classes("success-icon"),
    failureIcon = classes("failure-icon");
  document.getElementById("save").addEventListener("click", (e) => {
    e.preventDefault();
    let necesidadesCheckboxes = document.querySelectorAll('input[name="necesidadesCheckboxes"]:checked');
    necesidadesCheckboxes.forEach((checkbox) => {
      necesidades.push(checkbox.value);
    });

    let otraNecesidad = document.querySelector("#needs_created");
    for (var option of otraNecesidad.options) {
      if (option.selected) {
        necesidades.push(option.value);
      }
    }
    let asistenciasCheckboxes = document.querySelectorAll('input[name="asistenciaCheckboxes"]:checked');
    asistenciasCheckboxes.forEach((checkbox) => {
      asistencias.push(checkbox.value);
    });
    let otraAsistencia = document.querySelector("#assistances_created");
    for (var option of otraAsistencia.options) {
      if (option.selected) {
        asistencias.push(option.value);
      }
    }
    let estadio = document.querySelector('input[name="estadiosCheckboxes"]:checked');
    if ((title.value != "" && title.value != "undefined") && (description.value != "" && description.value != "undefined") && necesidades.length > 0 &&
      asistencias.length > 0 && estadio != null && statusFile) {
      document.querySelector("#titleError").innerHTML = "";
      document.querySelector("#descriptionError").innerHTML = "";
      document.querySelector("#necesidadesError").innerHTML = "";
      document.querySelector("#asistenciasError").innerHTML = "";
      document.querySelector("#estadioError").innerHTML = "";
      let successImg = document.getElementsByClassName("success-icon");
      successImg[0].style.opacity = "1";
      successImg[1].style.opacity = "1";
      let datos = {
        "id_ProjectManager": id_ProjectManager,
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
      saveAttachments(title.value);
      saveProject(datos);
      necesidades = [];
      asistencias = [];
      attachments = [];
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



//GUARDAR NECESIDADES
function guardarNecesidades() {
  event.preventDefault();
  let json = { "needType": document.getElementById('new_need').value };
  fetch(URLNeeds, {
    method: "POST",
    mode: 'cors',
    body: JSON.stringify(json),
    headers: { "Access-Control-Allow-Origin": "*", },
    headers: { "Content-type": "application/json; charset=UTF-8", }
  })
    .then(response => response.json())
    .then(json => actualizacionSelect(json.id_Need, json.needType, "needs_created", "multiSelectsNeedsCreated"));
}

//GUARDAR ASISTENCIAS
function guardarAsistencias() {
  event.preventDefault();
  let json = { "type": document.getElementById('new_assistance').value };
  fetch(URLAssitances, {
    method: "POST",
    mode: 'cors',
    body: JSON.stringify(json),
    headers: { "Access-Control-Allow-Origin": "*", },
    headers: { "Content-type": "application/json; charset=UTF-8", }
  })
    .then(response => response.json())
    .then(json => actualizacionSelect(json.id_Assistance, json.type, "assistances_created", "multiSelectsAssistancesCreated"));
}


//MUESTRA TILDE VERDE CUANDO TODO SE CARGO BIEN
function showSucess(datos) {
  document.querySelector(".generalSave").innerHTML =
    "<p> Se han cargado los datos exitosamente</p>";
}

//SELECCIONAR SOLO UN ESTADIO
function selecionarSoloUnEstadio() {
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
}

//CONVIERTE ARRAY A LISTA PARA MOSTRARLA EN LOS DATOS DEL PROYECTO
function mostrarArray(contenedor, arreglo, dato, proyecto) {
  for (let i = 0; i < arreglo.length; i++) {
    var elemento = arreglo[i];
    if (contenedor == "#files" || contenedor == "#files_edit") {//para adjuntos
      if (elemento != null) {
        drawFileInProject(contenedor, elemento, proyecto);
      }
      //}else if(contenedor == "#files_edit"){
      //drawEditFileInProject(contenedor, arreglo[i], proyecto_title);
    } else {//para necesidades y asistencias
      document.querySelector(contenedor).innerHTML += "<p><i class='fa fa-check-circle' aria-hidden='true'></i>" + eval(dato) + "</p>";

    }
  }
}

//Generar tabla de proyectos
function generarTablaHistorial(json) {
  let array = json.content;
  let container = document.querySelector(".projectHistoryTable");
  container.innerHTML = "";
  for (let i = array.length - 1; i >= 0; i--) {
    const historial = array[i];
    var row = container.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = historial.id_admin;
    //cambiar cuando este la entidad administrador, utilizar nombre y apellido
    cell2.innerHTML = "Admin default";
    cell3.innerHTML = historial.action;
    cell4.innerHTML = historial.date;
  }
}

//TODO DE EDITAR PROYECTOS

function saveNewData(id_proyecto, proyecto) {
  let id = (id) => document.getElementById(id);
  let classes = (classes) => document.getElementsByClassName(classes);
  let title = id("title"),
    description = id("description"), errorMsg = document.getElementsByClassName("error"),
    successIcon = classes("success-icon"),
    failureIcon = classes("failure-icon");
  document.getElementById("save").addEventListener("click", (e) => {
    e.preventDefault();
    let necesidadesCheckboxes = document.querySelectorAll('input[name="necesidadesCheckboxes"]:checked');
    necesidadesCheckboxes.forEach((checkbox) => {
      necesidades.push(checkbox.value);
    });

    let otraNecesidad = document.querySelector("#needs_created");
    for (var option of otraNecesidad.options) {
      if (option.selected) {
        necesidades.push(option.value);
      }
    }
    let asistenciasCheckboxes = document.querySelectorAll('input[name="asistenciaCheckboxes"]:checked');
    asistenciasCheckboxes.forEach((checkbox) => {
      asistencias.push(checkbox.value);
    });
    let otraAsistencia = document.querySelector("#assistances_created");
    for (var option of otraAsistencia.options) {
      if (option.selected) {
        asistencias.push(option.value);
      }
    }
    let estadio = document.querySelector('input[name="estadiosCheckboxes"]:checked');
    let files = [];
    proyecto.files.forEach(element => {
      if (element != null) {
        files.push(element.id_File);
      }
    });
    if ((title.value != "" && title.value != "undefined") && (description.value != "" && description.value != "undefined") && necesidades.length > 0 &&
      asistencias.length > 0 && estadio != null && statusFile) {
      document.querySelector("#titleError").innerHTML = "";
      document.querySelector("#descriptionError").innerHTML = "";
      document.querySelector("#necesidadesError").innerHTML = "";
      document.querySelector("#asistenciasError").innerHTML = "";
      document.querySelector("#estadioError").innerHTML = "";
      let successImg = document.getElementsByClassName("success-icon");
      successImg[0].style.opacity = "1";
      successImg[1].style.opacity = "1";
      let datos = {
        "title": title.value,
        "description": description.value,
        "files":
          files
        ,
        "assistances":
          asistencias
        ,
        "needs":
          necesidades
        ,
        "stage": estadio.value,
        "newFiles":
          attachments
      }
      saveAttachments(title.value);
      modificarProyecto(id_proyecto, datos);
      necesidades = [];
      asistencias = [];
      attachments = [];
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
      necesidades = [];
      asistencias = [];
      attachments = [];
    }
  });
}

function cargarCheckboxes(URL, proyecto, dato) {
  getAllBaseURL(URL, dato).then(() => {
    let checkboxes = [];
    if (dato == "needs_created") {
      checkboxes = document.querySelector('#necesidades_checks').querySelectorAll('.necesidadesCheckboxes, input[type=checkbox]');
    } else if (dato == "assistances_created") {
      checkboxes = document.querySelector('#asistencias_checks').querySelectorAll('.asistenciasCheckboxes, input[type=checkbox]');
    } else {
      checkboxes = document.querySelector('#estadios_checks').querySelectorAll('.estadiosCheckboxes, input[type=checkbox]');
    }
    checkboxes.forEach(checkbox => {
      if (dato == "needs_created") {
        for (let i = 0; i < proyecto.needs.length; i++) {
          if (proyecto.needs[i].id_Need == checkbox.value) {
            checkbox.innerHTML += proyecto.needs[i].type;
            checkbox.checked = true;
          }
        }
        selectedOptions("needs_created", "multiSelectsNeedsCreated");
      } else if (dato == "assistances_created") {
        for (let i = 0; i < proyecto.assistances.length; i++) {
          if (proyecto.assistances[i].id_Assistance == checkbox.value) {
            checkbox.checked = true;
          }
        }
        selectedOptions("assistances_created", "multiSelectsAssistancesCreated");
      } else {
        if (proyecto.stage.id_Stage == checkbox.value) {
          checkbox.click();
        }
      }
    });

  });
}

function selectedOptions(idSelect, multiSelect) {
  let selectedOption = document.getElementById(idSelect);
  selectedOption.options[0].selected = true;
  eval(multiSelect).updateSelect();
}

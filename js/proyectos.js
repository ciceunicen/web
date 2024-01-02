let page = 1;
const URLProject = "http://localhost:8080/projects";
const URLEntrepreneurProjects = "http://localhost:8080/emprendedores";
const URLFiles = "http://localhost:8080/files";
let statusFile = true;//guarda si los archivos cargados tienen una estención válida.

//METODOS DE ABM
//POST
async function saveProject(data) {
  let token = localStorage.getItem("token");
  try{
      let res = await fetch(URLProject,{
          method : "POST",
          mode : 'cors',
          body : JSON.stringify(data),
          headers : {"Content-type": "application/json",
                      "Authorization": "Bearer " + token,
                      "Access-Control-Allow-Origin": "*"},                     
      });
      if(res.ok) {
          showSucess(".project-save", "Se han cargado los datos exitosamente!");
          setTimeout(() => {
            window.location.href = "dashboard.html";
          } , 1500)
      }
  }catch(error){
      console.log(error);
  }
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

//GET DE LOS PROYECTOS FILTRADOS DE EMPRENDEDOR - SÓLO FILTRA POR ESTADO
// Si no se pasan datos por parámetro = []
function getEntrepreneurFilterProjects(datos, pagina, radioButtonEstado) {
  let url = new URL(URLProject + "/entrepreneur/filters/page/" + pagina);
  let params = new URLSearchParams(datos);
  
  let estadoParam = "";
  if (radioButtonEstado != "") {
    estadoParam = `&active=${radioButtonEstado}`;
  }

  return fetch(url + `?${params}${estadoParam}`,{
    mode: 'cors',
    "headers": {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
    }
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
  console.log("Campos", proyecto);
  let response = await fetch(URLProject + "/" + id_proyecto, {
    method: "PUT",
    mode: 'cors',
    body: JSON.stringify(proyecto),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Access-Control-Allow-Origin": "*",
    }
  });
  if (response.ok) {
    let json = await response.json();
    showSucess(".project-save", "Se han editado los datos exitosamente!");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    } , 1500)
  } else {
    console.error("No se pudo editar el proyecto");
  }
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
    url = URLFiles + "/idFile/" + idFile;
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
function comportamientoPaginado(pages, datosFiltro, estadoFiltro, tablaUtilizada) {
  comportamientoBotonesPaginado(pages);
  document.querySelector("#nextPage").addEventListener("click", () => {
    if (page <= pages) {
      page++;
      cambiarNumeroPaginado(datosFiltro, estadoFiltro, tablaUtilizada, pages);
    }
  });
  document.querySelector("#previousPage").addEventListener("click", () => {
    if (page > 1) {
      page--;
      cambiarNumeroPaginado(datosFiltro, estadoFiltro, tablaUtilizada, pages);
    }
  });
}

//Cambia el numero que se muestra en la seccion de paginado
function cambiarNumeroPaginado(datosFiltro, estadoFiltro, tablaUtilizada, pages) {
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
      mostrarTabla(json, false, "dashboard");
      comportamientoBotonesPaginado(pages);
    });
    }else if (tablaUtilizada == "proyectos") {
      getAllProjectsByEntrepreneur(page).then(json => {
        mostrarTablaProyectosEmprendedor(json);
        comportamientoBotonesPaginado(pages);
      });
  } else if (tablaUtilizada == "proyectosEmprendedorFiltrados") {
    getEntrepreneurFilterProjects(datosFiltro, page, estadoFiltro).then(json => {
      mostrarTablaProyectosEmprendedor(json.content);
      comportamientoBotonesPaginado(pages);
    });
  } else if (tablaUtilizada == "proyectos") {
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
//function mostrarTabla(json, borrados, projectManager = false, pagAnterior) {
function mostrarTabla(json, borrados, pagAnterior, projectManager = false) {
  console.log("mostrarTabla: " + pagAnterior)
  let user = JSON.parse(localStorage.getItem('usuario'));
  if (user.rolType.toLowerCase() == 'personal del cice') {
    listadoHTML = "listProjectsPersonalCICE.html";
  }

  let cellsCount = 0;
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
    console.log(proyecto);
    var row = container.insertRow(0);
    var cell1 = row.insertCell(cellsCount++);
    var cell2 = row.insertCell(cellsCount++);
    var cell3 = row.insertCell(cellsCount++);
    if (user.rolType.toLowerCase() == 'personal del cice') {
      const isActive = proyecto.is_active;
      let cellState = row.insertCell(cellsCount++)
      if (isActive) {
        cellState.innerHTML = "Activo";
        cellState.classList.add("activo");
      } else {
        cellState.innerHTML = "No activo";
        cellState.classList.add("noActivo");
      }
    }
    var cell4 = row.insertCell(cellsCount++);
    if (borrados) {
      pagAnterior = "proyectos";
      removerEventoClic(pagAnterior);
      agregarEventoClic(pagAnterior);
      var cell5 = row.insertCell(cellsCount++);
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
      //let pagAnterior = "proyectos";
      document.querySelector(".verMas").addEventListener("click", () => { getProyecto(proyecto.id_Project).then(json => mostrarProyecto(json, pagAnterior));
        window.location.hash = `detallesProyecto`;
      });
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
    cellsCount = 0;
  }
}

//muestra los proyectos de un emprendedor
function mostrarTablaProyectosEmprendedor(json) {
  let array = json;

  removerEventoClic("dashboard");
  agregarEventoClic("dashboard");

  if (Array.isArray(array)) {
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

      document.querySelector(".verMas").addEventListener("click", () => { getProyecto(proyecto.id_Project).then(json => mostrarProyecto(json, "proyectosEmprendedor")) });
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
    document.querySelector(".slideDownHistory").innerHTML = "<img src='../img/icons8-flecha-contraer-50.png' class='slideDown'/>";
  } else {
    document.querySelector(".slideDownHistory").innerHTML = "<img src='../img/expandir.png' class='slideDown'/>";
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

function updateCheckbox(checkboxValue, checkboxLabel, containerType, checkboxName) {
  let container = document.querySelector(containerType);
  let article = document.createElement('article');
  let input = document.createElement('input');
  input.classList.add('checkbox-input');
  input.type = 'checkbox';
  input.name = checkboxName
  input.value = checkboxValue
  let label = document.createElement('label');
  label.classList.add("checkbox-label");
  label.textContent = checkboxLabel;        
  article.appendChild(input);
  article.appendChild(label);
  input.checked = true;

  container.appendChild(article);
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

//Metodos para cargar checkboxs disponibles en cargar proyecto
function saveNewProject() {
  let form = document.querySelector("#projectForm");
  let referentForm = document.querySelector("#referentForm");
  let formData = new FormData();
  new FormData(form).forEach((value, key) => formData.append(key, value));
  new FormData(referentForm).forEach((value, key) => formData.append(key, value));

  //datos del referente
  let referent = formData.get('referent-select');
  let referent_telefono = formData.get('referent-telefono');
  let referent_localidad = formData.get('referent-localidad');
  let referent_mail = formData.get('referent-mail');
  let referent_ocupacion = formData.get('referent-ocupacion');
  let referent_vinculacion = formData.get('referent-vinculacion');
  let referent_facultad = formData.get('referent-facultad');
  let referent_conocimiento = formData.get('referent-conocimiento');
  let referent_organizacion = formData.get('referent-organizacion');

  //datos del proyecto
  let user = JSON.parse(localStorage.getItem('usuario'));
  let needs = [];
  let assistances = [];
  let title = formData.get('title');
  let description = formData.get('description');
  let needsCheckboxes = document.querySelectorAll('input[name="need-checkbox"]:checked');
  needsCheckboxes.forEach((checkbox) => {
    needs.push(checkbox.value);
  });
  let assistancesCheckboxes = document.querySelectorAll('input[name="assistance-checkbox"]:checked');
  assistancesCheckboxes.forEach((checkbox) => {
    assistances.push(checkbox.value);
  });
  let stage = formData.get('stage-select');
  let admin = formData.get('admin-select');
  //fin de datos del proyecto

  if ((title != "" && title != "undefined") && (description != "" && description != "undefined") && needs.length > 0 &&
    assistances.length > 0 && (stage != "no-select" && stage != "undefined") && (admin != "no-select" && admin != "undefined")
    && (referent != "" && referent != "undefined") && (referent_telefono != "" && referent_telefono != "undefined") && (referent_localidad != "" && referent_localidad != "undefined")
    && (referent_mail != "" && referent_mail != "undefined") && (referent_vinculacion != "" && referent_vinculacion != "undefined") && (referent_facultad != "" && referent_facultad != "undefined")
    && (referent_organizacion != "" && referent_organizacion != "undefined")) {
    document.querySelector("#titleError").innerHTML = "";
    document.querySelector("#descriptionError").innerHTML = "";
    document.querySelector("#needError").innerHTML = "";
    document.querySelector("#assistanceError").innerHTML = "";
    document.querySelector("#stageError").innerHTML = "";
    document.querySelector("#adminError").innerHTML = "";

    let data = {
      "id_ProjectManager": user.id,
      "title": title,
      "description": description,
      "stage": stage,
      "assistances": assistances,
      "files": null,
      "needs": needs,
      "id_Admin": admin,
      "referent_userId": referent,
      "referent_telefono": referent_telefono,
      "referent_localidad": referent_localidad,
      "referent_mail": referent_mail,
      "referent_ocupacion": referent_ocupacion,
      "referent_vinculacion": referent_vinculacion,
      "referent_facultad": referent_facultad,
      "referent_conocimiento": referent_conocimiento,
      "referent_organizacion": referent_organizacion
    }

    console.log(data)
    saveProject(data);
    needs = [];
    assistances = [];

    }else {
      if (title == "" || title == "undefined") {
        document.querySelector("#titleError").innerHTML = "Ingrese un título al proyecto";
      } else {
        document.querySelector("#titleError").innerHTML = "";
      }
      if (description == "" || description == "undefined") {
        document.querySelector("#descriptionError").innerHTML = "Ingrese una descripción al proyecto";
      } else {
        document.querySelector("#descriptionError").innerHTML = "";
      }
      if (needs.length == 0) {
        document.querySelector("#needError").innerHTML = "Seleccione al menos una necesidad";
      } else {
        document.querySelector("#needError").innerHTML = "";
      }
      if (assistances.length == 0) {
        document.querySelector("#assistanceError").innerHTML = "Seleccione al menos un tipo de asistencia";
      } else {
        document.querySelector("#assistanceError").innerHTML = "";
      }
      if (stage == "no-select" || stage == "undefined") {
        document.querySelector("#stageError").innerHTML = "Seleccione un estadio";
      } else {
        document.querySelector("#stageError").innerHTML = "";
      }
      if (admin == "no-select" || admin == "undefined") {
        document.querySelector("#adminError").innerHTML = "Seleccione un administrador";
      } else {
        document.querySelector("#adminError").innerHTML = "";
      }
    }
  }  

//GUARDAR NECESIDADES EN EDITAR PROYECTO
function guardarNecesidades() {
  event.preventDefault();
  let json = { "needType": document.getElementById('new_need').value };
  fetch(URLNeeds, {
    method: "POST",
    mode: 'cors',
    body: JSON.stringify(json),
    headers : {"Content-Type" : "application/json; charset=utf-8",
                "Authorization" : "Bearer " + token,
                "Access-Control-Allow-Origin": "*"},
  })
    .then(response => response.json())
    .then(json => actualizacionSelect(json.id_Need, json.needType, "needs_created", "multiSelectsNeedsCreated"));
}

//GUARDAR ASISTENCIAS EN EDITAR PROYECTO
function guardarAsistencias() {
  event.preventDefault();
  let json = { "type": document.getElementById('new_assistance').value };
  fetch(URLAssistances, {
    method: "POST",
    mode: 'cors',
    body: JSON.stringify(json),
    headers : {"Content-Type" : "application/json; charset=utf-8",
                "Authorization" : "Bearer " + token,
                "Access-Control-Allow-Origin": "*"},
  })
    .then(response => response.json())
    .then(json => actualizacionSelect(json.id_Assistance, json.type, "assistances_created", "multiSelectsAssistancesCreated"));
}

//GUARDAR NECESIDADES
async function saveNewNeed() {
  event.preventDefault();
  document.querySelector("#needError").innerHTML = "";
  let token = localStorage.getItem("token");
  let input = document.getElementById("save-need");
  if (input.value != "" && input.value != "undefined") {
    let data = {
      "needType": input.value
    };
    try {
      await fetch(URLNeeds, {
        method: "POST",
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + token,
          "Access-Control-Allow-Origin": "*"
        },
      })
        .then(response => response.json())
        .then(json => updateCheckbox(json.id_Need, json.needType, "#needsData", "need-checkbox"));
    } catch (error) {
      console.log(error)
    }
    input.value = "";
  } else {
    if (input.value == "" || input.value == "undefined") {
      document.querySelector("#needError").innerHTML = "Escriba su necesidad antes de guardar";
    } else {
      document.querySelector("#needError").innerHTML = "";
    }
  }
}

//GUARDAR ASISTENCIAS
async function saveNewAssistance() {
  event.preventDefault();
  document.querySelector("#assistanceError").innerHTML = "";
  let token = localStorage.getItem("token");
  let input = document.getElementById("save-assistance");
  if (input.value != "" && input.value != "undefined") {
    let data = {
      "type": input.value
    };
    try{
      await fetch(URLAssistances, {
        method: "POST",
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {"Content-type" : "application/json",
                  "Authorization": "Bearer " + token,
                  "Access-Control-Allow-Origin": "*"},
      })
        .then(response => response.json())
        .then(json => updateCheckbox(json.id_Assistance, json.type, "#assistancesData", "assistance-checkbox"));
    }catch(error) {
      console.log(error)
    }
    input.value = "";  
  }else{
    if(input.value == "" || input.value == "undefined") {
      document.querySelector("#assistanceError").innerHTML = "Escriba su asistencia antes de guardar";
    } else {
      document.querySelector("#assistanceError").innerHTML = "";
    }
  }
}


//MUESTRA MENSAJE VERDE CUANDO TODO SE CARGO BIEN
function showSucess(container ,string) {
   document.querySelector(container).innerHTML =
    `<p>${string}</p>`; 
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

function selectOnlyOneStage() {
  let checkedStage = null;
  for (let CheckBox of document.getElementsByClassName('stageCheckbox')) {
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
    if(historial.action == "Diagnostico"){
      let link = document.createElement("a");
      link.setAttribute("href", "#")
      link.setAttribute("data-id", historial.id_record);
      let linkText = document.createTextNode("Ver mas");
      link.appendChild(linkText);
      link.classList.add("diagnostic-button");
      cell3.appendChild(link);
      link.addEventListener("click", function() {showDiagnostic(link.dataset.id)});
    }
    cell4.innerHTML = historial.date;
  }
}

//TODO DE EDITAR PROYECTOS
function updateProject(id_project) {
  let form = document.querySelector("#projectForm");
  let formData = new FormData(form);
  let needs = [];
  let assistances = [];
  let title = formData.get('title');
  let description = formData.get('description');
  let needsCheckboxes = document.querySelectorAll('input[name="need-checkbox"]:checked');
  needsCheckboxes.forEach((checkbox) => {
      needs.push(checkbox.value);
  });
  let assistancesCheckboxes = document.querySelectorAll('input[name="assistance-checkbox"]:checked');
  assistancesCheckboxes.forEach((checkbox) => {
      assistances.push(checkbox.value);
  });
  let stage = formData.get('stage-select');   
  let admin = formData.get('admin-select');
  let isActive = document.querySelector('input[name="estado"]:checked').value;
  if (isActive === "true") {
    isActive = true;
  } else {
    isActive = false;
  }
  if ((title != "" && title != "undefined") && (description != "" && description != "undefined") && needs.length > 0 &&
    assistances.length > 0 && (stage != "no-select" && stage != "undefined") && (admin != "no-select" && admin != "undefined")) {
    document.querySelector("#titleError").innerHTML = "";
    document.querySelector("#descriptionError").innerHTML = "";
    document.querySelector("#needError").innerHTML = "";
    document.querySelector("#assistanceError").innerHTML = "";
    document.querySelector("#stageError").innerHTML = "";
    document.querySelector("#adminError").innerHTML = "";

    let data = {
      "title" : title,
      "description" : description,
      "stage" : stage,
      "is_active": isActive,
      "assistances" : assistances,
      "files" : null,       
      "needs" : needs,       
      "newFiles" : null
    }
    modificarProyecto(id_project, data);
    needs = [];
    assistances = [];
  }else {
    if (title == "" || title == "undefined") {
      document.querySelector("#titleError").innerHTML = "Ingrese un título al proyecto";
    } else {
      document.querySelector("#titleError").innerHTML = "";
    }
    if (description == "" || description == "undefined") {
      document.querySelector("#descriptionError").innerHTML = "Ingrese una descripción al proyecto";
    } else {
      document.querySelector("#descriptionError").innerHTML = "";
    }
    if (needs.length == 0) {
      document.querySelector("#needError").innerHTML = "Seleccione al menos una necesidad";
    } else {
      document.querySelector("#needError").innerHTML = "";
    }
    if (assistances.length == 0) {
      document.querySelector("#assistanceError").innerHTML = "Seleccione al menos un tipo de asistencia";
    } else {
      document.querySelector("#assistanceError").innerHTML = "";
    }
    if (stage == "no-select" || stage == "undefined") {
      document.querySelector("#stageError").innerHTML = "Seleccione un estadio";
    } else {
      document.querySelector("#stageError").innerHTML = "";
    }
    if (admin == "no-select" || admin == "undefined") {
      document.querySelector("#adminError").innerHTML = "Seleccione un administrador";
    } else {
      document.querySelector("#adminError").innerHTML = "";
    }
    needs = [];
    assistances = [];
  }
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

//OBTIENE DATOS PARA CARGAR CHECKBOXS Y SELECTS
async function getNeeds(url, project) {
  let token = localStorage.getItem("token");
  try {
      let res = await fetch(url, {
          "method": "GET",
          "headers": {"Authorization": "Bearer " + token}
      })
      if (res.ok) {
          let array = await res.json();
          if (array) {
              showNeeds(array, project);
          }
      }
  } catch (error) {
      console.log("Fallo al obtener el JSON de la API.");
      console.log(error);
  }
}

async function getAssistances(url, project) {
  let token = localStorage.getItem("token");
  try {
      let res = await fetch(url, {
          "method": "GET",
          "headers" : {"Authorization": "Bearer " + token}
      })
      if (res.ok) {
          let array = await res.json();
          if (array) {
              showAssistances(array, project);
          }
      }
  } catch (error) {
      console.log("Fallo al obtener el JSON de la API.");
      console.log(error);
  }
}

async function getStages(url, project) {
  let token = localStorage.getItem("token");
  try {
      let res = await fetch(url, {
          "method": "GET",
          "headers" : {"Authorization": "Bearer " + token}
      })
      if (res.ok) {
          let array = await res.json();
          if (array) {
              showStages(array, project);
          }
      }
  } catch (error) {
      console.log("Fallo al obtener el JSON de la API.");
      console.log(error);
  }
}

async function getAdmins(url, project) {
  let token = localStorage.getItem("token");
  try {
      let res = await fetch(url, {
          "method": "GET",
          "headers" : {"Authorization": "Bearer " + token}
      })
      
      if (res.ok) {
          let array = await res.json();
          if (array) {
              showAdmins(array, project);
          }
      }
  } catch (error) {
      console.log("Fallo al obtener el JSON de la API.");
      console.log(error);
  }
}

async function getUsers(url, project = null) {
  let token = localStorage.getItem("token");
  try {
    let res = await fetch(url, {
      "method": "GET",
      "headers": { "Authorization": "Bearer " + token }
    })

    if (res.ok) {
      let array = await res.json();
      if (array) {
        showUsers(array, project);
      }
    }
  } catch (error) {
    console.log("Fallo al obtener el JSON de la API.");
    console.log(error);
  }
}

function showNeeds(array, project) {
  let needContainer = document.querySelector("#needsData");
  array.forEach(need => {
      let article = document.createElement('article');
      let input = document.createElement('input');
      input.classList.add('checkbox-input');
      input.type = 'checkbox';
      input.name = "need-checkbox"
      input.value = need.id_Need;
      let label = document.createElement('label');
      label.classList.add("checkbox-label");
      label.textContent = need.needType;        
      article.appendChild(input);
      article.appendChild(label);

      if(project != null) {
        for (let i = 0; i < project.needs.length; i++) {
          if (project.needs[i].id_Need == input.value) {
            input.checked = true;
          }
        }
      }
      needContainer.appendChild(article);  
  });
}

function showAssistances(array, project) {
  console.log("ASSISTANCES", array);
  let assistanceContainer = document.querySelector("#assistancesData");
  array.forEach(assistance => {
    let article = document.createElement('article');
    let input = document.createElement('input');
    input.classList.add('checkbox-input');
    input.type = 'checkbox';
    input.name = "assistance-checkbox"
    input.value = assistance.id_Assistance;
    let label = document.createElement('label');
    label.classList.add("checkbox-label");
    label.textContent = assistance.type;
    article.appendChild(input);
    article.appendChild(label);
    
    if (project != null) {
      for (let i = 0; i < project.assistances.length; i++) {
        if (project.assistances[i].id_Assistance == input.value) {
          input.checked = true;
        }
      }
    
      assistanceContainer.appendChild(article);
    }
  });
}

function showStages(array, project) {
  let stagesContainer = document.querySelector("#stageSelect");
  array.forEach(stage => {
    let option = document.createElement('option');
    option.value = stage.id_Stage;
    option.label = stage.stage_type;
    stagesContainer.appendChild(option);   
  });

  if(project != null) {
    stagesContainer.value = project.stage.id_Stage;
  }
}

function showAdmins(array, project) {
  let adminSelect = document.querySelector("#adminSelect");
  array.forEach(admin => {
    let option = document.createElement('option');
    option.value = admin.id;
    option.label = admin.email;
    adminSelect.appendChild(option);
  })

  if(project != null) {
    adminSelect.value = project.administrador;
  }
}

async function addProjectsToSelectInput() {
  let token = localStorage.getItem("token");
  try {
      let res = await fetch(URLProject, {
          "method": "GET",
          "headers" : {"Authorization": "Bearer " + token}
      })
      if (res.ok) {
          let array = await res.json();
          if (array) {
              showProjects(array);
          }
      }
  } catch (error) {
      console.log("Fallo al obtener el JSON de la API.");
      console.log(error);
  }
}

function showProjects(array) {
  let select = document.querySelector('#projectSelect');
  array.forEach(project => {
    let option = document.createElement('option');
    option.value = project.id_Project;
    option.label = project.title;
    select.appendChild(option);
  })
}

function saveNewDiagnostic(idAdmin) {
  let form = document.querySelector("#diagnosticForm");
  let formData = new FormData(form);
  let project = formData.get('project-select');
  let diagnostic = formData.get('diagnostic');

  if ((project != "no-select" && project != "undefined") && (diagnostic != "" && diagnostic.length < 255)) {
    document.querySelector("#projectError").innerHTML = "";
    document.querySelector("#diagnosticError").innerHTML = "";

    let data = {
      "idProject" : project,
      "idAdmin" : idAdmin,
      "diagnostic" : diagnostic 
    }
    
    addDiagnosticToProject(data)
    
  }else{
    if(project == "no-select" || project == "undefined") {
      document.querySelector("#projectError").innerHTML = "Elija un proyecto";
    }else {
      document.querySelector("#projectError").innerHTML = "";
    }
    if(diagnostic == "") {
      document.querySelector("#diagnosticError").innerHTML = "Ingrese un diagnostico al proyecto";
    } else if(diagnostic.length > 255) {
      document.querySelector("#diagnosticError").innerHTML = "Texto muy largo, ingrese menos caracteres";
    }else {
      document.querySelector("#diagnosticError").innerHTML = "";
    }
  }
}

async function addDiagnosticToProject(data) {
  let token = localStorage.getItem("token");
  try{
    let res = await fetch(URLProject+"/diagnostic",{
      method : "POST",
      mode : 'cors',
      body : JSON.stringify(data),
      headers : {"Content-type": "application/json",
                  "Authorization": "Bearer " + token,
                  "Access-Control-Allow-Origin": "*"},                     
    });
    if(res.ok) {
        showSucess(".diagnostic-save", "Diagnostico cargado con exito!");
        setTimeout(() => {
          window.location.href = "dashboard.html";
        } , 1500)
    }
  }catch(error){
    console.log(error);
  }
}

async function getDiagnosticById(idRecord) {
  let token = localStorage.getItem("token");
  try {
      let res = await fetch(URLProject+"/diagnostic/"+idRecord, {
          "method": "GET",
          "headers" : {"Authorization": "Bearer " + token}
      })
      if (res.ok) {
          let array = await res.json();
          if (array) {
            showDiagnosticInModal(array);
          }
      }
  } catch (error) {
      console.log("Fallo al obtener el JSON de la API.");
      console.log(error);
  }
}

function showDiagnostic(id) {
  let modal = document.querySelector('#modal');
  modal.classList.add('modal-flex');
  document.querySelector("body").style.overflow = "hidden";
  if(modal.classList.contains('modal-flex')) {
    getDiagnosticById(id);
  }
  document.querySelector('#closeModal').addEventListener('click', ()=>{
    document.querySelector("body").style.overflow = "";
    modal.classList.remove('modal-flex');
  });
}

function showDiagnosticInModal(array) {
  let diagnosticText = document.querySelector("#diagnosticText");
  diagnosticText.innerHTML = array.diagnostic;
}

function showUsers(array, project) {
  console.log(array, project)
  let referentSelect = document.querySelector("#referentSelect");
  array.forEach(referent => {
    let option = document.createElement('option');
    option.value = referent.id;
    option.label = referent.username;
    referentSelect.appendChild(option);
  })

  if (project != null) {
    referentSelect.value = null;
  }
}

//Toggle Acoordion en Cargar Proyecto
function toggleAccordion(button) {
  const accordionContent = button.nextElementSibling;

  button.classList.toggle('accordion--expanded');
  accordionContent.style.maxHeight =
    accordionContent.style.maxHeight ? null : `${accordionContent.scrollHeight}px`;
}

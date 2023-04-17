//GET
function getProjectManager(id) {
  let token = localStorage.getItem("token");
  return fetch(URLProjectManager + "/" + id, {
    mode: 'cors',

    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then((response) => response.json())
    .then(json => { return json });
}

function getAllProjectManagers() {
  let token = localStorage.getItem("token");

  return fetch(URLProjectManager + "/page/" + page, {
    mode: 'cors',

    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then((response) => response.json())
    .then(json => { return json })
}

function getAllProjectsByProjectManager(idProjectManager) {
  let token = localStorage.getItem("token");

  return fetch(URLProjectManager + "/" + idProjectManager + "/projects/page/" + page, {
    mode: 'cors',

    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then((response) => response.json())
    .then(json => { return json })
}

//MOSTRAR RESPONSABLE DEL PROYECTO
function mostrarResponsableProyecto(id) {
  let btn = document.getElementById('projectManagerData')
  if (btn.className === 'hiddenData') {
    getProjectManager(id).then(json => showDataProjectManager(json));
    btn.className = 'showProjectManagerData';
    document.querySelector(".slideDownResponsible").innerHTML = "<img src='img/icons8-flecha-contraer-50.png' class='slideDown'/>";
  } else {
    document.querySelector(".slideDownResponsible").innerHTML = "<img src='img/expandir.png' class='slideDown'/>";
    btn.className = 'hiddenData';
  }
}

//carga datos en la tabla de datos de un emprendedor
function showDataProjectManager(projectManager) {
  //llamo a contenido donde se muestran los datos del emprendedor.
  mostrarArchivoHTML("html/dataProjectManager.html").then(text_pm => {
    document.getElementById("projectManagerData").innerHTML = text_pm;
    //Completo datos del emprendedor
    document.querySelector("#fullName").innerHTML = projectManager.name + " " + projectManager.surname;
    document.querySelector("#email").innerHTML = projectManager.email;
    document.querySelector("#linkUnicen").innerHTML = projectManager.linkUnicen;
    document.querySelector("#phone").innerHTML = projectManager.phone;
    document.querySelector("#medioConocimientoCice").innerHTML = projectManager.medioConocimientoCice;
  });
}

//TODO LISTA EMPRENDEDORES
function generarTablaEmprendedores(json) {
  let array = json.content;
  let container = document.querySelector(".projectManagersTable");
  container.innerHTML = "";
  for (let i = array.length - 1; i >= 0; i--) {
    const projectManager = array[i];
    var row = container.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var input = document.createElement("input");
    input.setAttribute("type", "button");
    input.setAttribute("value", "Ver más");
    input.setAttribute("id", projectManager.id_ProjectManager);
    input.setAttribute("class", "btn_save_green verMas");
    cell5.appendChild(input);
    document.querySelector(".verMas").addEventListener("click", () => { getProjectManager(projectManager.id_ProjectManager).then(json => mostrarEmprendedor(json)) });
    cell1.innerHTML = projectManager.name;
    //cambiar cuando este la entidad administrador, utilizar nombre y apellido
    cell2.innerHTML = projectManager.surname;
    cell3.innerHTML = projectManager.email;
    cell4.innerHTML = projectManager.phone;
  }
}
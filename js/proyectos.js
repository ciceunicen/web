let page=1;
const URLProject="http://localhost:8080/projects";
//METODOS DE ABM

//POST
async function saveProject(datos){
  await fetch(URLProject,{
    method: "POST",
    mode: 'cors',
    body: JSON.stringify(datos),
    headers: {"Access-Control-Allow-Origin":"*" ,},
    headers: {"Content-type": "application/json; charset=UTF-8",}
  })
  .then(response => response.json())
  .then(json => showSucess());
  setTimeout(mostrarCargaProyecto,8000);
}

//BORRAR UN PROYECTO EN PARTICULAR
function borrarProyecto(id_Project,id_Admin){
  page=1;
  fetch(URLProject + "/idProject/" + id_Project + "/idAdmin/" + id_Admin,{
    method: 'DELETE',
    headers: {"Access-Control-Allow-Origin":"*" ,},
    headers: {"Content-type": "application/json; charset=UTF-8",}
  })
  .then(response=>getAllProjects().then(lista=>{
    mostrarPaginado(lista.totalPages);
    mostrarTabla(lista,false);
  }));
}

//GET PROYECTO
function getProyecto(id){
  return fetch(URLProject+"/"+id)
  .then(response => response.json())
  .then(json => {return json});
}

//GET DE TODOS LOS PROYECTOS
function getAllProjects(){
  return fetch(URLProject + "/page/" + page)
 .then(response => response.json())
 .then(json => {return json});
}

//GET DE TODOS LOS PROYECTOS BORRADOS
function getAllDeleteProjects(){
  return fetch(URLProject+"/removed/page/1")
    .then((response) => response.json())
    .then(json => {return json});
}

//GET DE LOS PROYECTOS FILTRADOS
function getFilterProjects(datos) {
  let url = new URL(URLProject + "/filters/page/" + page);
  let params = new URLSearchParams(datos);
  fetch(url + "?" + params)
    .then(response => response.json())
    .then(json => mostrarTabla(json));
}

//maneja el funcionamiento del paginado de la tabla de proyectos
function comportamientoPaginado(pages){
  comportamientoBotonesPaginado();
  document.querySelector("#nextPage").addEventListener("click", ()=>{
    if(page<=pages-1){
        page++;
        cambiarNumeroPaginado(pages);
    }
  });
  document.querySelector("#previousPage").addEventListener("click",()=>{
    if(page>1){
      page--;
      cambiarNumeroPaginado(pages);
    }
  });
}

//Cambia el numero que se muestra en la seccion de paginado
function cambiarNumeroPaginado(pages){
  document.querySelector("#pageNumber").innerHTML=page;
  getAllProjects(page).then(json => {
    mostrarTabla(json,false);
    comportamientoBotonesPaginado(pages);
  });
}

//Activa o desactiva los botones de paginado
function comportamientoBotonesPaginado(pages){
  if(page==1){
    document.querySelector("#previousPage").ariaDisabled;
    document.querySelector("#previousPage").style.color="grey"; 
    document.querySelector("#previousPage").setAttribute("disabled", "true");
  }else if(page==pages){
      document.querySelector("#nextPage").style.color="grey";
      document.querySelector("#nextPage").setAttribute("disabled", "true");
      document.querySelector("#nextPage").ariaDisabled;
  }else{
    if(document.querySelector("#previousPage").hasAttribute("disabled")){
      document.querySelector("#previousPage").ariaHidden;
      document.querySelector("#previousPage").style.color= "#0d6efd"; 
      document.querySelector("#previousPage").removeAttribute("disabled");
    }else if(document.querySelector("#nextPage").hasAttribute("disabled")){
      document.querySelector("#nextPage").ariaHidden;
      document.querySelector("#nextPage").style.color= "#0d6efd";
      document.querySelector("#nextPage").removeAttribute("disabled");
    }
  }
}

//PASAR ARRAY A LISTA()
function mostrarArray(contenedor,arreglo,dato){
  for (let i = 0; i < arreglo.length; i++) {
    var elemento=arreglo[i];
    if(contenedor == "#files"){//para adjuntos
      document.querySelector(contenedor).innerHTML+="<p class='p_file'>"+eval(dato)+"</p>";
    }else{//para necesidades y asistencias
      document.querySelector(contenedor).innerHTML+="<p><i class='fa fa-check-circle' aria-hidden='true'></i>"+eval(dato)+"</p>";

    }
  }
}

//Generar tabla de proyectos
function mostrarTabla(json,borrados){
  let array=json.content;
  let container;
  if(borrados){
    container= document.querySelector("#tbody_projects_removed");
  }else{
    container= document.querySelector(".list");
  }
  container.innerHTML="";
  for (let i = array.length-1; i >=0 ; i--) {
            const proyecto = array[i];          
            var row = container.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            if(borrados){
              var cell5 = row.insertCell(4);
              cell1.innerHTML = proyecto.project.title;
              cell2.innerHTML = proyecto.project.projectManager.name + " " + proyecto.project.projectManager.surname;
              cell3.innerHTML = proyecto.project.stage.stage_type;
              cell4.innerHTML = proyecto.id_admin;
              cell5.innerHTML = proyecto.date_delete;
            }else{
              cell1.innerHTML = proyecto.title;
              cell2.innerHTML = proyecto.projectManager.name + " " + proyecto.projectManager.surname;
              cell3.innerHTML = proyecto.stage.stage_type;
              var input = document.createElement("input");
              input.setAttribute("type", "button");
              input.setAttribute("value", "Ver más");
              input.setAttribute("id", proyecto.id_Project);
              input.setAttribute("class", "btn_save_green verMas");
              cell4.appendChild(input);
              document.querySelector(".verMas").addEventListener("click", ()=>{getProyecto(proyecto.id_Project).then(json=>mostrarProyecto(json))});
              //creo botón de borrar para cada proyecto
              var btn_delete = document.createElement("input");
              btn_delete.setAttribute("type", "button");
              btn_delete.setAttribute("value", "Borrar");
              btn_delete.setAttribute("id", proyecto.id_Project);
              btn_delete.setAttribute("class", "btn_save_green btn_borrar");
              //le agrego el evento al botón de eliminar
              let id_Admin=proyecto.administrador;
              btn_delete.addEventListener("click", ()=>{borrarProyecto(proyecto.id_Project, id_Admin)});
              cell4.appendChild(btn_delete);
            }
  }
}

//FUNCION PARA GENERAR LOS DATOS DEL PROJECT MANAGER EN HTML
function readDomProductManager(json){
  let divProductManager = document.querySelector("#projectManagerData");
  divProductManager.innerHTML = "";
  divProductManager.innerHTML=
                         " <div id='projectManagerData'>"
                         +"<p> Nombre: " + json.name + " " + json.surname +"</p>"
                         +"<p> Teléfono: "+ json.phone+ "</p>"
                         + "<p> Localidad: agregar en entidad </p>"
                         + "<p> Email: " +json.email+ "</p>"
                         + "<p> Ocupación: agregar en entidad </p>"
                         + "<p> Vinculación con UNICEN: agregar en entidad </p>"
                         + "<p> Facultad a la que pertenece: </p>"
                         + "<p> Medio de conocimiento del CICE: " + json.medioConocimientoCice + "</p>"
                         + "<p> Organización asociativa: agregar en entidad </p>"
                         + "</div>" ;
 }

//ACTUALIZA EL DROPDOWN DE CREACION DE PROYECTOS CUANDO CREAS UNA NUEVA NECESIDAD
 function actualizacionSelectNecesidades(json){
  let select = document.getElementById('needs_created');
  let option = document.createElement('option');
  option.setAttribute('value', json.id_Need);
  option.setAttribute('label', json.needType);
  option.selected = true;
  select.appendChild(option);
  multiSelectsNeedsCreated.updateSelect(json.id_Need);
}

//ACTUALIZA EL DROPDOWN DE CREACION DE PROYECTOS CUANDO CREAS UNA NUEVA ASISTENCIA
function actualizacionSelectAsistencias(json){
  let select = document.getElementById('assistances_created');
  let option = document.createElement('option');
  option.setAttribute('value', json.id_Assistance);
  option.setAttribute('label', json.type);
  option.selected = true;
  select.appendChild(option);
  multiSelectsAssistancesCreated.updateSelect(json.id_Assistance);
}




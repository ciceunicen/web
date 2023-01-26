
/**
  * Se comienza con el guardado de archivos, se lee el input file.
  * @param {String} project_title - titulo del proyecto al cual pertenecen los archivos
*/
function saveAttachments(project_title) {
  event.preventDefault();
  let input_file = document.getElementById('file-7');
  let files = input_file.files;
  if(files.length != 0){//si hay archivos seleccionados
    processFile(files, project_title);
  }
}
/**
  * Se continua con el guardado de archivos,
  * primero se hace una verificación de tipos de archivos admitidos,
  * luego se cargan en DTO de proyecto, después se guardan en carpeta del sistema.
  * @param {File[]} files -  lista de archivos encontrados
  * @param {String} project_title - titulo del proyecto al cual pertenecen los archivos
*/
function processFile(files, project_title){
  /*let status = validFileType(files);//valido el tipo de archivos admitidos
  if (!status.status){
    alert("Extencion del archivo "+status.file+" no válida. Se admiten PDF, JPEG, JPG y PNG.");
  }else{*/
    saveAttachmentsInDTOProject(files)//cargo los nombres de archivos en el DTO para subir el proyecto.
    uploadFileInFolder(files, project_title)//guardo una copia en el sistema
  //}
}
/**
  * Valida el tipo de archivos admitidos, comparando con una variable que guarda los tipos admitidos.
  * corta cuando encuentra un incorrecto, sino terina sin cortar.
  * @param {File[]} files -  lista de archivos
  * @returns {json}  ok - json donde se guarda el resultado de la validación
*/
function validFileType(){
  let input_file = document.getElementById('file-7');
  const validExtensions = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

  input_file.addEventListener("change", ()=>{
    let files = input_file.files;
    let ok = {"status":true,"file":""};
    for(const file of files){
      let fileType = file.type;
      if(!validExtensions.includes(fileType)){
        ok.status = false;
        ok.file = file.name;
        break;
      }
    }
    if(!ok.status){
      paintBadFileAlert(true, ok.file);
    }else{
      paintBadFileAlert(false);
    }
    statusFile = ok.status; //sobre escribo variable global
  });
}
function paintBadFileAlert(change_alert, file_error){
  const validExtensions = ['pdf', 'jpeg', 'jpg', 'png'];
  let div = document.getElementById('div_paintBadFileAlert');
  div.innerHTML= "";
  div.classList.remove("div_p_paintBadFileAlert");
  if(change_alert){
    var p_1 = document.createElement("p");
    p_1.innerHTML = "El archivo: "+file_error+" contiene una extención inválida.";
    p_1.classList.add("p_paintBadFileAlert");
    var p_2 = document.createElement("p");
    p_2.innerHTML = "Las extenciones válidas son: "+ validExtensions;
    p_2.classList.add("p_paintBadFileAlert");
    div.appendChild(p_1);
    div.appendChild(p_2);
    div.classList.add("div_p_paintBadFileAlert");
  }
}
/**
  * Guarda en el array "attachments" los datos necesarios de los archivos,
  * para enviarlos a la base de datos junto con el proyecto.
  * @param {File[]} files -  lista de archivos
*/
function saveAttachmentsInDTOProject(files) {
  for(const file of files){
    var archivo = {
      "file":file.name,
      "type":file.type
    }
    attachments.push(archivo);
  }
}
/**
  * Dispara Guardado de los archivos en una carpeta específica del sistema,
  * esta carpeta es creada desde uploadFiles.php.
  * @param {File[]} files -  lista de archivos
  * @param {String} project_title - titulo del proyecto al cual pertenecen los archivos
*/
function uploadFileInFolder(files, project_title){
  let formData = new FormData();
  formData.append('project_title', project_title);
  for(let file of files){
    formData.append('files[]',file);
  }

  fetch("php/uploadFiles.php", {
      method: 'POST',
      body: formData,
  })
  .then(response => response.json())
  .then(json => {})
}
/**
  * Cambia conteo de archivos adjuntos, modifeca el DOM, feedback front.
*/
function changeCountInputFile(){
  let input =document.getElementById('file-7');
  input.addEventListener('change', ()=> {
    count = input.files.length;
    let span_count = document.getElementById('count_files');
    span_count.innerHTML = count +" archivos seleccionados.";
  });
}
/**
  * Pinta una vista previa del archivo que recive, en la pantalla de datos de un proyecto dado.
  * @param {String} contenedor -  Id (#file) del elemento html donde se muestra la vista previa, en este caso un div.
  * @param {String} file_name -  nombre del archivo, ejemplo: "imagen.png"
  * @param {String} project_title - titulo del proyecto al cual pertenecen el archivo
*/
function drawFileInProject(contenedor, file, proyecto_title){
  var file_name = file.file;
  let img_preview = document.createElement("img");
  img_preview.src = defineImgPreview(file, proyecto_title);
  img_preview.classList.add("img_preview");

  let p_name = document.createElement("p");
  p_name.innerHTML = file_name;
  p_name.classList.add("p_name_img_preview"); //<i class="bi bi-download"></i>

  let btn_download = document.createElement("button");
  btn_download.innerHTML = "<i class="+" bi-download"+"></i>";
  btn_download.classList.add("btn_download");

  let div = document.createElement("div");
  div.classList.add("div_preview");
  div.appendChild(img_preview);
  div.appendChild(p_name);
  div.appendChild(btn_download);

  downloadEvent(btn_download, file_name, proyecto_title);

  document.querySelector(contenedor).appendChild(div);
}
/**
  * Determina cual va a ser la imagen de vista previa del archivo que recive por parámetro,
  * dependiendo del typo del archivo.
  * @param {json} file -  archivo a evaluar
  * @param {String} project_title - titulo del proyecto al cual pertenecen el archivo
  * @returns {String}  url - url en la cual estaria la imagen de vista previa correspondiente
*/
function defineImgPreview(file, proyecto_title){
  if(file.type == "application/pdf"){
    return "img/img_preview_pdf.png";
  }
  return "uploadFiles/"+proyecto_title+"/"+file.file;
}
/**
  * Dispara descarga de un archivo individual
  * @param {ElementDOM} element - btn que dispara la descarga
  * @param {String} file_name -  nombre del archivo a descargar, ejemplo: "imagen.png"
  * @param {String} project_title - titulo del proyecto al cual pertenecen el archivo, usado para armar url de descarga.
*/
function downloadEvent(element, file_name, proyecto_title){
  element.addEventListener("click", ()=>{
    let url = "uploadFiles/"+proyecto_title+"/"+file_name;
    runDownload(url, file_name)
  });
}
/**
  * Dispara la creación de un Zip,
  * que contendrá todos los archivos de una carpeta, dada por el título del proyecto.
  * La creación se efectua en uploadFiles.php
  * @param {String} project_title - título del proyecto al cual pertenecen los archivos a descargar
*/
function downloadAllAttachmentsByProject(proyecto_title){
  let element = document.getElementById('downloadAll');
  element.addEventListener("click", ()=>{
    event.preventDefault();
    let formData = new FormData();

    let zip_name = proyecto_title+"_Adjuntos.zip";
    formData.append('zip_name',zip_name);

    let folder_path = "../uploadFiles/"+proyecto_title;
    formData.append('folder_path',folder_path);

    fetch("php/uploadFiles.php", {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(json => downloadZip(json))
  });
}
/**
  * Dispara descarga de Zip creado
  * @param {String} zip_name -  nombre del zip a descargar, ejemplo: "My Project_Adjuntos.zip"
*/
function downloadZip(zip_name){
  let url = "uploadFiles/"+zip_name;
  runDownload(url, zip_name)
  removeZipFromSystem(zip_name);
}
/**
  * Ejecuta la descarga del Zip o de un archivo dado. (funciona para los casos)
  * @param {String} url -  url de donde se encuentra el elemento a descargar, carpeta del sistema.
  * @param {String} name_download -  se pide definido un nombre para asignar al elemento por descargar.
*/
function runDownload(url, name_download){
  const download_link = document.createElement("a");
  download_link.href = url;
  download_link.target = "_blank";
  download_link.download = name_download;

  document.body.appendChild(download_link);
  download_link.click();
  document.body.removeChild(download_link);
}
/**
  * Llama a funcion que elimina un archivo dado de la carpeta "uploadFiles".
  * @param {String} filename -  nombre del archivo a eliminar.
*/
function removeZipFromSystem(filename){
  let formData = new FormData();
  formData.append('filename_delete',filename);

  fetch("php/uploadFiles.php", {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(json => {})
}

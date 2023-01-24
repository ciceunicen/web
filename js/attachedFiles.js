//GUARDAR ARCHIVOS ADJUNTOS
function saveAttachments() {
  event.preventDefault();
  let input_file = document.getElementById('file-7');
  let files = input_file.files;
  if(files.length != 0){//si hay archivos seleccionados
    processFile(files);
  }
}

function processFile(files){
  let status = validFileType(files);//valido el tipo de archivos admitidos
  if (!status.status){
    alert("Extencion del archivo "+status.file+" no válida. Se admiten PDF, JPEG, JPG y PNG.");
  }else{
    saveAttachmentsInDTOProject(files)//cargo los nombres de archivos en el DTO para subir el proyecto.
    uploadFileInFolder(files)//guardo una copia en el sistema
  }
}

function validFileType(files){
  const validExtensions = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  let ok = {"status":true,"file":""};
  for(const file of files){
    let fileType = file.type;
    if(!validExtensions.includes(fileType)){
      ok.status = false;
      ok.file = fileType;
      break;
    }
  }
  return ok;
}

function saveAttachmentsInDTOProject(files) {
  for(const file of files){
    attachments.push(file.name);
  }
}

function uploadFileInFolder(files){
  let formData = new FormData();
  for(let file of files){
    formData.append('files[]',file);
  }

  fetch("php/uploadFiles.php", {
      method: 'POST',
      body: formData,
  })
  .then(response => response.json())
  .then(json => showFiles(json))
}

function showFiles(json){
  //quisiera mostrar que se está subiendo
  console.log(json)

}

function changeCountInputFile(){
  let input =document.getElementById('file-7');
  input.addEventListener('change', ()=> {
    count = input.files.length;
    let span_count = document.getElementById('count_files');
    span_count.innerHTML = count +" archivos seleccionados.";
  });
}
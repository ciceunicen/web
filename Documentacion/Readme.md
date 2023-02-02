### attachedFiles.js
1. saveAttachments(project_title)  
*Se comienza con el guardado de archivos, se lee el input file.*  
*project_title - titulo del proyecto al cual pertenecen los archivos*
2. processFile(files, project_title)  
*Se continua con el guardado de archivos, primero se hace una verificación de tipos de archivos admitidos,luego se cargan en DTO de proyecto, después se guardan en carpeta del sistema.*  
*files -  lista de archivos encontrados*  
*project_title - titulo del proyecto al cual pertenecen los archivos*
3. validFileType()  
*Valida el tipo de archivos admitidos, comparando con una variable que guarda los tipos admitidos. corta cuando encuentra un incorrecto, sino itera sin cortar.*
4. paintBadFileAlert(change_alert, file_error)  
*Dispara una alerta cuando el tipo ingresadod e archivo es incorrecto(o no se acepta)* 
5. saveAttachmentsInDTOProject(files)  
*Guarda en el array "attachments" los datos necesarios de los archivos, para enviarlos a la base de datos junto con el proyecto.*  
*files -  lista de archivos*
6. uploadFileInFolder(files, project_title)  
*Dispara Guardado de los archivos en una carpeta específica del sistema, esta carpeta es creada desde uploadFiles.php.*  
*files -  lista de archivos*  
*project_title - titulo del proyecto al cual pertenecen los archivos*
7. changeCountInputFile()  
*Cambia conteo de archivos adjuntos, modifeca el DOM, feedback front.*
8. drawFileInProject(contenedor, file, proyecto)  
*Pinta una vista previa del archivo que recive, en la pantalla de datos de un proyecto dado.*  
*contenedor -  Id (#file) del elemento html donde se muestra la vista previa, en este caso un div.*  
*file_name -  nombre del archivo, ejemplo: "imagen.png"*  
*project_title - titulo del proyecto al cual pertenecen el archivo*
9. defineImgPreview(file, proyecto_title)  
*Determina cual va a ser la imagen de vista previa del archivo que recive por parámetro, dependiendo del typo del archivo.*  
*file -  archivo a evaluar*  
*project_title - titulo del proyecto al cual pertenecen el archivo*  
10. downloadEvent(element, file_name, proyecto_title)  
*Dispara descarga de un archivo individual*  
*element - btn que dispara la descarga*  
*file_name -  nombre del archivo a descargar, ejemplo: "imagen.png"*  
*project_title - titulo del proyecto al cual pertenecen el archivo, usado para armar url de descarga.*
11. downloadAllAttachmentsByProject(proyecto_title)  
*Dispara la creación de un Zip, que contendrá todos los archivos de una carpeta, dada por el título del proyecto. La creación se efectua en uploadFiles.php*  
*project_title - título del proyecto al cual pertenecen los archivos a descargar*
12. downloadZip(zip_name)  
*Dispara descarga de Zip creado*  
*zip_name -  nombre del zip a descargar, ejemplo: "My Project_Adjuntos.zip"*
13. runDownload(url, name_download)  
*Ejecuta la descarga del Zip o de un archivo dado. (funciona para los casos)*  
*url -  url de donde se encuentra el elemento a descargar, carpeta del sistema.*  
*name_download -  se pide definido un nombre para asignar al elemento por descargar.*
14. removeFileFromSystem(filename)  
*Llama a funcion que elimina un archivo dado de la carpeta "uploadFiles".*  
*filename -  nombre del archivo a eliminar.*
15. deletedEvent(element, file, proyecto)  
*Elimina un archivo en especifico*
16. removedAllAttachmentsByProject(proyecto)  
*Elimina todos los archivos de un proyecto*  

### dropdownSectionProjectsRemoved.js
1. configDropdown(id_btn_change_screen, section)
2. actionDropdown(section)
3. initDropdown(div_cont, id_btn_change_screen)
4. showDropdownHTML(texto, div_cont, id_btn_change_screen)
5. addEventListenerArrowRight(btn)  
*Evento de Cambio de pantalla a proyectos eliminados*
6. eventDropdownONBtn(btn)
*Agrego animación de arrastre para MOSTRAR*
7. eventDropdownOFFBtn(btn)
*Agrego animación de arrastre para OCULTAR*

### index.js
1. drawClickNav(click_nav)   
*Pinta de color verde obscuro el botón del navegador en el que se encuentra la página.*  
*Se le pasa por parametro el elemento que se quiera pintar*
2.  getAllBaseURL(url, elementDOM)  
*reutilizable del Filtro para Necesidades,Asistencias y Estadios*
3. createOptionsSelectDOM(json, elementDOM)

### mostrarHTML.js
1. mostrarArchivoHTML(rutaArchivo)  
*Muestra un archivo html el param rutaArchivo es la ruta del archivo html*
2. mostrarHome()
*Muestra el home de la pagina*
3. showTableProjectsRemoved()  
*Cambio de pantalla a proyectos eliminados*
4. mostrarProyectos(json)  
*muestra la lista de proyectos*
5. mostrarPaginado(pages,tablaUtilizada,datosFiltro = [],div=".footer-list-projects")  
*muestra la seccion del paginado*
6. mostrarProyecto(proyecto)  
*Muestra ub proyecto*
7. mostrarCargaProyecto()  
*Muestra el formulario Carga de proyectos*
8. partialRendercargaDatosEmprendedor(div,id_emprendedor)
*Contiene el html de Emprendedor*
9. cargaRenderNecesidades()
10. cargaRenderAsistencia()
11. mostrarListaEmprendedores()  
*Muestra la lista de emprendedores*
12. partialRenderHistorialProject(div, id_project)
13. mostrarEmprendedor(emprendedor)  
*muestra un emprendedor*
14. showDataProjectManager(projectManager)
*llamo a contenido donde se muestran los datos del emprendedor*
15. mostrarEditarProyecto(id_proyecto,proyecto)  
*Muestra la edicion del proyecto*
16. mostrarFilesEditar(proyecto)
17. mostrarAdjuntos(proyecto)

### multi-select-tag.js
*Metodo de dropdown para seleccionar multiples option*
1. MultiSelectTag (el,id_btn_reset_filter, id_btn_save ,customs = {shadow: false, rounded:true})
2. init()
3. createElements()
4. initOptions(val = null)
5. createTag(option)
6. enableItemSelection()
7. isTagSelected(val)
8. removeTag(val)
9. setValues()
10. getOptions()
11. resetOptions()
12. updateSelect()

### projectManager.js
1. readDomProductManager(json)  
*Funcion para mostrar datos en HTML*
2. getAllProjectManagers()
3. getAllProjectsByProjectManager(idProjectManager)
4. mostrarResponsableProyecto(id)  
*Mostrar responsable del proyecto*
5. showDataProjectManager(projectManager)  
*carga datos en la tabla de datos de un emprendedor*
6. generarTablaEmprendedores(json)  
*Toda la lista de emprendedores*

### proyectos.js
1. saveProject(datos)
2. borrarProyecto(id_Project,id_Admin,projectManager=0)  
*Borra un proyecto en particular*
3. getProyecto(id)
4. getAllProjects()
5. getAllDeleteProjects(page=1)
*Get de todos los proyectos borrados*
6. getFilterProjects(datos,pagina)
7. getProjectHistory(id)
8. modificarProyecto(id_proyecto, proyecto)
9. borrarFilesProyecto(id_Project,idFile=false)
10. comportamientoPaginado(pages,datosFiltro,tablaUtilizada)  
*maneja el funcionamiento del paginado de la tabla de proyectos*
11. cambiarNumeroPaginado(datosFiltro,tablaUtilizada,pages)
12. comportamientoBotonesPaginado(pages)
13. mostrarTabla(json,borrados,projectManager=false)  
*Generar tabla de proyectos*
14. captureSelectedOptions()  
*Captura las opciones seleccionadas del filtro de proyectos*
15. mostrarHistorialProyecto()  
*Muestra historial del proyecto*
16. actualizacionSelect(value,label,idElemento,funcion)  
*ACTUALIZA EL DROPDOWN DE CREACION DE PROYECTOS CUANDO CREAS UNA NUEVA ASISTENCIA O UNA NUEVA NECESIDAD*
17. innerHTML(json, elementDOM)  
*GENERA LAS OPCIONES DEL FORMULARIO DE CREACION DE PROYECTOS*
18. inicializarCargaProyecto(id_ProjectManager)  
*COMPRUEBA LOS CAMPOS DE CARGA DE PROYECTOS*
19. guardarNecesidades()
20. guardarAsistencias()
21. showSucess(datos)  
*MUESTRA TILDE VERDE CUANDO TODO SE CARGO BIEN*
22. selecionarSoloUnEstadio()  
*SELECCIONAR SOLO UN ESTADIO*
23. mostrarArray(contenedor,arreglo,dato, proyecto)  
*CONVIERTE ARRAY A LISTA PARA MOSTRARLA EN LOS DATOS DEL PROYECTO*
24. generarTablaHistorial(json)  
*Generar tabla de proyectos*
25. saveNewData(id_proyecto, proyecto)
26. cargarCheckboxes(URL, proyecto,dato)
27. selectedOptions(idSelect,multiSelect)

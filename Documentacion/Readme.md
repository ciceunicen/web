1. drawClickNav(click_nav) 
*Pinta de color verde obscuro el botón del navegador en el que se encuentra la página.*
*Se le pasa por parametro el elemento que se quiera pintar*

2. mostrarProyectos(json)
*Genera los filtros y la tabla de los proyectos paginados*

3. mostrarTabla(json)
*Muestra la tabla de los proyectos*

4. captureSelectedOptions()
*Captura el tipo de filtro que fue seleccionado para realizar la consulta*

5. getAllBaseURL(url, elementDOM)
*Metodo reutilizable del Filtro para Necesidades,Asistencias y Estadios*
*Get dinamico para lo que hay en la DB*

6. getFilterProjects(datos)
*Get de la lista de proyectos filtrada*

7. getAllProjects()
*Obtiene todos los proyectos*

8. mostrarCargaProyecto()
*Muestra el formulario Carga de proyectos*

9. partialRendercargaDatosEmprendedorYHistorial(div,id_emprendedor)
*Contiene el html de Emprendedor e Historia*

10. inicializarCargaProyecto()
*Lee los datos del proyectos del formulario, los guarda en un json y verifica que los checkboxs no esten sin marcar*

11. saveAttachments()
*Guarda los archivos subidos al proyecto*

12. guardarNecesidades()
13. guardarAsistencias()
14. saveProject(datos)

15. getProjectManager(id)
*Trae un emprendedor por id*

16. readDomProductManager(json)
*Funcion para mostrar datos en HTML*

17. mostrarResponsableProyecto(id)
*Muetra al emprendedor resposable del proyecto por su id*

18. mostrarHistorialProyecto()
19. mostrarProyecto(proyecto)

20. mostrarArray(contenedor,arreglo,dato)
*Pasa un array a lista*

21. getProyecto()

22. borrarProyecto(id_Project,id_Admin)
*Borra un proyecto en especifico*

23. actualizacionSelectNecesidades(json)

24. actualizacionSelectAsistencias(json)

25. cargaRenderNecesidades()

26. cargaRenderAsistencia()

27. 
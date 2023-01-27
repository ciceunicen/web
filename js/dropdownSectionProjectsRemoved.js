function configDropdown(id_btn_change_screen, section){
    //renderizo el dropdown (es un partialrender)
    let div_cont = 'div_dropdown_projects_removed';
    initDropdown(div_cont, id_btn_change_screen).then(()=>{
      let btn = document.getElementById(id_btn_change_screen);
      //cambio a pantalla tabla de proyectos
      btn.addEventListener("click", ()=>{
        actionDropdown(section);
      });
    });
}

function actionDropdown(section){
if(section == "projects"){
    page=1;
    getAllProjects().then(json => mostrarProyectos(json));
}else if (section == "projects_removed"){
    showTableProjectsRemoved();
}
}

function initDropdown(div_cont, id_btn_change_screen){
    return mostrarArchivoHTML("html/dropdownRemoved.html").then(texto=> showDropdownHTML(texto, div_cont, id_btn_change_screen));
}

function showDropdownHTML(texto, div_cont, id_btn_change_screen){
    document.getElementById(div_cont).innerHTML = texto;
    let btn = document.getElementById(id_btn_change_screen);
    addEventListenerArrowRight(btn);
}

//evento de Cambio de pantalla a proyectos eliminados
function addEventListenerArrowRight(btn){
    let arrow_right = document.getElementById('btn_right_projects_removed');
    arrow_right.addEventListener("click",()=>{
        //cambio que flechas se muestran
        arrow_right.classList.add('hiddenData');
        let arrow_left = document.getElementById('btn_left_projects_removed');
        arrow_left.classList.remove('hiddenData');
        //agrego evento viceversa de flechas
        arrow_left.addEventListener("click", ()=>{
            arrow_left.classList.add('hiddenData');
            arrow_right.classList.remove('hiddenData');
            eventDropdownOFFBtn(btn);
        });
        eventDropdownONBtn(btn);
    });
}

function eventDropdownONBtn(btn){
    document.getElementById('btn_section_projects').classList.add('hiddenData');
    //Agrego animación de arrastre para MOSTRAR
    btn.classList.remove('hiddenData');
    btn.classList.remove('widtDropdown');
    btn.classList.remove('animate_dropdown_off');
    btn.classList.add('animate_dropdown_on');
    btn.classList.add('widtDropdownON');
}
function eventDropdownOFFBtn(btn){
    //Agrego animación de arrastre para OCULTAR
    btn.classList.remove('animate_dropdown_on');
    btn.classList.add('animate_dropdown_off');
    setTimeout(()=>{
        btn.classList.add('hiddenData');
        btn.classList.remove('widtDropdownON');
        btn.classList.add('widtDropdown');
    }, 500);
}
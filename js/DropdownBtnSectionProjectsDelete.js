class DropdownBtnSectionProjectsDelete{
    constructor(){
        this.arrow_right;
    }
    //partialrender
    showDropdown(div_cont){
        //div_dropdown_projects_removed
        fetch("html/dropdownRemoved.html").then(
            function(response){
              response.text().then(
            function(texto){
              document.getElementById(div_cont).innerHTML = texto;
            }
          );
            }
        );
    }

    //Cambio de pantalla a proyectos eliminados
    showTableProjectsRemoved(){
        fetch("html/listProjectsRemoved.html").then(
            function(response){
                response.text().then(
                    function(texto){
                        document.querySelector(".main-container").innerHTML = texto;
                    }
                );
            }
        );
    }

    //evento de Cambio de pantalla a proyectos eliminados
    addEventListenerArrowRight(btn){
        this.arrow_right = document.getElementById('btn_right_projects_removed');
        this.arrow_right.addEventListener("click",()=>{
            //cambio que flechas se muestran
            this.arrow_right.classList.add('hiddenData');
            let arrow_left = document.getElementById('btn_left_projects_removed');
            arrow_left.classList.remove('hiddenData');
            //agrego evento viceversa de flechas
            arrow_left.addEventListener("click", ()=>{
                arrow_left.classList.add('hiddenData');
                this.arrow_right.classList.remove('hiddenData');
                this.eventDropdownOFFBtn(btn);
            });
            this.eventDropdownONBtn(btn);
        });
    }

    eventDropdownONBtn(btn){
        document.getElementById('btn_section_projects').classList.add('hiddenData');
        //Agrego animación de arrastre para MOSTRAR
        btn.classList.remove('hiddenData');
        btn.classList.remove('widtDropdown');
        btn.classList.remove('animate_dropdown_off');
        btn.classList.add('animate_dropdown_on');
        btn.classList.add('widtDropdownON');
    }
    eventDropdownOFFBtn(btn){
        //Agrego animación de arrastre para OCULTAR
        btn.classList.remove('animate_dropdown_on');
        btn.classList.add('animate_dropdown_off');
        setTimeout(()=>{
            btn.classList.add('hiddenData');
            btn.classList.remove('widtDropdownON');
            btn.classList.add('widtDropdown');
        }, 500);
    }
    changeBtnScreenProjectsRemoved(){
        document.getElementById('btn_section_projects_removed').classList.add('hiddenData');
        document.getElementById('btn_section_projects').classList.remove('hiddenData');
    }
}
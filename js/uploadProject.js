document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const NEEDS_URL = "http://localhost:8080/needs";
    const ASSISTANCES_URL = "http://localhost:8080/assistances";
    const STAGES_URL = "http://localhost:8080/stages";
    const PROJECT_URL = "http://localhost:8080/projects";
    const TOKEN = localStorage.getItem("token");


    let needContainer = document.querySelector("#needsData");
    let assistanceContainer = document.querySelector("#assistancesData");
    let stagesContainer = document.querySelector("#stagesData");
    let form = document.querySelector("#projectForm");

    getNeeds(NEEDS_URL);
    getAssistances(ASSISTANCES_URL);
    getStages(STAGES_URL);

    if(form){
        form.addEventListener('submit', validForm);
    
        async function validForm(e){
            let needs = [];
            let assistances = [];

            let needsCheckboxes = document.querySelectorAll('input[name="need-checkbox"]:checked');
            needsCheckboxes.forEach((checkbox) => {
                needs.push(checkbox.value);
            });

            let assistancesCheckboxes = document.querySelectorAll('input[name="assistance-checkbox"]:checked');
            assistancesCheckboxes.forEach((checkbox) => {
                assistances.push(checkbox.value);
            });

            let stage = document.querySelector('input[name="stage-checkbox"]:checked');

            e.preventDefault();
            let formData = new FormData(form);
            let title = formData.get('title');
            let description = formData.get('description');
            

            if ((title != "" && title != "undefined") && (description != "" && description != "undefined") && needs.length > 0 &&
            assistances.length > 0 && stage != null) {
                document.querySelector("#titleError").innerHTML = "";
                document.querySelector("#descriptionError").innerHTML = "";
                document.querySelector("#needError").innerHTML = "";
                document.querySelector("#assistanceError").innerHTML = "";
                document.querySelector("#stageError").innerHTML = "";
                let successImg = document.getElementsByClassName("success-icon");
                successImg[0].style.opacity = "1";
                successImg[1].style.opacity = "1";

                let data = {
                    "id_ProjectManager": id_ProjectManager,
                    "title": title,
                    "description": description,
                    "stage": stage,
                    "assistanceType": assistances,
                    "files": null,
                    "needs": needs,
                    "id_Admin": 1
                }

                saveProject(data);
                needs = [];
                assistances = [];
            }
        }
    }

    async function saveProject(data) {
        try{
            let res = await fetch(PROJECT_URL,{
                "method" : "POST",
                "headers" : {"Authorization": "Bearer " + TOKEN},
                "headers" : {"Content-type" : "application/json"},
                "body" : JSON.stringify(data)
            });
            if(res.ok) {
                showSucess();
            }
        }catch(error){
            console.log(error);
        }
    }

    function showSucess() {
        document.querySelector(".generalSave").innerHTML =
          "<p> Se han cargado los datos exitosamente</p>";
      }

    async function getNeeds(url) {
        try {
            let res = await fetch(url, {
                "method": "GET",
                "headers": {"Authorization": "Bearer " + TOKEN}
            })
            if (res.ok) {
                let array = await res.json();
                if (array) {
                    showNeeds(array);
                }
            }
        } catch (error) {
            console.log("Fallo al obtener el JSON de la API.");
            console.log(error);
        }
    }

    async function getAssistances(url) {
        try {
            let res = await fetch(url, {
                "method": "GET",
                "headers" : {"Authorization": "Bearer " + TOKEN}
            })
            if (res.ok) {
                let array = await res.json();
                if (array) {
                    showAssistances(array);
                }
            }
        } catch (error) {
            console.log("Fallo al obtener el JSON de la API.");
            console.log(error);
        }
    }

    async function getStages(url) {
        try {
            let res = await fetch(url, {
                "method": "GET",
                "headers" : {"Authorization": "Bearer " + TOKEN}
            })
            if (res.ok) {
                let array = await res.json();
                if (array) {
                    showStages(array);
                }
            }
        } catch (error) {
            console.log("Fallo al obtener el JSON de la API.");
            console.log(error);
        }
    }

    function showNeeds(array) {
        array.forEach(need => {
            let article = document.createElement('article');
            let input = document.createElement('input');
            input.classList.add('checkbox-input');
            input.type = 'checkbox';
            input.name = "need-checkbox"
            input.value = need.needType;
            let label = document.createElement('label');
            label.classList.add("checkbox-label");
            label.textContent = need.needType;        
            article.appendChild(input);
            article.appendChild(label);
        
            needContainer.appendChild(article);  
        });
    }

    function showAssistances(array) {
        array.forEach(assistance => {
            let article = document.createElement('article');
            let input = document.createElement('input');
            input.classList.add('checkbox-input');
            input.type = 'checkbox';
            input.name = "assistance-checkbox"
            input.value = assistance.type;
            let label = document.createElement('label');
            label.classList.add("checkbox-label");
            label.textContent = assistance.type;
            article.appendChild(input);
            article.appendChild(label);
          
            assistanceContainer.appendChild(article);      
        });
    }

    function showStages(array) {
        array.forEach(stage => {
            let article = document.createElement('article');
            let input = document.createElement('input');
            input.classList.add('checkbox-input');
            input.type = 'checkbox';
            input.name = "stage-checkbox"
            input.value = stage.stage_type;
            let label = document.createElement('label');
            label.classList.add("checkbox-label");
            label.textContent = stage.stage_type;
            article.appendChild(input);
            article.appendChild(label);
          
            stagesContainer.appendChild(article);      
        });
    }

})
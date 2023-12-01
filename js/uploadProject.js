document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const NEEDS_URL = "http://localhost:8080/needs"
    const ASSISTANCES_URL = "http://localhost:8080/assistances";
    const STAGES_URL = "http://localhost:8080/stages"
    const TOKEN = localStorage.getItem("token");


    let needContainer = document.querySelector("#needsData");
    let assistanceContainer = document.querySelector("#assistancesData");


    getNeeds(NEEDS_URL);
    getAssistances(ASSISTANCES_URL);

    async function getNeeds(url) {
        try {
            let res = await fetch(url, {
                "method": "GET",
                "headers": {
                    "Authorization": "Bearer " + TOKEN
                }
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
                "headers": {
                    "Authorization": "Bearer " + TOKEN
                }
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

    function showNeeds(array) {
        array.forEach(need => {
            let article = document.createElement('article');
            let input = document.createElement('input');
            input.classList.add('checkbox-input');
            input.type = 'checkbox';
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
            input.value = assistance.type;
            let label = document.createElement('label');
            label.classList.add("checkbox-label");
            label.textContent = assistance.type;
            article.appendChild(input);
            article.appendChild(label);
          
            assistanceContainer.appendChild(article);      
        });
    }

})
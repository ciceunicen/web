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
        needContainer.innerHTML = "";
        array.forEach(need => {
            let needData = 
            `<article>
                <input class='checkbox-input' type='checkbox' id='cbox1' value=${need.needType}> 
                <label>${need.needType}</label>
            </article>`
            needContainer.innerHTML += needData;
        });
    }

    function showAssistances(array) {
        assistanceContainer.innerHTML = "";
        array.forEach(assistance => {
            let assistanceData = 
            `<article>
                <input class='checkbox-input' type='checkbox' id='cbox1' value=${assistance.type}> 
                <label>${assistance.type}</label>
            </article>`
            assistanceContainer.innerHTML += assistanceData;
        });
    }

})
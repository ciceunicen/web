document.addEventListener("DOMContentLoaded", async(e) => {
    "use strict";
    const id = 7;
    const URL_ROL_USER = "http://localhost:8080/usuarios/" + id + "/rol";



    let btnChangeRol = document.querySelector('#btn1');
    let tdName = document.querySelector('#tdName');
    let tdSurn = document.querySelector('#tdSurn');
    let tdMail = document.querySelector('#tdMail');
    let tdUser = document.querySelector('#tdUser');

    btnChangeRol.addEventListener("click", (e) => {
        e.preventDefault();
        changeRol();
    })

    async function changeRol() {
        try {
            let response = await fetch(URL_ROL_USER, {
                "method": "PUT",
                "headers": {
                    "Content-Type": "application/json",
                },
                "body": JSON.stringify({


                    "id": 1

                })


            });
            let data = await response.json();
            tdName.innerHTML = data.name;
            tdSurn.innerHTML = data.surname;
            tdMail.innerHTML = data.email;
            tdUser.innerHTML = data.rol.type;
            if (!response.ok) {
                throw { error: data.error, status: data.status }
            }
        } catch (e) {
            console.log(e)
        }



    }
})
document.addEventListener("DOMContentLoaded", (e) => {
    "use strict";

    /*   let sig_form = document.querySelector('.sig_form')*/
    let btnLog = document.querySelector('#btnLog')
    let btnReg = document.querySelector('#btnReg')

    checkInputs();

    function checkInputs() {
        document.querySelectorAll('input').forEach(i => {



            i.onkeyup = () => {
                if (checkSigninInput()) {

                    btnLog.removeAttribute('disabled')
                    btnReg.removeAttribute('disabled')
                } else {

                    btnLog.setAttribute('disabled', 'true')
                    btnReg.setAttribute('disabled', 'true')
                }
            }
        })
    }

    const checkSigninInput = () => {

        let inputs = document.querySelectorAll('input')

        return Array.from(inputs).every(input => {
            return input.value.trim().length >= 1
        })
    }
})
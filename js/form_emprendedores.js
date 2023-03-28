document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    document.getElementById("fisica").addEventListener("click", () => {

        document.getElementById("div_apellido").style.display = "block";
        document.getElementById("tipo_razon").innerHTML = "Nombre";
        document.getElementById("name").setAttribute("value", "carga default de nombre de la persona");
        document.getElementById("surname").setAttribute("value", "carga default de apellido de la persona");
        document.getElementById("email").setAttribute("value", "carga default de email de la persona");

    });

    document.getElementById("juridica").addEventListener("click", () => {
        document.getElementById("div_apellido").style.display = "none";
        document.getElementById("tipo_razon").innerHTML = "Razon Social";
        document.getElementById("name").setAttribute("value", "carga default de razon social de la persona");
    });




})

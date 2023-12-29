const URLNotifications = "http://localhost:8080/notifications";

async function getEntrepreneurNotifications(user) {
  const response = await fetch(`${URLNotifications}/projectManager/${user.id}`, {
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  });
  if (response.ok) {
    const notificaciones = await response.json();
    console.log("NOTIFICACIONES", notificaciones);
    return notificaciones;
  } else {
    console.error("Error al obtener las notificaciones");
  }
}

async function setEntrepreneurNotificationsAsRead(user) {
  const response = await fetch(`${URLNotifications}/projectManager/${user.id}`, {
    "method": "PUT",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  });
  if (response.ok) {
    const notificaciones = await response.json();
    console.log("NOTIFICACIONES", notificaciones);
    return notificaciones;
  } else {
    console.error("Error al obtener las notificaciones");
  }
}

async function manageNotifications() {
  const notificacionesContainer = document.querySelector(".notificaciones-container");
  const iconoNotificacion = document.querySelector(".icono-notificacion");

  if (notificacionesContainer != null && iconoNotificacion != null) {
    let user = JSON.parse(localStorage.getItem('usuario'));

    iconoNotificacion.addEventListener("click", async () => {
        notificacionesContainer.classList.toggle("hidden");
        if (notificacionesContainer.classList.contains("hidden")) {
          const DTONotifications = await setEntrepreneurNotificationsAsRead(user);
          showNotifications(DTONotifications.notifications);

          if (DTONotifications.readQuantity > 0) {
            iconoNotificacion.setAttribute("src", "../img/Icono-notificacion2.svg");
          } else {
            iconoNotificacion.setAttribute("src", "../img/Icono-notificacion1.svg");
          }
        }
    });

    const DTONotifications = await getEntrepreneurNotifications(user);
    showNotifications(DTONotifications.notifications);

    if (DTONotifications.readQuantity > 0) {
      iconoNotificacion.setAttribute("src", "../img/Icono-notificacion2.svg");
    }
  }
}

function showNotifications(notifications) {
  const notificationsSection = document.querySelector(".notificaciones");
  let dateFromDatabase = null;
  let formattedDate = null;

  notificationsSection.innerHTML = "";
  for (let notification of notifications) {
    dateFromDatabase = new Date(notification.date);
    formattedDate = dateFromDatabase.toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    notificationsSection.innerHTML += `<article>
      <p>${notification.message}</p>
      <p>${formattedDate}</p>
    </article>`

    let lastNotification = null;
    if (!notification.isRead) {
      lastNotification = notificationsSection.lastElementChild;
      lastNotification.setAttribute("class", "notReaded");
    }
  }
}

// Muestra las notificaciones en el dashboard si el usuario es emprendedor y existe el dashboardHeader
function showNotificationIcon() {
    let user = JSON.parse(localStorage.getItem('usuario'));
    if (user.rolType.toLowerCase() == "emprendedor") {
      const dashboardHeader = document.querySelector(".dashboard-header");
      if (dashboardHeader != null) {
        dashboardHeader.innerHTML += `<img class="icono-notificacion" src="../img/Icono-notificacion1.svg" alt="notificacion">
        <div class="notificaciones-container hidden">
            <div class="notificaciones-top">
                <p>Notificaciones</p>
            </div>
            <section class="notificaciones">

            </section>
            <div class="notificaciones-bottom">

            </div>
        </div>`
      }
  }
}

showNotificationIcon();
manageNotifications();
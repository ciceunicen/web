const URLNotifications = "http://localhost:8080/notifications";

async function getNotifications(user) {
  const response = await fetch(`${URLNotifications}/projectManager/${user.id}`, {
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  });
  if (response.ok) {
    const notificaciones = await response.json();
    return notificaciones;
  } else {
    console.error("Error al obtener las notificaciones");
  }
}

async function setNotificationsAsRead(user) {
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
  // Seleccion de elementos HTML
  const notificacionesContainer = document.querySelector(".notificaciones-container");
  const iconoNotificacion = document.querySelector(".icono-notificacion");

  // Verificamos que ambos elementos hayan sido seleccionados del DOM
  if(notificacionesContainer == null || iconoNotificacion == null){ return ;}

  let user = JSON.parse(localStorage.getItem('usuario'));
  
  iconoNotificacion.addEventListener("click", async () => {
      notificacionesContainer.classList.toggle("hidden");
      if (notificacionesContainer.classList.contains("hidden")) {
        const DTONotifications = await setNotificationsAsRead(user);
        showNotifications(DTONotifications.notifications);

        if (DTONotifications.readQuantity > 0) {
          iconoNotificacion.setAttribute("src", "../img/Icono-notificacion2.svg");
        } else {
          iconoNotificacion.setAttribute("src", "../img/Icono-notificacion1.svg");
        }
      }
  });

  const DTONotifications = await getNotifications(user);
  showNotifications(DTONotifications.notifications);

  if (DTONotifications.readQuantity > 0) {
    iconoNotificacion.setAttribute("src", "../img/Icono-notificacion2.svg");
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

manageNotifications();
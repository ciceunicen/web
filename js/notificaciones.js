const URLNotifications = "http://localhost:8080/notifications";

async function getEntrepreneurNotifications(user) {
  const response = await fetch(`${URLNotifications}/projectManager/${user.id}`, {
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
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
      "Authorization": "Bearer " + token
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
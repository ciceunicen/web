# Frontend - CICE

  

El proyecto consiste en el desarrollo de un Sistema de Gestión de Emprendedores que está siendo desarrollado en el Centro de Innovación y Creación de Empresas (CICE) de la UNCPBA. El objetivo de dicho proyecto es desarrollar una aplicación web que permita la gestión de emprendedores y emprendimientos en el área de influencia de la UNCPBA

  

## Configuración del Proyecto

  

A continuación se detallan los pasos necesarios para configurar y ejecutar el proyecto localmente:

### Requisitos Previos

#### Se deben tener instalados los siguientes entornos:
  
1. [XAMPP](https://www.apachefriends.org/es/download.html): Asegúrate de tener XAMPP instalado y configurado en tu máquina. Este entorno proporciona Apache para el servidor web y MySQL para la base de datos. 

2. [Live Server-Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (Opcional): Si prefieres utilizar Visual Studio Code, puedes instalar la extensión Live Server para facilitar el desarrollo y la visualización en tiempo real de los cambios.

  

### Iniciar el Entorno Local


1. Inicia Apache y MySQL en XAMPP.

2. Descargar el proyecto desde el repositorio y guardarlo en la carpeta `htdocs` de XAMPP.
	-   Copiar el enlace (https://github.com/ciceunicen/web.git)
	-   Clonar la rama develop del repositorio utilizando Git en la carpeta de XAMPP-->htdocs:
    -   `git clone -b develop https://github.com/ciceunicen/web.git`

3. Sigue las instrucciones para levantar el back-end local.  Consultar [Configuración del Proyecto Back-end](https://github.com/ciceunicen/core/tree/develop#configuración-de-proyecto)

4. Abre tu navegador y accede a `localhost/.../web.


> **Consideraciones:** es **posible** levantar el Frontend con Live Server de Visual Studio Code en el puerto 5501 pero solo podrás navegar por el login del sitio.

  

## Estructura del Proyecto

  

El frontend del proyecto está organizado en las siguientes carpetas:

  

- **.vscode:** Configuraciones específicas de Visual Studio Code.

- **Documentation:** Documentación adicional sobre el frontend.

- **html:** Archivos HTML para las diferentes páginas de la aplicación.

- **img:** Imágenes y recursos visuales utilizados en la interfaz.

- **js:** Código JavaScript para la lógica de la aplicación.

- **php:** scripts PHP para interacción con el backend.

- **uploadFiles:** Carpeta para archivos cargados por los usuarios.

- **index.html:** Página principal de la aplicación.

- **README.md:** Documentación principal del frontend.



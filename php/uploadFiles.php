<?php
    // Include and initialize ZipArchive class
    require_once 'ZipArchiver.php';
    /**
    * Crea un archivo ZIP a partir de una carpeta y la guarda en el sistema.
    * @param folder_path :String ubicación de la carpeta a copiar en el zip, ejemplo: ""../uploadFiles/My Project"
    * @param zip_name :String como se llama el nuevo zip, ejemplo: "My Project_Adjuntos.zip"
    * @return zip_name :String retorna el nombre del zip creado, ejemplo: "My Project_Adjuntos.zip"
    */
    if(isset($_POST['folder_path']) &&isset($_POST['zip_name'])){
        $sourcePath = $_POST['folder_path'];
        $zip_name = $_POST['zip_name'];

        $outZipPath = "../uploadFiles/".$zip_name;
        $zipper  = new ZipArchiver();
        $zip = $zipper->zipDir($sourcePath, $outZipPath);
        echo json_encode($zip_name);
    }
    /**
    * Guarda los archivos que recive en una carpeta específica.
    * @param project_title :String nombre del proyecto, ejemplo "My Project", Se usa para crear una carpeta con este nombre
    * @param files :File[] Lista de archivos a guardar.
    * @return files :File[] retorna la lista de archivos con la cual se trabajó.
    */
    if( isset($_POST['project_title']) && isset($_FILES['files']) ){
        $project_title = $_POST['project_title'];
        $files = $_FILES['files'];
        foreach($files['tmp_name'] as $index => $tmp_name){
            $name = $files["name"][$index];
            if($name){
                $folder = "../uploadFiles/".$project_title;
                //si la carpetano existe, la crea
                if(!is_dir($folder)){
                    mkdir($folder);
                }
                $filepath = $folder."/".$name;
                move_uploaded_file($tmp_name, $filepath);
            }
        }
        echo json_encode($files);
    }
    /**
     * Elimina un archivo dado de la carpeta "uploadFiles".
     * @param filename_delete :String nombre del archivo que se eliminará.
     * @return response :Boolean resultado de la función unlink()
     */
    if(isset($_POST['filename_delete'])){
        $filename_delete = $_POST['filename_delete'];
        $filename_path = "../uploadFiles/".$filename_delete;
        if(is_dir($filename_path)){
            $files = glob($filename_path."/*"); //obtenemos todos los nombres de los ficheros
            foreach($files as $file){
                if(is_file($file)){
                    unlink($file); //elimino el fichero
                }
            }
            $response = rmdir($filename_path);
        }else{
            $response = unlink($filename_path);
        }
        echo json_encode($response);
    }
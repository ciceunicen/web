<?php
    if(isset($_FILES['files'])){
        $files = $_FILES['files'];
        foreach($files['tmp_name'] as $index => $tmp_name){
            $name = $files["name"][$index];
            if($name){
                $filepath = "../uploadFiles/".$name;
                move_uploaded_file($tmp_name, $filepath);
            }
        }
        echo json_encode($files);
    }


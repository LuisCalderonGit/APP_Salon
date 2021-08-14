<?php

function obtenerServicios(): array
{
    try {
        //importar conexion
        require 'includes/database.php';
        $db->set_charset('utf8');
        //Escribir el codigo sql
        $consultaSql = "SELECT * FROM servicios;";

        $consulta = mysqli_query($db, $consultaSql); //mysqli_query - consulta la base de datos
        // echo "<pre>";
        // var_dump(mysqli_fetch_assoc($consulta)); // convierte los resultados que vienen de la consulta en un arregl asociativo
        // echo "</pre>";
        //obtener los resultados

        //arreglo vacio
        $servicios = [];
        $i = 0;
        while ($row = mysqli_fetch_assoc($consulta)) {
            // $servicios[] = "Hola";  //corchete al final sirve para agregar elementos al final del arreglo
            $servicios[$i]['id'] = $row['id'];
            $servicios[$i]['nombre'] = $row['nombre'];
            $servicios[$i]['precio'] = $row['precio'];
            $i++;
        }
        return $servicios;
    } catch (\Throwable $th) {
        //throw $th;

        var_dump($th);
    }
};

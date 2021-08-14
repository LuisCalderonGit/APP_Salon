<?php

$db = mysqli_connect('localhost', 'root', 'root', 'appsalon'); // conexion con la base de datos

if (!$db) {
    echo "Error en la conexion";
}

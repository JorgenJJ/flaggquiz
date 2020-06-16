<?php

    $mysqli = new mysqli("sql31.mcb.webhuset.no", "96496_flaggquiz", "brobunu85", "96496_flaggquiz");
    if ($mysqli->connect_error) {
        exit("Could not connect to database");
    }

    $sql = "SELECT * FROM `FORSOK` WHERE id=1";

    $res = $mysqli->query($sql);

    echo json_encode($res);

    $mysqli->close();

?>
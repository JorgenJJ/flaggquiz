<?php

    $mysqli = new mysqli("sql31.mcb.webhuset.no", "96496_flaggquiz", "brobunu85", "96496_flaggquiz");
    if ($mysqli->connect_error) {
        exit("Could not connect to database");
    }

    $sql = "SELECT * FROM `FORSOK` WHERE id=1";

    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("s", $_GET['q']);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($cid, $ccorrect, $cwrong, $ctime, $cdifficulty);
    $stmt->fetch();
    $stmt->close();

    echo json_encode($ccorrect);

?>
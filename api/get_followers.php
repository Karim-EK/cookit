<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php";
require_once "./config/api_helpers.php";

verify_request_method("GET");
verify_required_params($_GET, ["id"]);
verify_user_logged_in();

$target_user_id = $_GET["id"];

if (!$target_user_id) {
    send_json_response(false, "ID utente non valido.", null, 400);
}

try {
    $sql_followers = "
        SELECT 
            u.Id AS id_utente, 
            u.Username AS nickname, 
            u.Immagine_Profilo AS immagine_profilo
        FROM FOLLOWERS f
        JOIN UTENTI u ON f.Follower_Id = u.Id
        WHERE f.Followed_Id = :target_id
        ORDER BY u.Username ASC;
    ";
    
    $stmt_followers = $pdo->prepare($sql_followers);
    $stmt_followers->execute(["target_id" => $target_user_id]);
    $lista_followers = $stmt_followers->fetchAll(PDO::FETCH_ASSOC);

    $sql_seguiti = "
        SELECT 
            u.Id AS id_utente, 
            u.Username AS nickname, 
            u.Immagine_Profilo AS immagine_profilo
        FROM FOLLOWERS f
        JOIN UTENTI u ON f.Followed_Id = u.Id
        WHERE f.Follower_Id = :target_id
        ORDER BY u.Username ASC;
    ";
    
    $stmt_seguiti = $pdo->prepare($sql_seguiti);
    $stmt_seguiti->execute(["target_id" => $target_user_id]);
    $lista_seguiti = $stmt_seguiti->fetchAll(PDO::FETCH_ASSOC);


    $payload = [
        "followers" => $lista_followers,
        "seguiti"   => $lista_seguiti
    ];

    send_json_response(true, "Dati recuperati con successo", $payload);

} catch (PDOException $e) {
    send_json_response(false, "Errore del server durante il recupero dei dati: " . $e->getMessage(), null, 500);
}
?>
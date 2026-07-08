<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php";
require_once "./config/api_helpers.php";

verify_request_method("POST");
verify_user_logged_in();

$current_user_id = $_SESSION['user_id'];

try {
    $sql = "
        UPDATE NOTIFICHE 
        SET Letta = TRUE 
        WHERE Utente_Destinatario_Id = :current_user_id 
          AND Letta = FALSE;
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(["current_user_id" => $current_user_id]);
    
    $righe_aggiornate = $stmt->rowCount();

    send_json_response(true, "Notifiche segnate come lette.", [
        "notifiche_aggiornate" => $righe_aggiornate
    ]);

} catch (PDOException $e) {
    send_json_response(false, "Errore del server durante l'aggiornamento delle notifiche: " . $e->getMessage(), null, 500);
}
?>
<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php";
require_once "./config/api_helpers.php";

verify_request_method("GET");
verify_user_logged_in();

$current_user_id = $_SESSION['user_id'];

try {
    $sql = "
        SELECT 
            n.Id AS notifica_id,
            n.Tipo AS tipo,
            n.Letta AS is_letta,
            n.Data_Notifica AS data,
            u.Id AS attore_id,
            u.Username AS attore_nickname,
            u.Immagine_Profilo AS attore_immagine,
            r.Id AS ricetta_id,
            r.Nome AS ricetta_titolo
        FROM NOTIFICHE n
        JOIN UTENTI u ON n.Utente_Attore_Id = u.Id
        LEFT JOIN RICETTE r ON n.Ricetta_Id = r.Id
        WHERE n.Utente_Destinatario_Id = :current_user_id 
          AND n.Letta = FALSE
        ORDER BY n.Data_Notifica DESC;
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(["current_user_id" => $current_user_id]);
    
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    send_json_response(true, "Notifiche non lette recuperate con successo.", $notifications);

} catch (PDOException $e) {
    send_json_response(false, "Errore del server durante il recupero delle notifiche: " . $e->getMessage(), null, 500);
}
?>
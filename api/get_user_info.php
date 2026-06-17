<?php
header("Content-Type: application/json; charset=utf-8");
require_once "./config/db_connect.php";
require_once "./config/api_helpers.php";
session_start();

verify_request_method("GET");
verify_user_logged_in();

$target_id = $_GET['id'] ?? $_SESSION['user_id'] ?? null;

if (!$target_id) {
    http_response_code(401);
    echo json_encode(["errore" => true, "messaggio" => "Utente non loggato o ID non fornito."]);
    exit;
}

try {
    $sql = "
    SELECT 
        u.Nome,
        u.Cognome,
        u.Immagine_Profilo AS Immagine_Profilo,
        COUNT(DISTINCT f.Follower_Id) AS Numero_Follower,
        COUNT(DISTINCT r.Id) AS Numero_Ricette
    FROM 
        UTENTI u
    LEFT JOIN 
        FOLLOWERS f ON u.Id = f.Followed_Id
    LEFT JOIN 
        RICETTE r ON u.Id = r.Utente_Id
    WHERE 
        u.Id = :id_richiesto
    GROUP BY 
        u.Id, u.Nome, u.Cognome, u.Immagine_Profilo;
    ";

    $stmt = $pdo -> prepare($sql);

    $stmt->execute(['id_richiesto' => $target_id]);

    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$data) {
        send_json_response(false, "Utente non trovato.", null, 404);
    }

    //TODO: MANDA RISPOSTA

} catch(PDOException $e) {
    send_json_response(false, "Errore durante recupero dati: ", null, 500);
}
?>
<?php
header("Content-Type: application/json; charset=utf-8");
require_once "./config/db_connect.php";

session_start();

$target_id = $_GET['id'] ?? $_SESSION['user_id'] ?? null;

if (!$target_id) {
    http_response_code(401); // 401 Unauthorized
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
        http_response_code(404); // 404 Not Found
        echo json_encode(["errore" => true, "messaggio" => "Utente non trovato."]);
        exit;
    }

    echo json_encode($data);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "errore" => true, 
        "messaggio" => "Errore durante recupero dati: " . $e -> getMessage()
    ]);
}
?>
<?php

header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php";
require_once "./config/api_helpers.php";

verify_request_method("GET");
verify_user_logged_in();

$current_user_id = $_SESSION['user_id'];

// if userbase grows noticibly, this query'll be too expensive, instead a "most famus" table should be created and updated daily
$FOLLOWED_TIME = 7;
$FAMUS_TIME = 1;
try {
   $sql = "
        (
            -- Ricette dei profili seguiti, negli ultimi 7 giorni
            SELECT 
                r.Id AS post_id, r.Nome AS titolo, r.Difficolta, r.Tempo_Preparazione, 
                r.Immagine, r.Preparazione, r.Data_Pubblicazione, u.Id AS user_id, Immagine_Profilo, u.Username AS autore
            FROM RICETTE r
            JOIN UTENTI u ON r.Utente_Id = u.Id
            JOIN FOLLOWERS f ON r.Utente_Id = f.Followed_Id
            WHERE f.Follower_Id = :user_id_1
              AND r.Data_Pubblicazione >= NOW() - INTERVAL $FOLLOWED_TIME DAY
        )
        UNION
        (
            -- Ricette pubblicate nelle ultime 24 ore da CHIUNQUE, 
            -- ma dando la precedenza a chi ha più follower (se esistono)
            SELECT 
                r.Id AS post_id, r.Nome AS titolo, r.Difficolta, r.Tempo_Preparazione, 
                r.Immagine, r.Preparazione, r.Data_Pubblicazione, u.Id AS user_id, u.Immagine_Profilo, u.Username AS autore
            FROM RICETTE r
            JOIN UTENTI u ON r.Utente_Id = u.Id
            WHERE r.Data_Pubblicazione >= NOW() - INTERVAL $FAMUS_TIME DAY
            
            -- Ordiniamo i post delle ultime 24 ore in base al conteggio dei follower del rispettivo autore
            ORDER BY (
                SELECT COUNT(*) 
                FROM FOLLOWERS 
                WHERE Followed_Id = r.Utente_Id
            ) DESC
            LIMIT 100
        )
        ORDER BY Data_Pubblicazione DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['user_id_1' => $current_user_id]);
    $feed_posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "user_id" => $current_user_id,
        "count" => count($feed_posts),
        "feed" => $feed_posts
    ]);
} catch (PDOException $e) {
    send_json_response(false, "Errore server: " . $e->getMessage(), null, 500);
}
?>
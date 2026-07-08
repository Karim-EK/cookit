<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php"; 
require_once "./config/api_helpers.php";

verify_request_method("GET");
verify_required_params($_GET, ["id"]);

$recipe_id = $_GET["id"];

try {
    $sql = "
        SELECT 
            c.Id AS id_commento,
            c.Testo AS testo,
            c.Data_Commento AS data,
            u.Id AS utente_id,
            u.Username AS username,
            u.Immagine_Profilo AS img_profilo
        FROM COMMENTI AS c
        JOIN UTENTI AS u ON c.Utente_Id = u.Id
        WHERE c.Ricetta_Id = :recipeId
        ORDER BY c.Data_Commento DESC;
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute(["recipeId" => $recipe_id]);
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    send_json_response(true, "Commenti recuperati con successo", $comments);

} catch (PDOException $e) {
    send_json_response(false, "Errore del server: " . $e->getMessage(), null, 500);
}
?>
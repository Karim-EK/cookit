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
            r.Id AS id_ricetta, 
            r.Utente_Id, 
            r.Nome, 
            r.Difficolta, 
            r.Tempo_Preparazione, 
            r.Immagine AS immagine_ricetta,
            r.Ingredienti, 
            r.Preparazione, 
            r.Data_Pubblicazione,
            u.Id AS id_utente, 
            u.Username, 
            u.Immagine_Profilo AS immagine_profilo,
            
            (EXISTS(
                SELECT 1 
                FROM LIKES 
                WHERE Utente_Id = :currentUserId1 AND Ricetta_Id = r.Id
            )) AS has_liked,
            
            (SELECT COUNT(*) 
             FROM LIKES 
             WHERE Ricetta_Id = r.Id) AS total_likes,
            
            (r.Utente_Id = :currentUserId2) AS is_author

        FROM RICETTE AS r 
        JOIN UTENTI AS u ON r.Utente_Id = u.Id
        WHERE r.Id = :recipeId;
    ";
    $stmt = $pdo -> prepare($sql);
    $stmt -> execute([
        "recipeId" => $recipe_id,
        "currentUserId1" => $_SESSION["user_id"] ?? null,
        "currentUserId2" => $_SESSION["user_id"] ?? null
        ]);
    $data = $stmt-> fetch(PDO::FETCH_ASSOC);
    if(!$data) {
        send_json_response(false, "Nessun post trovato", $data);
    } else {
        // conversion to php boolean
        $data['is_author'] = (bool)$data['is_author'];
        $data['has_liked'] = (bool)$data['has_liked'];
        send_json_response(true, "Post trovato con successo", $data);
    }
} catch (PDOException $e) {
    send_json_response(false, "Errore del server: " . $e->getMessage(), null, 500);
}
       
?>
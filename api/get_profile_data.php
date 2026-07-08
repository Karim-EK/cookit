<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php";
require_once "./config/api_helpers.php";
verify_request_method("GET");
verify_required_params($_GET, ["id"]);
verify_user_logged_in(); 

$target_user_id = $_GET["id"];
$current_user_id = $_SESSION['user_id'];

if (!$target_user_id) {
    send_json_response(false, "ID utente non valido.", null, 400);
}

try {
    $sql_profile = "
        SELECT 
            u.Id AS id_utente,
            u.Username AS nickname,
            u.Immagine_Profilo AS immagine_profilo,
            
            (SELECT COUNT(*) FROM RICETTE WHERE Utente_Id = u.Id) AS numero_ricette,
            
            (SELECT COUNT(*) FROM FOLLOWERS WHERE Followed_Id = u.Id) AS numero_follower,
            
            (SELECT COUNT(*) FROM FOLLOWERS WHERE Follower_Id = u.Id) AS numero_seguiti,
            
            (EXISTS(
                SELECT 1 
                FROM FOLLOWERS 
                WHERE Follower_Id = :current_user_id1 AND Followed_Id = u.Id
            )) AS is_following,

            (u.Id = :current_user_id2) AS is_owner
            
        FROM UTENTI u
        WHERE u.Id = :target_user_id;
    ";

    $stmt_profile = $pdo->prepare($sql_profile);
    $stmt_profile->execute([
        "target_user_id"  => $target_user_id,
        "current_user_id1" => $current_user_id,
        "current_user_id2" => $current_user_id
    ]);

    $user_data = $stmt_profile->fetch(PDO::FETCH_ASSOC);
    if (!$user_data) {
        send_json_response(false, "Utente non trovato.", null, 404);
    }
    $user_data['is_following'] = (bool)$user_data['is_following'];
    $user_data['is_owner'] = (bool)$user_data['is_owner'];

    $sql_recipes = "
        SELECT 
            Id AS id_ricetta, 
            Nome AS titolo_ricetta, 
            Immagine AS immagine_ricetta
        FROM RICETTE
        WHERE Utente_Id = :target_user_id
        ORDER BY Data_Pubblicazione DESC;
    ";

    $stmt_recipes = $pdo->prepare($sql_recipes);
    $stmt_recipes->execute(["target_user_id" => $target_user_id]);
    
    $recipes_list = $stmt_recipes->fetchAll(PDO::FETCH_ASSOC);

    // final assembly
    $payload = [
        "profilo" => $user_data,
        "ricette" => $recipes_list
    ];

    send_json_response(true, "Profilo caricato con successo", $payload);

} catch (PDOException $e) {
    send_json_response(false, "Errore del server: " . $e->getMessage(), null, 500);
}
?>
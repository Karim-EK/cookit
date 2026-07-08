<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php"; 
require_once "./config/api_helpers.php";
verify_request_method("POST");
verify_user_logged_in();
verify_required_params($_POST, ["recipe_id"]);

$recipe_id = $_POST["recipe_id"];
$current_user_id = $_SESSION['user_id'];

if (!$recipe_id) {
    send_json_response(false, "ID ricetta non valido.", null, 400);
}

try {
    // check ownership
    $auth_sql = "SELECT Utente_Id FROM RICETTE WHERE Id = :recipe_id";
    $auth_stmt = $pdo->prepare($auth_sql);
    $auth_stmt->execute(["recipe_id" => $recipe_id]);
    $recipe_owner = $auth_stmt->fetchColumn();
    if ($recipe_owner === false) {
        send_json_response(false, "La ricetta che stai cercando di eliminare non esiste.", null, 404);
    }
    if ($recipe_owner != $current_user_id) {
        send_json_response(false, "Accesso negato: non hai i permessi per eliminare una ricetta che non hai creato tu.", null, 403);
    }

    $delete_sql = "DELETE FROM RICETTE WHERE Id = :recipe_id";
    $delete_stmt = $pdo->prepare($delete_sql);
    $delete_stmt->execute(["recipe_id" => $recipe_id]);

    // final check
    if ($delete_stmt->rowCount() > 0) {
        send_json_response(true, "Ricetta eliminata con successo.");
    } else {
        send_json_response(false, "Impossibile eliminare la ricetta. Potrebbe essere già stata rimossa.", null, 500);
    }

} catch (PDOException $e) {
    send_json_response(false, "Errore critico del database: " . $e->getMessage(), null, 500);
}
?>
<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php";
require_once "./config/api_helpers.php";

verify_request_method("POST");
verify_user_logged_in();

$user_id = $_SESSION['user_id'];

try {
    $pdo->beginTransaction();

    $sql = "DELETE FROM UTENTI WHERE Id = :user_id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(["user_id" => $user_id]);

    $pdo->commit();

    $_SESSION = array();
    
    session_destroy();

    send_json_response(true, "Account e tutti i dati associati sono stati eliminati definitivamente.");

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    send_json_response(false, "Errore irreversibile durante l'eliminazione: " . $e->getMessage(), null, 500);
}
?>
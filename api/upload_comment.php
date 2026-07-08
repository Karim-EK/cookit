<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php"; 
require_once "./config/api_helpers.php";

verify_request_method("POST");
verify_user_logged_in();
verify_required_params($_POST, ["recipe_id", "user-comment"]);

$recipe_id = $_POST["recipe_id"];
$txt = trim($_POST["user-comment"]);
$user_id = $_SESSION['user_id'];

if (!$recipe_id || empty($txt)) {
    send_json_response(false, "Dati non validi o commento vuoto.", null, 400);
}

try {
    $pdo->beginTransaction();
    $sql_comment = "INSERT INTO COMMENTI (Ricetta_Id, Utente_Id, Testo) VALUES (:recipe_id, :user_id, :txt)";
    $stmt_comment = $pdo->prepare($sql_comment);
    $stmt_comment->execute([
        "recipe_id" => $recipe_id,
        "user_id"   => $user_id,
        "txt"     => $txt
    ]);

    // find author for notifications
    $sql_author = "SELECT Utente_Id FROM RICETTE WHERE Id = :recipe_id";
    $stmt_author = $pdo->prepare($sql_author);
    $stmt_author->execute(["recipe_id" => $recipe_id]);
    $recipe_author = $stmt_author->fetchColumn();

    // avoid self-comment
    if ($recipe_author && $recipe_author != $user_id) {
        $sql_self = "INSERT INTO NOTIFICHE (Utente_Destinatario_Id, Utente_Attore_Id, Tipo, Ricetta_Id) 
                         VALUES (:destinatario, :attore, 'commento', :recipe_id)";
        $stmt_notify = $pdo->prepare($sql_self);
        $stmt_notify->execute([
            "destinatario" => $recipe_author,
            "attore"       => $user_id,
            "recipe_id"    => $recipe_id
        ]);
    }

    $pdo->commit();

    send_json_response(true, "Commento pubblicato con successo.");

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    send_json_response(false, "Errore del database: " . $e->getMessage(), null, 500);
}
?>
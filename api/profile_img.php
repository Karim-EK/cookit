<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php";
require_once "./config/api_helpers.php";

verify_request_method("POST");
verify_user_logged_in();
verify_required_params($_POST, ["cropped_image_data"]);

$user_id = $_SESSION['user_id'];
$base64_image = $_POST["cropped_image_data"];

// check the format
if (!preg_match('/^data:image\/(jpeg|png|webp);base64,/', $base64_image)) {
    send_json_response(false, "Formato immagine non valido o file corrotto.", null, 400);
}

try {
    $sql = "UPDATE UTENTI SET Immagine_Profilo = :immagine WHERE Id = :user_id";
    $stmt = $pdo->prepare($sql);
    
    $stmt->execute([
        "immagine" => $base64_image,
        "user_id"  => $user_id
    ]);

    send_json_response(true, "Immagine profilo aggiornata con successo!", [
        "nuova_immagine" => $base64_image,
        "id" => $user_id
    ]);

} catch (PDOException $e) {
    send_json_response(false, "Errore del database: " . $e->getMessage(), null, 500);
}
?>
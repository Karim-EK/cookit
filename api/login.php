<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php";
require_once "./config/api_helpers.php";

verify_request_method("POST");
$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";

if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "messagge" => "Compila tutti i campi."]);
    exit;
}

try {
    $sql = "SELECT Id, Username, Email, Password FROM UTENTI WHERE Email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(["email" => $email]);

    $utente = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$utente) {
        send_json_response(false, "Credenziali non valide.", null, 404);
    }
    if (password_verify($password, $utente["Password"])) {
        $_SESSION["user_id"] = $utente["Id"];
        $_SESSION["username"] = $utente["Username"];
        send_json_response(true, "Login effettuato!", null);
    } else {
        send_json_response(false, "Credenziali non valide.", null, 404);
    }
} catch(PDOException $e) {
    send_json_response(false, "Errore del server: " . $e->getMessage(), false, 500);
}
?>
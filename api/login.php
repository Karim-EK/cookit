<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php";
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "messaggio" => "Metodo non consentito."]);
    exit;
}
$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";

if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "messaggio" => "Compila tutti i campi."]);
    exit;
}

try {
    $sql = "SELECT Id, Username, Email, Password FROM UTENTI WHERE Email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(["email" => $email]);

    $utente = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$utente) {
        echo json_encode(["success" => false, "messaggio" => "Credenziali non valide."]);
        exit;
    }
    if (password_verify($password, $utente["Password"])) {
        $_SESSION["user_id"] = $utente["Id"];
        $_SESSION["username"] = $utente["Username"];
        echo json_encode(["success" => true, "messaggio" => "Login effettuato!"]);
    } else {
        echo json_encode(["success" => false, "messaggio" => "Credenziali non valide."]);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "messaggio" => "Errore del server: " . $e->getMessage()]);
}
?>
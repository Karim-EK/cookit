<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php";
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "messaggio" => "Metodo non consentito."]);
    exit;
}

$name = trim($_POST["name"] ?? "");
$surname = trim($_POST["surname"] ?? "");
$birth_date = trim($_POST["birth-date"] ?? "");
$username = trim($_POST["username"] ?? "");
$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";

$array_data = [$name, $surname, $birth_date, $username, $email, $password];

foreach ($array_data as $input) {
    if(empty($input)) {
        echo json_encode(["success" => false, "message" => "Compila tutti i campi"]);
        exit;
    }
}
try {
   $check_sql = "SELECT Username, Email FROM UTENTI WHERE Username = :username OR Email = :email";
    $stmt = $pdo->prepare($check_sql);
    $stmt->execute([
        "username" => $username,
        "email" => $email
    ]);    
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($existing) {
        if ($existing['Username'] === $username) {
            echo json_encode(["success" => false, "messaggio" => "Username già in uso."]);
            exit;
        }
        if ($existing['Email'] === $email) {
            echo json_encode(["success" => false, "messaggio" => "Questa email è già registrata."]);
            exit;
        }
    }

    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    $insert_sql = "INSERT INTO UTENTI (Nome, Cognome, Data_Nascita, Username, Email, Password) 
                   VALUES (:nome, :cognome, :data_nascita, :username, :email, :password)";
    $insert_stmt = $pdo->prepare($insert_sql);
    $insert_stmt->execute([
        "nome" => $name,
        "cognome" => $surname,
        "data_nascita" => $birth_date,
        "username" => $username,
        "email" => $email,
        "password" => $hashed_password
    ]);
    echo json_encode(["success" => true, "messaggio" => "Registrazione completata con successo!"]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "messaggio" => "Errore del server: " . $e->getMessage()]);
}
?>
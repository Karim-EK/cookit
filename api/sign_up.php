<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php";
require_once "./config/api_helpers.php";

verify_request_method("POST");

$name = trim($_POST["name"] ?? "");
$surname = trim($_POST["surname"] ?? "");
$birth_date = trim($_POST["birth-date"] ?? "");
$username = trim($_POST["username"] ?? "");
$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";

$array_data = [$name, $surname, $birth_date, $username, $email, $password];

foreach ($array_data as $input) {
    if(empty($input)) {
        send_json_response(false, "Compila tutti i campi", null, 422);
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
            send_json_response(false, "Username già in uso.", null, 422);
        }
        if ($existing['Email'] === $email) {
            send_json_response(false, "Questa email è già registrata.", null, 422);
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
    send_json_response(true, "Registrazione completata con successo!", null);
} catch(PDOException $e) {
    send_json_response(false, "Errore del server: " . $e->getMessage(), null, 500);
}
?>
<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php";
require_once "./config/api_helpers.php";

verify_user_logged_in();
verify_request_method("POST");

$utente_id = $_SESSION['user_id'];
$nome = trim($_POST['recipe-name'] ?? '');
$difficolta = $_POST['difficulty'] ?? '';
$tempo = filter_var($_POST['prep-time'] ?? '', FILTER_VALIDATE_INT);
$preparazione = trim($_POST['recipe-description'] ?? '');
$ingredienti_raw = $_POST['ingredients'] ?? [];
$immagine_b64 = $_POST['cropped_image_data'] ?? '';

if (empty($nome) || empty($difficolta) || !$tempo || empty($preparazione)) {
    send_json_response(false, "Compila tutti i campi di testo correttamente.", null, 422);
    }
    if (empty($ingredienti_raw) || !is_array($ingredienti_raw)) {
    send_json_response(false, "Devi inserire almeno un ingrediente.", null, 422);
}

// removes missing indexs
$ingredienti_json = json_encode(array_values($ingredienti_raw));

try {
    $sql = "INSERT INTO RICETTE (Utente_Id, Nome, Difficolta, Tempo_Preparazione, Immagine, Ingredienti, Preparazione) 
            VALUES (:utente_id, :nome, :difficolta, :tempo, :immagine, :ingredienti, :preparazione)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'utente_id'    => $utente_id,
        'nome'         => $nome,
        'difficolta'   => $difficolta,
        'tempo'        => $tempo,
        'immagine'     => $immagine_b64,    
        'ingredienti'  => $ingredienti_json, 
        'preparazione' => $preparazione
    ]);
    echo json_encode([
        "success" => true, 
        "messaggio" => "Ricetta pubblicata con successo!",
        "ricetta_id" => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    send_json_response(false, "Errore del server: " . $e->getMessage(), null, 500);
}
?>
<?php
/**
 * Provides "Preparations" and "Ingredients" datas from Recipes
 */
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php";
require_once "./config/api_helpers.php";

verify_request_method("GET");
verify_user_logged_in();
verify_required_params($_GET, ["id", "q"]);

/**
 * 'i' for Ingredients and 'p' for Preparation
 */
$id_recipe = $_GET["id"] ?? null;
$query_type = $_GET["q"] ?? null;

if ($query_type == "i") {
    $column = "Ingredienti";
} elseif ($query_type == "p") {
    $column = "Preparazione";
} else {
   send_json_response(false, "Valore del parametro 'q' non valido.", null, 400);
}

try {
    $sql = "SELECT $column FROM RICETTE WHERE Id = :id";
    $stmt = $pdo -> prepare($sql);
    $stmt->execute(["id" => $id_recipe]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$data) {
        // 404 Not Found
        send_json_response(false, "Ricetta non trovata.", null, 404);
    }
    $final_data = ($query_type === 'i') ? json_decode($data['Ingredienti'], true) : $data['Preparazione'];
    send_json_response(true, "Dati recuperati con successo", $final_data);
} catch(PDOException $e) {
    send_json_response(false, "Errore database: " . $e->getMessage(), null, 500);
}
?>
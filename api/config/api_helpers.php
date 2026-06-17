<?php
// api_helpers.php

/**
 * Invia una risposta JSON standardizzata e interrompe lo script.
 */
function send_json_response(bool $success, string $message, $data = null, int $http_code = 200) {
    http_response_code($http_code);
    echo json_encode([
        "success" => $success,
        "message" => $message,
        "data"    => $data
    ]);
    exit; // Ferma l'esecuzione qui, evitando altri controlli
}

/**
 * GUARDIA DI METODO: Blocca la richiesta se non corrisponde al metodo HTTP atteso.
 */
function verify_request_method(string $expected_method) {
    if ($_SERVER['REQUEST_METHOD'] !== strtoupper($expected_method)) {
        send_json_response(false, "Metodo non consentito. Atteso: $expected_method", null, 405);
    }
}

/**
 * GUARDIA DI AUTENTICAZIONE: Blocca la richiesta se l'utente non è loggato.
 */
function verify_user_logged_in() {
    if (!isset($_SESSION['user_id'])) {
        send_json_response(false, "Accesso negato. Effettua il login.", null, 401);
    }
}

/**
 * GUARDIA DI INPUT: Verifica che i parametri obbligatori esistano nell'array target ($_GET o $_POST)
 */
function verify_required_params(array $array_target, array $required_params) {
    foreach ($required_params as $param) {
        if (!isset($array_target[$param]) || trim($array_target[$param]) === '') {
            send_json_response(false, "Parametro obbligatorio mancante o vuoto: $param", null, 400);
        }
    }
}
?>
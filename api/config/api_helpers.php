<?php

/**
 * Send stardazed Json response and exit the script
 */
function send_json_response(bool $success, string $message, $data = null, int $http_code = 200) {
    http_response_code($http_code);
    echo json_encode([
        "success" => $success,
        "message" => $message,
        "data"    => $data
    ]);
    exit;
}

/**
 * Guard for HTTP method
 */
function verify_request_method(string $expected_method) {
    if ($_SERVER['REQUEST_METHOD'] !== strtoupper($expected_method)) {
        send_json_response(false, "Metodo non consentito. Atteso: $expected_method", null, 405);
    }
}

/**
 * Auth Guard
 */
function verify_user_logged_in() {
    if (!isset($_SESSION['user_id'])) {
        send_json_response(false, "Accesso negato. Effettua il login.", null, 401);
    }
}

/**
 * Guard for params
 */
function verify_required_params(array $array_target, array $required_params) {
    foreach ($required_params as $param) {
        if (!isset($array_target[$param]) || trim($array_target[$param]) === '') {
            send_json_response(false, "Parametro obbligatorio mancante o vuoto: $param", null, 400);
        }
    }
}
?>
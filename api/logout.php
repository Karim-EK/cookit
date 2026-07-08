<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/api_helpers.php";

verify_request_method("POST");

$_SESSION = array();

session_destroy();

send_json_response(true, "Logout effettuato con successo.");
?>
<?php
// Configurazione di default di XAMPP
$host = '127.0.0.1';
$db   = 'cookit';
$user = 'root';      
$pass = '';          
$charset = 'utf8mb4'; 

// Data Source Name (Indirizzo completo per PDO)
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

// Impostazioni di sicurezza e comodità
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Mostra gli errori SQL se qualcosa va storto
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Restituisce i dati come array puliti, perfetti per il JSON
    PDO::ATTR_EMULATE_PREPARES   => false,                  // Massima sicurezza contro le SQL Injections
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo json_encode(['error' => 'Connessione al DB fallita: ' . $e->getMessage()]);
    exit;
}
?>
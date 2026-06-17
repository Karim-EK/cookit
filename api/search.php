<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php";
require_once "./config/api_helpers.php";

verify_request_method("GET");
verify_required_params($_GET, ["q"]);
verify_user_logged_in();
$query = strtolower($_GET['q'] ?? '');

$sql = "
    (
        -- PARTE 1: Ricerca degli Utenti
        SELECT 
            u.Id AS id,
            'utente' AS tipo,                      -- Discriminator per il frontend JS
            u.Username AS nome_titolo,
            u.Immagine_Profilo AS immagine_profilo,
            NULL AS immagine_ricetta,              -- Campo vuoto (simmetrico)
            COUNT(r_sub.Id) AS numero_ricette,     -- Calcolo dinamico delle ricette pubblicate
            NULL AS difficolta                     -- Campo vuoto (simmetrico)
        FROM UTENTI u
        LEFT JOIN RICETTE r_sub ON u.Id = r_sub.Utente_Id
        WHERE LOWER(u.Username) LIKE :query1
        GROUP BY u.Id, u.Username, u.Immagine_Profilo
    )
    UNION ALL
    (
        -- PARTE 2: Ricerca delle Ricette
        SELECT 
            r.Id AS id,
            'ricetta' AS tipo,                     -- Discriminator per il frontend JS
            r.Nome AS nome_titolo,
            NULL AS immagine_profilo,              -- Campo vuoto (simmetrico)
            r.Immagine AS immagine_ricetta,
            NULL AS numero_ricette,                -- Campo vuoto (simmetrico)
            r.Difficolta AS difficolta
        FROM RICETTE r
        WHERE LOWER(r.Nome) LIKE :query2
    )
    -- Ordinamento alfabetico globale dei risultati combinati
    ORDER BY nome_titolo ASC;
    ";
//Wildcards for LIKE operator
$search_string = "%" . $query . "%";
$stmt = $pdo->prepare($sql);
$stmt->execute(["query1" => $search_string,
                "query2" => $search_string
                ]);
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

send_json_response(true, "Ricerca completata", $data);
?>
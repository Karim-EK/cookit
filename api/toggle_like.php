<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php";
require_once "./config/api_helpers.php";

verify_request_method("POST");
verify_user_logged_in();
verify_required_params($_POST, ["recipe_id"]);

$recipe_id = $_POST["recipe_id"];
$user_id = $_SESSION['user_id'];

try {
    $sql_autore = "SELECT Utente_Id FROM RICETTE WHERE Id = :recipe_id";
    $stmt_autore = $pdo->prepare($sql_autore);
    $stmt_autore->execute(["recipe_id" => $recipe_id]);
    $autore_id = $stmt_autore->fetchColumn();

    if (!$autore_id) {
        send_json_response(false, "Ricetta non trovata.", null, 404);
    }

    $check_sql = "SELECT 1 FROM LIKES WHERE Utente_Id = :user_id AND Ricetta_Id = :recipe_id";
    $check_stmt = $pdo->prepare($check_sql);
    $check_stmt->execute([
        "user_id"   => $user_id,
        "recipe_id" => $recipe_id
    ]);
    
    $like_exists = $check_stmt->fetch();
    $has_liked = false;

    $pdo->beginTransaction();

    if ($like_exists) {
        $delete_sql = "DELETE FROM LIKES WHERE Utente_Id = :user_id AND Ricetta_Id = :recipe_id";
        $delete_stmt = $pdo->prepare($delete_sql);
        $delete_stmt->execute([
            "user_id"   => $user_id,
            "recipe_id" => $recipe_id
        ]);
        $has_liked = false;

        // pendent
        if ($autore_id != $user_id) {
            $delete_notifica = "DELETE FROM NOTIFICHE 
                                WHERE Utente_Destinatario_Id = :destinatario 
                                AND Utente_Attore_Id = :attore 
                                AND Tipo = 'like' 
                                AND Ricetta_Id = :recipe_id";
            $stmt_del_notifica = $pdo->prepare($delete_notifica);
            $stmt_del_notifica->execute([
                "destinatario" => $autore_id,
                "attore"       => $user_id,
                "recipe_id"    => $recipe_id
            ]);
        }
    } else {
        $insert_sql = "INSERT INTO LIKES (Utente_Id, Ricetta_Id) VALUES (:user_id, :recipe_id)";
        $insert_stmt = $pdo->prepare($insert_sql);
        $insert_stmt->execute([
            "user_id"   => $user_id,
            "recipe_id" => $recipe_id
        ]);
        $has_liked = true;

        if ($autore_id != $user_id) {
            $insert_notifica = "INSERT INTO NOTIFICHE (Utente_Destinatario_Id, Utente_Attore_Id, Tipo, Ricetta_Id) 
                                VALUES (:destinatario, :attore, 'like', :recipe_id)";
            $stmt_ins_notifica = $pdo->prepare($insert_notifica);
            $stmt_ins_notifica->execute([
                "destinatario" => $autore_id,
                "attore"       => $user_id,
                "recipe_id"    => $recipe_id
            ]);
        }
    }
    
    $count_sql = "SELECT COUNT(*) AS totale FROM LIKES WHERE Ricetta_Id = :recipe_id";
    $count_stmt = $pdo->prepare($count_sql);
    $count_stmt->execute(["recipe_id" => $recipe_id]);
    $total_likes = (int)$count_stmt->fetch(PDO::FETCH_ASSOC)['totale'];
    
    $pdo->commit();

    send_json_response(true, "Operazione completata", [
        "has_liked" => $has_liked, 
        "total_likes" => $total_likes
    ]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    send_json_response(false, "Errore durante la gestione del Like: " . $e->getMessage(), null, 500);
}
?>
<?php
header("Content-Type: application/json; charset=utf-8");
session_start();
require_once "./config/db_connect.php";
require_once "./config/api_helpers.php";

verify_request_method("POST");
verify_user_logged_in();
verify_required_params($_POST, ["followed_id"]);

$follower_id = $_SESSION['user_id'];
$followed_id = $_POST["followed_id"];

if (!$followed_id) {
    send_json_response(false, "ID utente non valido.", null, 400);
}

if ($follower_id === $followed_id) {
    send_json_response(false, "Non puoi seguire il tuo stesso profilo.", null, 400);
}

try {
    $pdo->beginTransaction();

    $check_sql = "SELECT 1 FROM FOLLOWERS WHERE Follower_Id = :follower_id AND Followed_Id = :followed_id";
    $check_stmt = $pdo->prepare($check_sql);
    $check_stmt->execute([
        "follower_id" => $follower_id,
        "followed_id" => $followed_id
    ]);
    
    $is_following = $check_stmt->fetch();

    // unfollow
    if ($is_following) {
        $delete_follow = "DELETE FROM FOLLOWERS WHERE Follower_Id = :follower_id AND Followed_Id = :followed_id";
        $delete_stmt = $pdo->prepare($delete_follow);
        $delete_stmt->execute([
            "follower_id" => $follower_id,
            "followed_id" => $followed_id
        ]);

        $delete_notif = "DELETE FROM NOTIFICHE 
                         WHERE Utente_Destinatario_Id = :followed_id 
                           AND Utente_Attore_Id = :follower_id 
                           AND Tipo = 'follow'";
        $notif_stmt = $pdo->prepare($delete_notif);
        $notif_stmt->execute([
            "follower_id" => $follower_id,
            "followed_id" => $followed_id
        ]);

        $status = false;
        $message = "Non segui più questo utente.";
    } else { //follow
        $insert_follow = "INSERT INTO FOLLOWERS (Follower_Id, Followed_Id) VALUES (:follower_id, :followed_id)";
        $insert_stmt = $pdo->prepare($insert_follow);
        $insert_stmt->execute([
            "follower_id" => $follower_id,
            "followed_id" => $followed_id
        ]);

        $insert_notif = "INSERT INTO NOTIFICHE (Utente_Destinatario_Id, Utente_Attore_Id, Tipo, Ricetta_Id) 
                         VALUES (:followed_id, :follower_id, 'follow', NULL)";
        $notif_stmt = $pdo->prepare($insert_notif);
        $notif_stmt->execute([
            "follower_id" => $follower_id,
            "followed_id" => $followed_id
        ]);

        $status = true;
        $message = "Ora segui questo utente.";
    }

    $count_sql = "SELECT COUNT(*) AS totale FROM FOLLOWERS WHERE Followed_Id = :followed_id";
    $count_stmt = $pdo->prepare($count_sql);
    $count_stmt->execute(["followed_id" => $followed_id]);
    $total_followers = (int)$count_stmt->fetch(PDO::FETCH_ASSOC)['totale'];

    $pdo->commit();

    send_json_response(true, $message, [
        "is_following" => $status,
        "follower_count" => $total_followers
    ]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    send_json_response(false, "Errore durante la gestione del follow: " . $e->getMessage(), null, 500);
}
?>
<?php

// MODIFICATION MOT DE PASSE UTILISATEUR
function changePwd($pdoP, $values){
    $stmt = $pdoP->prepare("UPDATE utilisateursgreta SET pwd=? WHERE id_util=?");
    $idUtil = htmlspecialchars($values['id_util']);
    $pwd = htmlspecialchars(($values['pwd']));
    $pwdHash = htmlspecialchars($pwd, PASSWORD_DEFAULT);
    $stmt->execute([$idUtil, $pwdHash]);
}

// GESTION DU MOT DE PASSE OUBLIE

//fonction qui renvoie l'id de l'utilisateur et son email
function getMail($pdoP, $emailP){
    $stmt = $pdoP->prepare("SELECT email from utilisateursgreta WHERE email = ?");
    $stmt->execute([$emailP]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if($result){
        return $result['email'];
    }
    return false;
}

//fonction qui met à jour pour un identifiant donné la date du jeton et la valeur du jeton
//pour une réinitialisation du mot de passe
function updateToken($pdoP, $tokenP, $emailP) {
    //ATTENTION l'identifiant doit être unique
    $stmt = $pdoP->prepare("UPDATE utilisateursgreta SET pwd_change_date=NOW(), pwd_change_token=? WHERE email =?");
    $stmt->execute([$tokenP, $emailP]);
}

//fonction qui renvoie les infos spécifiques à un jeton passé en paramètre
function getInfosToken($pdoP, $tokenP){
    //ATTENTION l'identifiant doit être unique
    $stmt = $pdoP->prepare("SELECT pwd_change_date, id_util FROM utilisateursgreta WHERE pwd_change_token=?");
    $stmt->execute([$tokenP]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

//fonction qui modifie le mot de passe et enlève les infos concernant le token
function reinitPwd($pdoP, $values) {
    //ATTENTION l'identifiant doit être unique
    $email = htmlspecialchars($values['email']);
    $pwd = htmlspecialchars($values['pwd']);
    $pwdHash = password_hash($pwd, PASSWORD_DEFAULT);
    $stmt = $pdoP->prepare("UPDATE utilisateursgreta SET pwd_change_date=NULL, pwd_change_token=NULL, pwd=? WHERE email =?");
    $stmt->execute([$pwdHash, $email]);
}

?>
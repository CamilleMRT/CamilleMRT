<?php

// CREER UN UTILISATEUR

function createUser($pdoP, $values){
    $stmt=$pdoP->prepare("INSERT INTO utilisateursgreta(nom, prenom, email, groupe, pwd) VALUES(UPPER(?),?,?,?,?)");

    $nom = htmlspecialchars($values['nom']);
    $prenom = htmlspecialchars($values['prenom']);
    $email = htmlspecialchars($values['email']);
    $pwd = htmlspecialchars($values['pwd']);
    $groupe = htmlspecialchars($values['groupe']);
    $pwdHash= password_hash($pwd, PASSWORD_DEFAULT);
    $stmt->execute([$nom, $prenom, $email, $groupe, $pwdHash]);
    $stmt->fetch();

}

// SELECTIONNER GROUPE UTILISATEUR

function getlistUtil($pdoP)
{
    $stmtUtil = $pdoP->prepare("SELECT groupe FROM utilisateursgreta");
    $stmtUtil->execute();
    $resultsGroupeUtil = $stmtUtil->fetchAll(PDO::FETCH_ASSOC);
    return $resultsGroupeUtil;
}
// MODIFIER UN UTILISATEUR



// SUPPRIMER UN UTILISATEUR
function deleteUtil($pdoP)
{
    $stmtDeleteUtil = $pdoP->prepare("DELETE FROM utilisateursgreta WHERE id_util=? limit 1");
    $stmtDeleteUtil->execute();
    $resultDeleteUtil = $stmtDeleteUtil->fetch(PDO::FETCH_ASSOC);
    return $resultDeleteUtil;
}
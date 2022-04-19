<?php

function isAdmin()
{
    return $_SESSION['groupe'] == 'ADMIN';
}

function isDirection()
{
    return $_SESSION['groupe'] == 'DIRECTION';
}

function isCFP()
{
    return $_SESSION['groupe'] == 'CFP';
}

function isRespProd()
{
    return $_SESSION['groupe'] == 'RESPONSABLE_PRODUCTION';
}

function isAssistantForm()
{
    return $_SESSION['groupe'] == 'ASSISTANT_FORMATION';
}

function isCoordo()
{
    return $_SESSION['groupe'] == 'COORDONNATEUR';
}

function isIntervenant()
{
    return $_SESSION['groupe'] == 'INTERVENANT';
}

function isServiceGestion()
{
    return $_SESSION['groupe'] == 'SERVICE_GESTION';
}

function isFormateur()
{
    return $_SESSION['groupe'] ==' FORMATEUR';
}


function connectUser($username, $pwd)

{
    // Vérification si l'utilisateur existe
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM utilisateursgreta WHERE email=? AND password= (?, 512)");
    $stmt->execute([$username, $pwd]);
    $utilisateurs = $stmt->fetchAll(\PDO::FETCH_ASSOC);

    // La personne existe en base de données (nous allons donc la connecter)
    if (count($utilisateurs) == 1) {
        $_SESSION['id_utilisateur'] = $utilisateurs[0];
        header("location: index.php?page=accueil");
        die();
    } else {
        return false;
    }
}

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



<?php
//chargement des paramètres de la BD
include('./utils/db.php');

//chargement des fonctions liées à la manipulation des données utilisateur
//include('./functions/utilisateurs.php');
include('./functions/actionsGestionConnexion.php');

if (isset($_POST['recovery-submit'])) { //CAS où l'utilisateur valid son changement de mot de passe
    reinitPwd($pdo, $_POST);
    header('Location: index.php?page=connexion');
    die();

} else if (isset($_GET['token'])) { //CAS où l'utilisateur à cliquer sur le lien du message de l'email
    $infosToken = getInfosToken($pdo, $_GET['token']);

    if (empty($infosToken)) { //pas de jeton trouvé en BD
        echo "la demande a expiré, veuillez demander de nouveau une réinitialisation du mot de passe.";

    } else { //le jeton existe
        //contrôle de la validité du jeton
        $timeToken = strtotime(date($infosToken['pwd_change_date']));
        $timeCourant = time();
        $delais = 10800; //3 heures

        if ($timeCourant - $timeToken > $delais) { //le délais est dépassé
            echo "le délais pour changer votre mot de passe est dépassé. Veuillez refaire la demande.";
        } else { //l'utilisateur peut saisir un nouveau mot de passe car jeton valide et délas non dépassé
            echo '<div class="container mt-3">
            
<div class="row">
<p class="mt-4 ml-4">Réinitialisation de votre mot de passe :</p>
    <div class="col-12">
        <form id="recovery-form" action="index.php?page=mdpoublie" method="POST">

        <div class="form-group col-6">

        <input type="text" onchange="verifUser(\'' . $infosToken['id_util'] . '\')" name="email" id="email" class="form-control" placeholder="Identifiant" value="" required>
</div>

<div class="form-group col-6">
    <input type="password" name="pwd" id="pwd" class="form-control" placeholder="Nouveau mot de passe" value="" required>
</div>

<div class="form-group col-6">
    <input type="password" name="pwdConf" id="pwdConf" class="form-control" placeholder="Confirmer le nouveau mot de passe" value="" required>
</div>

<div class="form-group col-3">
    <input type="submit" name="recovery-submit" id="recovery-submit" class="form-control btn-secondary" value="Changer le mot de passe">
</div>
</form>
</div>
</div>';
        }
    }
} else { //CAS où l'utilisateur débute sa demande de réinitialisation de mot de passe

    $email = htmlspecialchars(@$_GET['email']);
    if (strlen($email) == 0) { //l'utilisateur n'a pas saisi son identifiant
        echo '<div class="container mt-3">
        <p class="mt-4 ml-5">Vous devez saisir votre identifiant de connexion :</p>

<div class="row">
<div class="col-12">

<form action="index.php" method="GET">
<input type="hidden" name="page" value="mdpoublie">

<div class="form-group col-sm-6">
<input type="text" name="email" id="email" class="form-control" placeholder="Identifiant" value="" required>
</div>
<div class="form-group col-md-2 col-sm-6">
<input type="submit" name="login-submit" id="login-submit" class="form-control btn-secondary" value="Envoi mail">
</div>
</form></div></div>';

    } else {
        $dest = getMail($pdo, $email);
        $sujet = "Modification de mot de passe";
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-type: text/html; charset=UTF-8';
        $headers[] = 'From: admingreta@gmail.com';
        //génération d'une chaine de façon aléatoire.
        $token = openssl_random_pseudo_bytes(16);
        //convertion de la chaine en representation hexadecimal.
        $token = bin2hex($token);
        $message = '<h1>Réinitialisation de votre mot de passe</h1>
    <p>pour réinitialiser votre mot de passe, veuillez suivre ce lien : 
    <a href="localhost/SITEGRETA-SECOURS2/index.php?page=mdpoublie&token=' . $token . '">lien</a></p>';
        if (mail($dest, $sujet, utf8_decode($message), implode("\r\n", $headers))) {
            echo "Un email vous a été envoyé sur votre boite mail, veuillez le consulter.";
            //enregistrement en BD du token et de la date
            updateToken($pdo, $token, $email);
        } else {
            echo "Échec de l'envoi de l'email. Veuillez vous adresser à l'administrateur.";
        }
    }
} ?>
<!--<script src="./public/js/mdpoublie.js"></script>-->
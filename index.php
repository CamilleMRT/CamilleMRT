<?php 
    // accessibilité à la session courante de l'utilisateur
    session_start();
    include('./functions/utilisateurs.php');
    $page = isset($_GET['page']) ? $_GET['page'] : "connexion";

    // Affichage « de la partie haute » de votre site, commun à l'ensemble de votre site
    include('./common/header.php');
    if ($page != 'connexion' && $page!='mdpoublie') {
        //nav commune à tout le site
        include ('./common/nav.php');
    }
    // Pages autorisées : whitelist
    include('./whitelist/web.php');

    // Gestion accès accueil
    // Gestion de l'affichage de la page demandée
    if (in_array($page, $whitelist)){
        include("pages/" . $page . '.php');
    }

    
    // Affichage de la partie basse de votre site, commun à l'ensemble de votre site. 
    include('./common/footer.php'); 
    ?>

    
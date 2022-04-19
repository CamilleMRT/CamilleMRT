<?php 
    // accessibilité à la session courante de l'utilisateur
    session_start();
    $page = isset($_GET['page']) ? $_GET['page'] : "connexion";

    /*include('./common/function.php');*/
    // Affichage « de la partie haute » de votre site, commun à l'ensemble de votre site
    include('./common/header.php');
    if ($page != 'connexion') {
        //nav commune à tout le site
        include ('./common/nav.php');
    }
    // Pages autorisées : whitelist
    /*include('./whitelist/web.php');*/
    //nav commune à tout le site
   // if(isset($_GET['page'])) {
     //   include('./common/nav.php'); 

    //}


    // Gestion accès accueil
    // Gestion de l'affichage de la page demandée
    //&& in_array($_GET['page'], $whitelist)
    include("pages/" . $page . '.php');

    
    // Affichage de la partie basse de votre site, commun à l'ensemble de votre site. 
    include('./common/footer.php'); 
    ?>


<?php 
 $whitelist = array('connexion', 'authentification', 'mdpoublie', '404');
if(isset($_SESSION["etatConnexion"]) && $_SESSION["etatConnexion"]==1) {
    //la connexion a été établie
   if(isAdmin()){
        array_push($whitelist, 'accueil', 'profil', 'formation', 'reservation', 'aide','actions/ficheaction','actions/ficheactionModif',
        'admin/profilutil', 'admin/gestionresa');
    }    
    if(isDirection()){
        array_push($whitelist, 'accueil', 'profil', 'formation', 'reservation', 'aide','actions/ficheaction', 'actions/ficheactionModif');
    }  
    if(isFormateur()){
        array_push($whitelist, 'accueil', 'profil', 'formation', 'reservation', 'aide');
    }  
    if(isCFP()){
        array_push($whitelist, 'accueil', 'profil', 'formation', 'reservation', 'aide', 'actions/ficheaction', 'actions/ficheactionModif');
    }
    if(isRespProd()){
        array_push($whitelist, 'accueil', 'profil', 'formation', 'reservation', 'aide', 'actions/ficheaction', 'actions/ficheactionModif');
    }
    if(isAssistantForm()){
        array_push($whitelist, 'accueil', 'profil', 'formation', 'reservation', 'aide');
    }
    if(isCoordo()){
        array_push($whitelist, 'accueil', 'profil', 'formation', 'reservation', 'aide', 'actions/ficheaction', 'actions/ficheactionModif');
    }
    if(isServiceGestion()){
        array_push($whitelist, 'accueil', 'profil', 'formation', 'reservation', 'aide', 'actions/ficheaction', 'actions/ficheactionModif');
    }
    if(isIntervenant()){
        array_push($whitelist, 'accueil', 'profil', 'formation', 'reservation', 'aide');
    }
}


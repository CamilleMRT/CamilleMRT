<?php 
 $whitelist = array('connexion', 'authentification', 'mdpoublie', '404');
if(isset($_SESSION["etatConnexion"]) && $_SESSION["etatConnexion"]==1) {
    //la connexion a été établie
   if(isAdmin()){
        array_push($whitelist, 'accueil', 'profil', 'formation', 'reservation', 'aide','actions/ficheaction','actions/supprimer','actions/ajoutreservation',
        'admin/profilutil', 'admin/gestionresa', 'actions/ficheactionModif');
    }    
    if(isDirection()){
        array_push($whitelist, 'accueil', 'profil', 'formation', 'reservation', 'aide','actions/ficheaction','actions/supprimer');
    }  
    if(isFormateur()){
        array_push($whitelist, 'accueil', 'profil', 'formation', 'reservation', 'aide', 'actions/ficheaction','actions/supprimer');
    }  
    if(isCFP()){
        array_push($whitelist, 'accueil', 'profil', 'formation', 'reservation', 'aide');
    }
    if(isRespProd()){
        array_push($whitelist, 'accueil', 'profil', 'formation', 'reservation', 'aide');
    }
    if(isAssistantForm()){
        array_push($whitelist, 'accueil', 'profil', 'formation', 'reservation', 'aide');
    }
    if(isCoordo()){
        array_push($whitelist, 'accueil', 'profil', 'formation', 'reservation', 'aide');
    }
    if(isServiceGestion()){
        array_push($whitelist, 'accueil', 'profil', 'formation', 'reservation', 'aide');
    }
    if(isIntervenant()){
        array_push($whitelist, 'accueil', 'profil', 'formation', 'reservation', 'aide');
    }
}
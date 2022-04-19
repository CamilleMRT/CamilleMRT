<?php 
 $whitelist = array('connexion', '404');
if(isset($_SESSION["etatConnexion"]) && $_SESSION["etatConnexion"]==1) {
    //la connexion a été établie
    if(isAdmin()){
        array_push($whitelist, 'actions/ficheaction','actions/listeactions','actions/supprimer','actions/ajoutreservation','admin/profilutil');
    }    
    if(isDirection()){
        array_push($whitelist, 'actions/ficheaction','actions/listeactions','actions/supprimer','actions/ajoutreservation');
    }  
    if(isFormateur()){
        array_push($whitelist, 'actions/ficheaction','actions/listeactions','actions/supprimer','actions/ajoutreservation');
    }  
    
    array_push($whitelist, );

}
return $whitelist;

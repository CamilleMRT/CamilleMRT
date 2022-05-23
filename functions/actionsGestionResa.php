<?php

// AJOUTER UN ELEMENT AU CATALOGUE DE RESERVATION

function createElementResa($pdoP, $values)
{
    $stmt = $pdoP->prepare("INSERT INTO materiel(nom_materiel, id_cat_mat, id_marque, id_site) VALUES (?,?,?,?)");

    $nomMat = htmlspecialchars($values['nom_materiel']);
    $nomCatMat = htmlspecialchars($values['id_cat_mat']);
    $nomMarque = htmlspecialchars($values['id_marque']);
    $site = htmlspecialchars($values['id_site']);
    $stmt->execute([$nomMat, $nomCatMat, $nomMarque, $site]);
}

if (@$_POST['ajoutMat']) {
    createElementResa($pdo, $_POST);
    print_r($_POST);
}

// LISTE CATEGORIES MATERIEL
function getlistMat($pdoP){
    $stmtMat = $pdoP->prepare('SELECT nom_cat_mat FROM categorie_materiel');
    $stmtMat->execute();
    $resultsmateriel = $stmtMat->fetchAll(PDO::FETCH_ASSOC);
    return $resultsmateriel;
}

// LISTE MARQUES MATERIEL
function getlistMarques($pdoP){
    $stmtMarques = $pdoP->prepare('SELECT nom_marque FROM marques');
    $stmtMarques->execute();
    $resultsmarques = $stmtMarques->fetchAll(PDO::FETCH_ASSOC);
    return $resultsmarques;
}

// LISTE SITE DISPONIBLE
function getlistSite($pdoP)
{
    $stmtsite = $pdoP->prepare("SELECT ID_SITE, concat(ville_site,' ',etablissement_site) as 
        lieu_formation FROM sites_formation");
    $stmtsite->execute();
    $resultsSite = $stmtsite->fetchAll(PDO::FETCH_ASSOC);
    return $resultsSite;
}










//fonction qui renvoie la liste des réservations de l'utilisateur connecté
//qui auront lieu après la date du jour sous forme de tableau associatif
//nom de la colonne et valeur en BD
function getListFuturResa($pdoP)
{
    $stmt = $pdoP->prepare("SELECT CONCAT(reservations.ID_MAT, ' : ', materiel.nom_materiel) AS libMat,
        CONCAT(materiels.ID_MAT, ' : ', marques.LIBELLE_MARQUE) AS libMarq,
        reservations.datedebut_reservation, reservations.datefin_reservation
        FROM reservations
        INNER JOIN materiels ON reservations.ID_MAT = materiel.ID_MAT
        INNER JOIN marques ON materiels.ID_MARQUE = marques.ID_MARQUE
        WHERE reservations.id_util=? AND reservations.DATE_DEBUT_RESA > NOW()");
        $stmt->execute([$_SESSION['id_util']]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

//fonction qui renvoie la liste des réservations de l'utilisateur connecté
//qui auront lieu après la date du jour sous forme de tableau associatif
//nom de la colonne et valeur en BD
function getListResaEnCours($pdoP) {
    $stmt = $pdoP->prepare("SELECT CONCAT(reservations.ID_MAT, ' : ', materiel.nom_materiel) AS libMat,
        CONCAT(materiels.ID_MAT, ' : ', marques.LIBELLE_MARQUE) AS libMarq,
        reservations.datedebut_reservation, reservations.datefin_reservation
        FROM reservations
        INNER JOIN materiel ON reservation.ID_MAT = materiels.ID_MAT
        INNER JOIN marques ON materiel.ID_MARQUE = marque.ID_MARQUE
        WHERE reservations.id_util=? AND NOW() BETWEEN reservation.datedebut_reservation  AND reservations.datefin_reservation");
        $stmt->execute([$_SESSION['id_util']]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

//liste du matériels disponibles à la date du jour
//avec recherche rapide sur le libellé
function getListMaterielDispoFast($pdoP, $val) {
    $stmt = $pdoP->prepare("SELECT materiel.ID_MAT, materiel.LIBELLE_MAT FROM materiel
    WHERE materiel.ID_MAT NOT IN (select reservations.ID_MAT from reservations 
    where NOW() BETWEEN reservation.datedebut_reservation  AND reservations.datefin_reservation) 
    AND materiel.nom_materiel LIKE ?");
    $stmt->execute(['%'.$val.'%']);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

//liste du matériels disponibles, c.a.d non réservé à la période demandé
//avec les valeurs saisies dans le formulaire de recherche
function getListMaterielDispo($pdoP, $vals) {
    $paraSQL = [$vals['datedebut_reservation'], $vals['datefin_reservation'], 
    $vals['datedebut_reservation'], $vals['datefin_reservation'], $vals['datedebut_reservation'], $vals['datefin_resersavtion']];
    $requeteSQL = "SELECT materiel.ID_MAT, materiel.nom_materiel FROM materiel
    WHERE materiels.ID_MAT NOT IN (select reservations.ID_MAT from reservations 
    where reservations.datedebut_reservation BETWEEN ? AND ? 
    OR reservations.datefin_reservation BETWEEN ? AND ?
    OR DATE(?) BETWEEN reservations.datedebut_reservation AND reservations.datefin_reservation
    OR DATE(?) BETWEEN reservations.datedebut_reservation AND reservations.datefin_reservation)";
    if ($vals['marque']!="") {//si l'utilisateur a filtré sa recherche sur la marque
        $requeteSQL = $requeteSQL . " AND materiel.ID_MARQUE=?";
        array_push($paraSQL, $vals['marque']);
    }
    if ($vals['nom_materiel']!="") {//si l'utilisateur a filtré sur le libellé
        $requeteSQL = $requeteSQL .  " AND materiel.nom_materiel LIKE ?";
        array_push($paraSQL, '%' . $vals['nom_materiel'] . '%');
    }
    $stmt = $pdoP->prepare($requeteSQL);
    $stmt->execute($paraSQL);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

    //fonction qui crée un enregistrement en BD
function createResa($pdoP, $vals)
{
    //ATTENTION AVANT de créer en BD vérifier que la période choisie est toujours
    //disponible.
   //pas de capture d'erreur pour qu'elle puisse remonter
        $idUtil = (isset($vals['id_util'])) ? $vals['id_util'] : $_SESSION['id_util'];
        $stmt = $pdoP->prepare("INSERT INTO reservations(nom_reservation, ID_UTIL, ID_MAT_RESA, DATE_RESA, DATE_DEBUT_RESA, DATE_FIN_RESA)
        VALUES (?, ?, ?, NOW(), ?, ?)");
        $stmt->execute([$vals['libelle_resa'], $idUtil, $vals['id_mat_resa'], $vals['date_debut_resa'], $vals['date_fin_resa']]);
        return $pdoP->lastInsertId();
}

function deleteResa($pdoP, $idResa)
{
    //pas de capture d'erreur pour qu'elle puisse remonter
    $stmt = $pdoP->prepare("DELETE FROM reservations WHERE ID_RESA=?");
    $stmt->execute([$idResa]);
}


//fonction permettant de générer les événements du calendrier pour les réservations
//d'un matériel dont l'id est passé en argument
function getEvenementsResa($pdoP, $idResa, $debut, $fin, $idUtil)
{
    try {
        $stmt = $pdoP->prepare("SELECT DISTINCT LIBELLE_RESA, ID_UTIL,ID_RESA, DATE_DEBUT_RESA, DATE_FIN_RESA from reservations
    where ID_MAT_RESA=? AND DATE_DEBUT_RESA BETWEEN ? AND ?");
        $stmt->execute([$idResa, $debut, $fin]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $reponse = array();
        foreach ($results as $result) {
            $event = array();
            $start = strtotime($result['DATE_DEBUT_RESA'])*1000;
            $end = strtotime($result['DATE_FIN_RESA'])*1000;
            $idMat = $result['ID_RESA'];
            $title = "Réservé";
            $color = "red";
            $editable = "false";//va permettre la modification ou suppression de l'évènement
            if($result['ID_UTIL'] == $idUtil) {
                //la réservation a été faite par l'utilisateur connecté
                //alors on affiche le libellé qu'il a saisi lors de sa résa.
                $title = $result['LIBELLE_RESA'];
                if(is_null($title)) $title="ma résa";
                $color = "green";
                $editable = "true";
            }
            //DEBUT définition des propriétés générales de l'évènement
            $event['id'] = $idMat;
            $event['title'] = $title;
            $event['start'] = $start;
            $event['end'] = $end;
            $event['editable'] = $editable;
            $event['backgroundColor'] = $color;
            $event['borderColor'] = $color;
            $event['allDay'] = 'true';
            //FIN définition des propriétés générales de l'évènement
            //définition des propriétés spécifiques
            $event['extendedProps'] = ['userId'=> $idUtil];
            array_push($reponse, $event);
        }
        return $reponse;
    } catch (PDOException $e) {
        return '';
    }
}
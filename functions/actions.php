<?php
include ("./utils/db.php");

// *************** CONFIG FICHE ACTION *************** 

// FONCTIONS 

// CREER UNE FICHE ACTION
function createAction($pdoP, $values)
{
    $stmt = $pdoP->prepare("INSERT INTO formations(intitule_formation, datevalidation_formation, datedebut_formation, datefin_formation
    , cfp_ref_formation, niveau_formation, datedebut_examen_formation, datefin_examen_formation, id_site_formation, id_site_secondaire,
    id_parcours, ID_SECTEUR_FORMATION, etat) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,1)");

    $nomAction = htmlspecialchars($values['intitule_formation']);
    $datevalidAction = htmlspecialchars($values['datevalidation_formation']);
    $datedebutAction = htmlspecialchars($values['datedebut_formation']);
    $datefinAction = htmlspecialchars($values['datefin_formation']);
    $cfprefAction = ($values['cfp_ref_formation']);
    $niveauAction = ($values['niveau_formation']);
    $datedebutexamAction = htmlspecialchars($values['datedebut_examen_formation']);
    $datefinexamAction = htmlspecialchars($values['datefin_examen_formation']);
    $siteAction = ($values['id_site_formation']);
    $siteSecondaire = ($values['id_site_secondaire']);
    $parcoursAction = ($values['id_parcours']);
    $secteurAction = ($values['ID_SECTEUR_FORMATION']);
   // $modaliteAction = ($values['id_modalites_examen']);
    $stmt->execute([$nomAction, $datevalidAction, $datedebutAction, $datefinAction, $cfprefAction, $niveauAction, 
        $datedebutexamAction, $datefinexamAction, $siteAction, $siteSecondaire, $parcoursAction, $secteurAction]);
    $idFiche = $pdoP->lastInsertId();
    return $idFiche;
}

// SUPPRIMER UNE FICHE ACTION
function deleteAction($pdoP, $values)
{
    $stmtDeleteAction = $pdoP->prepare("DELETE FROM formations WHERE formations.id_formation=?");
    $stmtDeleteAction->execute([$values['supprimerAction']]);
    $resultDeleteAction = $stmtDeleteAction->fetchAll(PDO::FETCH_ASSOC);
    return $resultDeleteAction;
}


// ASSOCIATION FICHE ACTION ET SITE DE REALISATION
function createSiteAsso($pdoP, $idSite, $idFiche)
{
    $stmt = $pdoP->prepare("INSERT INTO dispenser (ID_FORMATION, ID_SITE) VALUES (?,?)");
    $stmt->execute([$idFiche, $idSite]);
}

// POUR SELECTIONNER UNE FICHE ACTION EXISTANTE
function getAction($pdo, $id_action)
{
    $stmtAction = $pdo->prepare("SELECT * FROM formations WHERE ID_FORMATION =?");
    $stmtAction->execute([$id_action]);
    $resultAction = $stmtAction->fetch(PDO::FETCH_ASSOC);
    return $resultAction;
}

// UPDATE FICHE ACTION PARTIE 1
function updateAction($pdoP, $values, $idP)
{
    // $stmt = $pdoP->prepare("UPDATE formations SET intitule_formation='', datevalidation_formation, datedebut_formation, datefin_formation
    // , cfp_ref_formation, niveau_formation, datedebut_examen_formation, datefin_examen_formation, id_site_formation, id_site_secondaire,
    // id_parcours, ID_SECTEUR_FORMATION VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");

$stmt = $pdoP->prepare("UPDATE formations SET intitule_formation = ?, datevalidation_formation = ?, datedebut_formation= ?, datefin_formation
, cfp_ref_formation= ?, niveau_formation= ?, datedebut_examen_formation= ?, datefin_examen_formation= ?, id_site_formation= ?, id_site_secondaire= ?,
id_parcours= ?, ID_SECTEUR_FORMATION = ? WHERE id_formation = ?");

    $nomAction = htmlspecialchars($values['intitule_formation']);
    $datevalidAction = htmlspecialchars($values['datevalidation_formation']);
    $datedebutAction = htmlspecialchars($values['datedebut_formation']);
    $datefinAction = htmlspecialchars($values['datefin_formation']);
    $cfprefAction = ($values['cfp_ref_formation']);
    $niveauAction = ($values['niveau_formation']);
    $datedebutexamAction = htmlspecialchars($values['datedebut_examen_formation']);
    $datefinexamAction = htmlspecialchars($values['datefin_examen_formation']);
    $siteAction = ($values['id_site_formation']);
    $siteSecondaire = ($values['id_site_secondaire']);
    $parcoursAction = ($values['id_parcours']);
    $secteurAction = ($values['ID_SECTEUR_FORMATION']);
   // $modaliteAction = ($values['id_modalites_examen']);
    $stmt->execute([$nomAction, $datevalidAction, $datedebutAction, $datefinAction, $cfprefAction, $niveauAction, 
        $datedebutexamAction, $datefinexamAction, $siteAction, $siteSecondaire, $parcoursAction, $secteurAction, $idP]);
    // $id_action = $pdoP->lastInsertId();
    // return $id_action;
}

// CREER FICHE ACTION PARTIE 2
function updateAction2($pdoP, $values)
{
    $stmt = $pdoP->prepare("UPDATE formations SET coordo_form, assistant_form, etat VALUES (?,?,2)");

    $coordoForm = ($values['coordo_form']);
    $assistantForm = ($values['assistant_form']);
    $stmt->execute([$coordoForm, $assistantForm]);
    $idFiche = $pdoP->lastInsertId();
    return $idFiche;
}

// CREER FICHE ACTION PARTIE 3

function completeAction3($pdoP, $values)
{
    $stmt = $pdoP->prepare("UPDATE formations SET id_personnel_formation, cat_inter, heure_inter, nature_heure_inter, tarif, etat VALUES (?,?,?,?,?,3)");

    $idPersonnelForm = ($values['id_personnel_formation']);
    $catIntervenant = ($values['cat_inter']);
    $heureInter = ($values['heure_inter']);
    $natureHeureInter = ($values['nature_heure_inter']);
    $tarif = ($values['tarif']);
    $stmt->execute([$idPersonnelForm, $catIntervenant, $heureInter, $natureHeureInter, $tarif]);
    $idFiche = $pdoP->lastInsertId();
    return $idFiche;
}



// CREER FICHE ACTION PARTIE 4

function createAction4($pdoP, $values)
{
    $stmt = $pdoP->prepare("UPDATE formations SET intitule_formation='', datevalidation_formation, datedebut_formation, datefin_formation
    , cfp_ref_formation, niveau_formation, datedebut_examen_formation, datefin_examen_formation, id_site_formation, id_site_secondaire,
    id_parcours, ID_SECTEUR_FORMATION, etat VALUES (?,?,?,?,?,?,?,?,?,?,?,?,1)");

    $nomAction = htmlspecialchars($values['intitule_formation']);
    $datevalidAction = htmlspecialchars($values['datevalidation_formation']);
    $datedebutAction = htmlspecialchars($values['datedebut_formation']);
    $datefinAction = htmlspecialchars($values['datefin_formation']);
    $cfprefAction = ($values['cfp_ref_formation']);
    $niveauAction = ($values['niveau_formation']);
    $datedebutexamAction = htmlspecialchars($values['datedebut_examen_formation']);
    $datefinexamAction = htmlspecialchars($values['datefin_examen_formation']);
    $siteAction = ($values['id_site_formation']);
    $siteSecondaire = ($values['id_site_secondaire']);
    $parcoursAction = ($values['id_parcours']);
    $secteurAction = ($values['ID_SECTEUR_FORMATION']);
   // $modaliteAction = ($values['id_modalites_examen']);
    $stmt->execute([$nomAction, $datevalidAction, $datedebutAction, $datefinAction, $cfprefAction, $niveauAction, 
        $datedebutexamAction, $datefinexamAction, $siteAction, $siteSecondaire, $parcoursAction, $secteurAction]);
    $id_action = $pdoP->lastInsertId();
    return $id_action;
}


// SELECT EMAIL RESP PROD POUR ETAPE 2
function getEmailResponsableSite($pdo, $site){
    $stmt = $pdo->prepare('SELECT utilisateursgreta.email FROM utilisateursgreta INNER JOIN 
    sites_formation ON sites_formation.id_resp_site=utilisateursgreta.id_util WHERE sites_formation.id_site=?');
    $stmt->execute([$site]);
    $result=$stmt->fetch(PDO::FETCH_ASSOC);
    return $result['email'];
}



// SELECT EMAIL COORDONNATEUR POUR ETAPE 3
function getEmailCoordo($pdo, $site){
    $stmt = $pdo->prepare('SELECT utilisateursgreta.email FROM utilisateursgreta INNER JOIN 
    sites_formation ON sites_formation.id_resp_site=utilisateursgreta.id_util WHERE sites_formation.id_site=?');
    $stmt->execute([$site]);
    $result=$stmt->fetch(PDO::FETCH_ASSOC);
    return $result['email'];
}



// ************ PARTIE CFP *************

// SELECT CFP REFERENT 
function getlistCFP($pdoP)
{
    $stmtcfp = $pdoP->prepare("SELECT * FROM utilisateursgreta WHERE groupe='CFP'");
    $stmtcfp->execute();
    $resultsCFP = $stmtcfp->fetchAll(PDO::FETCH_ASSOC);
    return $resultsCFP;
}


// SELECT SECTEUR FORMATION
function getlistSecteur($pdoP)
{
    $stmtgroupes = $pdoP->prepare("SELECT * FROM secteur_formation");
    $stmtgroupes->execute();
    $resultsSecteur = $stmtgroupes->fetchAll(PDO::FETCH_ASSOC);
    return $resultsSecteur;
}

// SELECT NIVEAU RCNP
function getlistNiveau($pdoP)
{
    $stmtniveau = $pdoP->prepare("SELECT * FROM niveau_formation");
    $stmtniveau->execute();
    $resultsNiveau = $stmtniveau->fetchAll(PDO::FETCH_ASSOC);
    return $resultsNiveau;
}

// SELECT SITE REALISATION PRINCIPAL
function getlistSite($pdoP)
{
    $stmtsite = $pdoP->prepare("SELECT ID_SITE, concat(ville_site,' ',etablissement_site) as 
        lieu_formation FROM sites_formation");
    $stmtsite->execute();
    $resultsSite = $stmtsite->fetchAll(PDO::FETCH_ASSOC);
    return $resultsSite;
}

// SELECT SITE REALISATION SECONDAIRE
function getlistSiteBis($pdoP)
{
    $stmtsiteBis = $pdoP->prepare("SELECT ID_SITE, concat(ville_site,' ',etablissement_site) as 
        lieu_formation FROM sites_formation");
    $stmtsiteBis->execute();
    $resultsSiteBis = $stmtsiteBis->fetchAll(PDO::FETCH_ASSOC);
    return $resultsSiteBis;
}

// SELECT PARCOURS FORMATION

function getlistParcours($pdoP)
{
    $stmtParcours = $pdoP->prepare("SELECT * FROM parcours_formation");
    $stmtParcours->execute();
    $resultsParcours = $stmtParcours->fetchAll(PDO::FETCH_ASSOC);
    return $resultsParcours;
}

// SELECT MODALITES EXAMENS
function getlistModalites($pdoP)
{
    $stmtModalite = $pdoP->prepare("SELECT * FROM modalites_examens");
    $stmtModalite->execute();
    $resultsModalite = $stmtModalite->fetchAll(PDO::FETCH_ASSOC);
    return $resultsModalite;
}

// ************ PARTIE RESP PROD *************

function completeActionRespProd($pdoP, $values)
{
    $stmtRespProd = $pdoP->prepare("INSERT INTO personnel_formation(nom_personnel, prenom_personnel) VALUES (?,?)");

    $nomPersonnel = htmlspecialchars($values['nom_personnel']);
    $prenomPersonnel = htmlspecialchars($values['prenom_personnel']);
    $stmtRespProd->execute([$nomPersonnel, $prenomPersonnel]);
    $idFiche = $pdoP->lastInsertId();
    return $idFiche;
}

// SELECT COORDO
function getlistCoordo($pdoP)
{
    $stmtcoordo = $pdoP->prepare("SELECT * from utilisateursgreta WHERE groupe='COORDONNATEUR'");
    $stmtcoordo->execute();
    $resultsCoordo = $stmtcoordo->fetchAll(PDO::FETCH_ASSOC);
    return $resultsCoordo;
}

// SELECT ASSISTANT FORMATION
function getlistAssForm($pdoP)
{
    $stmtAssForm = $pdoP->prepare("SELECT * FROM utilisateursgreta WHERE groupe='ASSISTANT FORMATION'");
    $stmtAssForm->execute();
    $resultsAssForm = $stmtAssForm->fetchAll(PDO::FETCH_ASSOC);
    return $resultsAssForm;
}


// *********** PARTIE COORDO ************

function completeActionCoordo($pdoP, $values)
{
    $stmtActionCoordo = $pdoP->prepare("INSERT INTO intervenants_formation(nom_intervenant, prenom_intervenant, categorie_intervenant,
    tarif_intervenant) VALUES (?,?,?,?)");
    $nomInter = htmlspecialchars($values['nom_intervenant']);
    $prenomInter = htmlspecialchars($values['prenom_intervenant']);
    $catInter = htmlspecialchars($values['categorie_intervenant']);
    $stmtActionCoordo->execute([$nomInter, $prenomInter, $catInter]);
    $idFiche = $pdoP->lastInsertId();
    return $idFiche;
}

// SELECT NOM INTERVENANT
function getlistInter($pdoP)
{
    $stmtIntervenant = $pdoP->prepare("SELECT * FROM utilisateursgreta WHERE groupe='INTERVENANT'");
    $stmtIntervenant->execute();
    $resultsIntervenant = $stmtIntervenant->fetchAll(PDO::FETCH_ASSOC);
    return $resultsIntervenant;
}

// SELECT CATEGORIE INTERVENANT
function getlistCatInter($pdoP)
{
    $stmtCatInter = $pdoP->prepare("SELECT * FROM categorie_intervenant");
    $stmtCatInter->execute();
    $resultsCatInter = $stmtCatInter->fetchAll(PDO::FETCH_ASSOC);
    return $resultsCatInter;
}

// SELECT TYPE HEURES INTERVENANT
function getlistType($pdoP)
{
    $stmtHeuresInter = $pdoP->prepare("SELECT * FROM typeheures_intervenant");
    $stmtHeuresInter->execute();
    $resultsHeuresInter = $stmtHeuresInter->fetchAll(PDO::FETCH_ASSOC);
    return $resultsHeuresInter;
}

?>
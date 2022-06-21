<?php
include('functions/actions.php');
include ('utils/db.php');
?>

<!-- FORMULAIRE FICHE ACTION -->
<main role="main" class="col-md-9 ml-sm-auto">
    <div class="card m-5 text-center bg-light">
        <div class="card-header" id="title">
            <h3>Créer une fiche action </h3>
        </div>
        <br>
        <form action="index.php?page=actions/ficheaction" method="POST">

            <div class="card m-3 p-2 text-center" id="subtitle">
                <h5>Partie à remplir par le/la CFP</h5>
            </div>

            <div class="card-body">

                <!-- INTITULE FORMATION -->
                <div class="row m-2">
                    <div class="col-sm-12 col-md-6 mb-3">
                        <p class="text-left m-0">Intitulé de la formation</p>

                        <input <?=(isCFP() || isAdmin() || isDirection()) ? '' : 'readonly' ?> type='text'
                            class='form-control' name='intitule_formation' required>
                    </div>

                    <br>
                    <!-- SECTEUR FORMATION -->
                    <div class="col-sm-12 col-md-6 ">
                        <p class="text-left m-0">Secteur formation</p>
                        <select <?=(isCFP() || isAdmin() || isDirection()) ? '' : 'readonly' ?> class="custom-select"
                            id="" name="ID_SECTEUR_FORMATION" required>

                            <option selected>Choix</option>
                            <?php 
                        $resultsSecteur=getlistSecteur($pdo);
                            foreach ($resultsSecteur as $groupes_formation){
                            ?>

                            <option value="<?php echo $groupes_formation["ID_SECTEUR_FORMATION"]?>">
                                <?php echo $groupes_formation["secteur_formation"]?></option>
                            <?php } ?>
                        </select>
                    </div>
                </div>

                <!-- CFP Référent -->
                <div class="row m-2">
                    <div class="col-sm-12 col-md-4 mt-4">
                        <p class="text-left">CFP référent(e)
                            <select <?=(isCFP() || isAdmin() || isDirection()) ? '' : 'readonly' ?>
                                name="cfp_ref_formation" class="form-control" required>
                                <option selected>Choix</option>
                                <?php
                        $resultsCFP=getlistCFP($pdo);
                        foreach ($resultsCFP as $cfp){
                            
                            ?>
                                <option value="<?php echo $cfp["id_util"]?>">
                                    <?php echo "{$cfp['nom']} {$cfp['prenom']}"?></option>
                                <?php } ?>
                            </select>
                        </p>
                    </div>

                    <!-- DATES -->
                    <!-- date validation directeur -->
                    <div class="col-sm-12 col-md-4 ">
                        <p class="text-left"> Date de validation de l'action par le Directeur
                            <input <?=(isCFP() || isAdmin() || isDirection()) ? '' : 'readonly' ?> type="date"
                                class="form-control"
                                value="<?php echo $resultAction['date_validation_formation'] ?>"
                                name="datevalidation_formation" required />
                        </p>
                    </div>

                    <!-- date de début formation -->
                    <div class="col-sm-12 col-md-4 mt-4">
                        <p class="text-left"> Date de début de l'action
                            <input <?=(isCFP() || isAdmin() || isDirection()) ? '' : 'readonly' ?> type="date"
                                class="form-control"
                                value="<?php echo $resultAction['datedebut_formation'] ?>"
                                name="datedebut_formation" required>
                        </p>
                    </div>
                </div>

                <!-- date de fin formation -->
                <div class="row m-2">
                    <div class="col-sm-12 col-md-4 mt-4">
                        <p class="text-left"> Date de fin de l'action
                            <input <?=(isCFP() || isAdmin() || isDirection()) ? '' : 'readonly' ?> type="date"
                                class="form-control"
                                value="<?php echo $resultAction['datefin_formation'] ?>"
                                name="datefin_formation" required />
                        </p>
                    </div>

                    <!-- Niveau RNCP -->
                    <div class="col-sm-12 col-md-4 mt-4">
                        <p class="text-left m-0">Niveau RNCP</p>
                        <select <?=(isCFP() || isAdmin() || isDirection()) ? '' : 'readonly' ?> class="custom-select"
                            name="niveau_formation">

                            <option selected>Choix</option>
                            <?php 
                        $resultsNiveau=getlistNiveau($pdo);
                            foreach ($resultsNiveau as $niveau_formation){

                            ?>
                            <option value="<?php echo $niveau_formation["ID_NIVEAU"]?>">
                                <?php echo $niveau_formation["num_niveau"]?></option>
                            <?php } ?>

                        </select>
                    </div>


                    <!-- Site de réalisation -->
                    <div class="col-sm-12 col-md-4 mt-4 ">
                        <p class="text-left m-0"> Site de réalisation principal </p>
                        <select <?=(isCFP() || isAdmin() || isDirection()) ? '' : 'readonly' ?> class="custom-select"
                            name="id_site_formation" required>
                            <option selected>Choix</option>
                            <?php 
                        $resultsSite=getlistSite($pdo);
                            foreach ($resultsSite as $site){

                            ?>
                            <option value="<?php echo $site["ID_SITE"]?>">
                                <?php echo $site['lieu_formation']?></option>
                            <?php } ?>
                        </select>
                    </div>
                </div>

                <!-- Site de réalisation secondaire -->
                <div class="row m-2">
                    <div class="col-sm-12 col-md-4 mt-4 ">
                        <p class="text-left m-0"> Site de réalisation secondaire </p>
                        <select <?=(isCFP() || isAdmin() || isDirection()) ? '' : 'readonly' ?> class="custom-select"
                            name="id_site_secondaire" required>
                            <option selected>Choix</option>
                            <?php 
                        $resultsSiteBis=getlistSiteBis($pdo);
                            foreach ($resultsSiteBis as $site){

                            ?>
                            <option value="<?php echo $site["ID_SITE"]?>">
                                <?php echo $site['lieu_formation']?></option>
                            <?php } ?>
                        </select>
                    </div>

                    <!-- Parcours -->
                    <div class="col-sm-12 col-md-4 mt-4">
                        <p class="text-left">Parcours
                            <select <?=(isCFP() || isAdmin() || isDirection()) ? '' : 'readonly' ?> name="id_parcours"
                                class="form-control" required>
                                <option selected>Choix</option>
                                <?php
                        $resultsParcours=getlistParcours($pdo);
                        foreach ($resultsParcours as $parcours){
                        ?>
                                <option value="<?php echo $parcours["ID_PARCOURS"]?>">
                                    <?php echo $parcours["nom_parcours"]?></option>
                                <?php } ?>
                            </select>
                        </p>
                    </div>

                    <!-- Modalités examens -->
                    <div class="col-sm-12 col-md-4">
                        <p class="text-left">Modalités examens (pour BTS/Bac/CAP)
                            <select <?=(isCFP() || isAdmin() || isDirection()) ? '' : 'readonly' ?>
                                name="id_modalites_examen" class="form-control" required>
                                <option selected>Choix</option>
                                <?php
                        $resultsModalite=getlistModalites($pdo);
                        foreach ($resultsModalite as $modalite){

                        ?>
                                <option value="<?php echo $modalite["id_modalites_examen"]?>">
                                    <?php echo $modalite["modalite_examen"]?></option>
                                <?php } ?>
                            </select>
                        </p>
                    </div>
                </div>
                <!-- date de début examen -->
                <div class="row m-2">

                    <div class="col-sm-12 col-md-4">
                        <p class="text-left m-0">Date de début examen</p>
                        <input <?=(isCFP() || isAdmin() || isDirection()) ? '' : 'readonly' ?> type="date"
                            class="form-control" value="" name="datedebut_examen_formation" required>
                    </div>

                    <!-- Checkbox validation -->
                    <div class="col-sm-12 col-md-4">
                        <div class="form-check text-left">
                            <input <?=(isCFP() || isAdmin() || isDirection()) ? '' : 'readonly' ?>
                                class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault" name="dispense_formation">
                                Validation des dispenses par le rectorat <br>
                                (si parcours Intégration)
                            </label>
                        </div>
                    </div>

                    <!-- date de fin examen -->
                    <div class="col-sm-12 col-md-4 ">
                        <p class="text-left">Date de fin examen
                            <input <?=(isCFP() || isAdmin() || isDirection()) ? '' : 'readonly' ?> type="date"
                                class="form-control" value="" name="datefin_examen_formation" required>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Commentaire -->
            <div class="row m-2">
                <div class="col-12">
                    <p class="text-left">Commentaire</p>
                    <textarea <?=(isCFP() || isAdmin() || isDirection()) ? '' : 'readonly' ?> class="form-control"
                        rows="2"></textarea>
                </div>
            </div>

            <?php

            if(isAdmin() || isDirection() || isCFP()){
        ?>

            <!-- Boutons -->
            <div class="row justify-content-center">
                <div class="m-3">
                    <input type="submit" onclick='alert("Enregistrement et envoi au responsable de production")' name="etape1" class="btn btn-success" value="Valider">
                </div>
            </div>

    </div>
    <?php
        }
        ?>
    </form>

    <!-- ******** 2eme partie - Responsable Prod ******** -->

    <form action="index.php?page=actions/ficheaction" method="POST">

        <div class="card m-5 text-center bg-light">

            <!-- Titre -->
            <div class="card m-5 p-2 text-center" id="subtitle">
                <h5>Partie à remplir par le/la responsable de production</h5>
            </div>

            <!-- CFP Référent -->
            <div class="row m-2">
                <div class="col-sm-12 col-md-6">
                    <p class="text-left">Coordonnateur(trice)
                        <select <?=(isRespProd() || isAdmin() || isDirection()) ? '' : 'readonly' ?> name="coordo_form"
                            class="form-control" required>
                            <option selected>Choix</option>
                            <?php
                        $resultsCoordo=getlistCoordo($pdo);
                        foreach ($resultsCoordo as $coordonnateur){
                            
                            ?>
                            <option value="<?php echo $coordonnateur["id_util"]?>">
                                <?php echo "{$coordonnateur['nom']} {$coordonnateur['prenom']}"?></option>
                            <?php } ?>
                        </select>
                    </p>
                </div>


                <!-- Assistant de formation-->
                <div class="col-sm-12 col-md-6">
                    <p class="text-left">Assistant(e) de formation
                        <select <?=(isRespProd() || isAdmin() || isDirection()) ? '' : 'readonly' ?> name="assistant_form"
                            class="form-control" required>
                            <option selected>Choix</option>
                            <?php
                        $resultsAssForm=getlistAssForm($pdo);
                        foreach ($resultsAssForm as $assistantform){
                            
                            ?>
                            <option value="<?php echo $assistantform["id_util"]?>">
                                <?php echo "{$assistantform['nom']} {$assistantform['prenom']}"?></option>
                            <?php } ?>
                        </select>
                    </p>
                </div>

            </div>

            <?php
            if(isAdmin() || isDirection() || isRespProd()){
        ?>

            <!-- Boutons -->
            <div class="row justify-content-center">
                <div class="m-3">
                    <button type="button" name="etape2" onclick='alert("Enregistrement et envoi au coordonnateur")' class="btn btn-success">Valider</button>
                </div>
            </div>

            <?php
                    }
                    ?>
        </div>
    </form>

    <!-- ******** 3eme partie - Coordonnateur ******** -->
    <form id="formCoordo" action="index.php?page=actions/ficheaction" method="POST">

        <!-- Titre centre -->
        <div class="card m-5 text-center bg-light">

            <div class="card m-5 p-2 text-center" id="subtitle">

                <h5>Partie à remplir par le/la coordonnateur(trice)</h5>
            </div>
            <div id="listeinter">
                <div id="coordo1">

                    <!-- Nom de l'intervenant -->
                    <div class="row m-2">
                        <div class="col-sm-12 col-md-4 ">
                            <p class="text-left"> Nom de l'intervenant(e)
                                <select <?=(isCoordo() || isAdmin() || isDirection()) ? '' : 'readonly' ?> id="nomInter"
                                    name="??????" class="form-control" required>
                                    <option selected>Choix</option>
                                    <?php
                            $resultsIntervenant=getlistInter($pdo);
                            foreach ($resultsIntervenant as $intervenant){
                                
                                ?>
                                    <option value="<?php echo $intervenant["id_util"]?>">
                                        <?php echo "{$intervenant['nom']} {$intervenant['prenom']}"?></option>
                                    <?php } ?>
                                </select>
                            </p>
                        </div>

                        <!-- Catégorie -->
                        <div class="col-sm-12 col-md-4">
                            <p class="text-left">Catégorie
                                <select <?=(isCoordo() || isAdmin() || isDirection()) ? '' : 'readonly' ?> id="catInter"
                                    class="form-control" name="cat_intervenant" required>
                                    <option selected>Choix</option>
                                    <?php
                            $resultsCatInter=getlistCatInter($pdo);
                            foreach ($resultsCatInter as $catinter){
    
                            ?>
                                    <option value="<?php echo $catinter["ID_CAT_INTER"]?>">
                                        <?php echo $catinter["cat_intervenant"]?></option>
                                    <?php } ?>
                                </select>
                            </p>
                        </div>

                        <!-- Type heures-->
                        <div class="col-sm-12 col-md-4">
                            <p class="text-left">Type heures
                                <select <?=(isCoordo() || isAdmin() || isDirection()) ? '' : 'readonly' ?>
                                    class="form-control" id="heuresInter" name="type_heure_inter" required>
                                    <option selected>Choix</option>
                                    <?php
                            $resultsHeuresInter=getlistType($pdo);
                            foreach ($resultsHeuresInter as $typeHeure){
                            ?>
                                    <option value="<?php echo $typeHeure["ID_TYPEHEURES_INTER"]?>">
                                        <?php echo $typeHeure["type_heure_inter"]?></option>
                                    <?php } ?>
                                </select>
                            </p>
                        </div>
                    </div>

                    <!-- Nature des heures -->
                    <div id="coordobis" class="row m-2">
                        <div class="col-sm-12 col-md-4 ">
                            <p class="text-left"> Nature des heures
                                <input <?=(isCoordo() || isAdmin() || isDirection()) ? '' : 'readonly' ?> type="text"
                                    id="typeheuresInter" class="form-control" value="" name="" required>
                            </p>
                        </div>

                        <!-- Nombre d'heures = à calculer automatiquement via le calendrier API -->
                        <div class="col-sm-12 col-md-4 ">
                            <p class="text-left"> Nombre d'heures
                                <input <?=(isCoordo() || isAdmin() || isDirection()) ? '' : 'readonly' ?> type="number"
                                    class="form-control" id="nbheuresInter" placeholder="Calcul auto" readonly value=""
                                    name="" required>
                            </p>
                        </div>

                        <!-- Tarif -->
                        <div class="col-sm-12 col-md-4 ">
                            <p class="text-left"> Tarif
                                <input <?=(isCFP() || isAdmin() || isDirection()) ? '' : 'readonly' ?> type="number"
                                    class="form-control" id="tarif" value="" name="" />
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <?php
                if(isAdmin() || isDirection() || isCoordo()){?>

            <!-- Bouton ajouter ligne intervenant  -->

            <div class="button text-center mt-3">
                <button type="button" id="ajouter" class="btn btn-warning btn-sm">Ajouter un intervenant</button>
            </div>

            <?php }?>

            <!-- SCRIPT JQUERY POUR DUPLIQUER LE FORMULAIRE -->

            <script>
    $(function () {
      $("#ajouter").on("click", function () {
        //ici tu sélectionnes ce que tu souhaites cloner par rapport au btn (this)
        var inter = $(this).closest("#listeinter").clone(true);
        // et la tu indiques l'emplacement du clone en gros
        $(this).closest("#listeinter").after(inter);
      });
    }); 
  </script>

            <script>/*
            $(document).ready(function() {
                const nbchildren = $("#listeinter").children().length;
                $("#ajouter").click(function(e) {
                    e.preventDefault();
                    $("#listeinter").append(`       
                   
                    <!-- Nom de l'intervenant -->
                    <div id="coordo${nbchildren+1}">

                <div class="row m-2">
                    <div class="col-sm-12 col-md-4 ">
                        <p class="text-left"> Nom de l'intervenant(e)
                            <select id="nomInter" name="??????" class="form-control" required>
                                <option selected>Choix</option>
                                <?php
                            $resultsIntervenant=getlistInter($pdo);
                            foreach ($resultsIntervenant as $intervenant){
                                
                                ?>
                                <option value="<?php echo $intervenant["id_util"]?>">
                                    <?php echo "{$intervenant['nom']} {$intervenant['prenom']}"?></option>
                                <?php } ?>
                            </select>
                        </p>
                    </div>
                    <!-- Catégorie -->
                    <div class="col-sm-12 col-md-4">
                        <p class="text-left">Catégorie
                            <select id="catInter" class="form-control" name="cat_intervenant" required>
                                <option selected>Choix</option>
                                <?php
                            $resultsCatInter=getlistCatInter($pdo);
                            foreach ($resultsCatInter as $catinter){
    
                            ?>
                                <option value="<?php echo $catinter["ID_CAT_INTER"]?>">
                                    <?php echo $catinter["cat_intervenant"]?></option>
                                <?php } ?>
                            </select>
                        </p>
                    </div>
                    <!-- Type heures-->
                    <div class="col-sm-12 col-md-4">
                        <p class="text-left">Type heures
                            <select class="form-control" id="heuresInter" name="type_heure_inter" required>
                                <option selected>Choix</option>
                                <?php
                            $resultsHeuresInter=getlistType($pdo);
                            foreach ($resultsHeuresInter as $typeHeure){
                            ?>
                                <option value="<?php echo $typeHeure["ID_TYPEHEURES_INTER"]?>">
                                    <?php echo $typeHeure["type_heure_inter"]?></option>
                                <?php } ?>
                            </select>
                        </p>
                    </div>
                </div>
                <!-- Nature des heures -->
                <div id="coordobis" class="row m-2">
                    <div class="col-sm-12 col-md-4 ">
                        <p class="text-left"> Nature des heures
                            <input type="text" id="typeheuresInter" class="form-control" value="" name="" required>
                        </p>
                    </div>
                    <!-- Nombre d'heures = à calculer automatiquement via le calendrier API -->
                    <div class="col-sm-12 col-md-4 ">
                        <p class="text-left"> Nombre d'heures
                            <input type="number" class="form-control" id="nbheuresInter" placeholder="Calcul auto" readonly value=""
                                name="" required>
                        </p>
                    </div>
                    <!-- Tarif -->
                    <div class="col-sm-12 col-md-4 ">
                        <p class="text-left"> Tarif
                            <input type="number" class="form-control" id="tarif" value="" name="">
                        </p>
                    </div>
                </div>
            </div>
            <!-- Bouton ajouter ligne intervenant  -->
            <div class="button text-center mt-3">
                <button type="button" id="supprimer" class="btn btn-danger btn-sm">Supprimer</button>
            </div>
            </div>`)


                });
                $(document).on('click', '#supprimer', function() {
                    const nbchildren = $("#listeinter").children().length;
                    console.log($("#coordo" + nbchildren-1))
                    $("#coordo" + nbchildren-1).remove();
                    // $(row).remove();
                });




                // Requête AJAX pour insérer en BDD
                $("#formcoordo").submit(function(e) {
                    e.preventDefault();
                    $("register-submit").val('Enregistrement...');
                    $.ajax({
                        url: 'functions/actions.php',
                        method: 'post',
                        data: $(this).serialize,
                        success: function(response) {
                            console.log(response);
                        }
                    })
                });
            });
            */
            </script>



            <!-- Commentaire -->
            <div class="row m-2">
                <div class="col-12">
                    <div class="form-group text-left">
                        <p class="text-left">Commentaire</p>
                        <textarea <?=(isCoordo() || isAdmin() || isDirection()) ? '' : 'readonly' ?>
                            class="form-control" rows="2"></textarea>
                    </div>
                </div>
            </div>


            <?php
        if(isAdmin() || isDirection() || isCoordo()){
            ?>

            <!-- Boutons -->
            <div class="row justify-content-center">
                <div class="m-3">
                    <button type="button" name="register-submit" class="btn btn-success">Valider</button>
                </div>
            </div>
        </div>
        <?php
    }
    ?>
    </form>

    <!-- ******** 4eme partie - Service Gestion ******** -->
    <form>

        <div class="card m-5 text-center bg-light">

            <!-- Titre centre -->
            <div class="card m-5 p-2 text-center" id="subtitle">
                <h5>Partie à remplir par le service gestion</h5>
            </div>

            <!-- Numéro d'action -->
            <div class="row m-2">
                <div class="col-sm-12 col-md-4 ">
                    <p class="text-left"> Numéro d'action
                        <input <?=(isServiceGestion() || isAdmin() || isDirection()) ? '' : 'readonly' ?> type="number"
                            class="form-control" value="" name="" required>
                    </p>
                </div>

                <!-- Code PROGRE -->
                <div class="col-sm-12 col-md-4 ">
                    <p class="text-left"> Code PROGRE
                        <input <?=(isServiceGestion() || isAdmin() || isDirection()) ? '' : 'readonly' ?> type="number"
                            class="form-control" value="" name="" required>
                    </p>
                </div>

                <!-- Nombre de semaine -->
                <div class="col-sm-12 col-md-4 ">
                    <p class="text-left"> Nombre de semaine
                        <input <?=(isServiceGestion() || isAdmin() || isDirection()) ? '' : 'readonly' ?> type="number"
                            class="form-control" placeholder="Calcul auto" readonly value="" name="" required>
                    </p>
                </div>
            </div>

            <!-- Commentaire -->
            <div class="row m-2">
                <div class="col-12">
                    <div class="form-group text-left">
                        <p class="text-left">Commentaire</p>
                        <textarea <?=(isServiceGestion() || isAdmin() || isDirection()) ? '' : 'readonly' ?>
                            class="form-control" id="exampleFormControlTextarea1" rows="2"></textarea>
                    </div>
                </div>
            </div>

            <?php
                             if(isServiceGestion() || isDirection() || isAdmin() || isCFP()){
                            ?>

            <!-- Boutons -->
            <div class="row justify-content-center">
                <div class="m-3">
                    <button type="button" name="register-submit" class="btn btn-success">Valider</button>
                </div>

                <?php
                             }
                        ?>
                <div class="m-3">
                    <button type="button" class="btn btn-info">Imprimer</button>
                </div>

            </div>
    </form>
</main>

<!-- Faire calendrier de formation via une API ?-->
<!-- Faire tableau calcul automatique des heures en JS -->
</div>
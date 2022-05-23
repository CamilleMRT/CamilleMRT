<?php
//chargement des paramètres de la BD et connexion
include('./utils/db.php');
include('./functions/actionsGestionResa.php');
?>

<!-- FORMULAIRE -->
<main role="main" class="col-md-9 ml-sm-auto px-md-4">
    <div class="card m-3 text-center bg-light">
        <div class="card-header" id="title">
            <h3 class="m-2">Ajouter un élément à la réservation</h3>
        </div>

        <div class="container mt-5">
            <div class="row">
                <div class="col-sm-12 col-md-3">
                    <form id="register-util" action="index.php?page=admin/gestionresa" method="post" role="form">
                        <div class="form-group">
                            <select name="catégorie" id="cat" class="form-control" autocomplete="off" required>
                                <option selected>Catégorie matériel</option>
                                <?php 
                        $resultsmateriel=getlistMat($pdo);
                            foreach ($resultsmateriel as $nom_cat_mat){
                            ?>

                            <option value="<?php echo $nomCatMat["id_cat_mat"]?>">
                                <?php echo $nom_cat_mat["nom_cat_mat"]?></option>
                            <?php } ?>
                            </select>
                        </div>
                </div>

                <div class="col-sm-12 col-md-3">
                    <div class="form-group">
                        <select name="marque" id="marque" class="form-control" autocomplete="off" required>
                            <option selected>Marque</option>
                            <?php 
                        $resultsmarques=getlistMarques($pdo);
                            foreach ($resultsmarques as $nomMarque){
                            ?>

                            <option value="<?php echo $nom_marque["id_marque"]?>">
                                <?php echo $nom_marque["nom_marque"]?></option>
                            <?php } ?>
                            </select>
                        </select>
                    </div>
                </div>
                <div class="col-sm-12 col-md-3">
                    <div class="form-group">
                        <input type="text" name="nom_materiel" id="libelle" class="form-control" placeholder="Libellé"
                            autocomplete="off" required>
                    </div>
                </div>

                <div class="col-sm-12 col-md-3">
                    <div class="form-group">
                        <select class="form-control" name="site" id="site">
                            <option selected>Site de réservation</option>
                            <?php
                                  
                                  $resultsSite=getlistSite($pdo);
                                      foreach ($resultsSite as $site){
          
                                      ?>
                                      <option value="<?php echo $site["lieu_formation"]?>">
                                          <?php echo $site['lieu_formation']?></option>
                                      <?php } ?>
                            
                        </select>
                    </div>
                </div>
            </div>
            <!-- Boutons -->
            <div class="row justify-content-center">
                <div class="m-3">
                    <input type="submit" name="ajoutMat" class="btn btn-success" value="Enregistrer">
                </div>
            </div>
        </div>

    </div>
    </form>

    <!-- DATATABLE LISTE MATERIEL RESERVABLE -->
    <div class="card m-3 text-center">
        <div class="card-header" id="title">
            <h3 class="m-2">Liste des éléments à la réservation</h3>
        </div>

        <div class="card mb-5 p-3 d-flex flex-row align-items-center">
            <div class="container mt-5">

                <div class="table-responsive">
                    <table id="materiel" class="table table-hover text-left">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Catégorie</th>
                                <th>Marque</th>
                                <th>Libellé</th>
                                <th>Site de réservation</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <script>
        $(document).ready(function() {
    $('#materiel').DataTable();
});

// SCRIPT BTN SUPPRIMER
function suppression_utilisateur(id_util) {
    Swal.fire({
        title: 'Supprimer un contact !',
        text: "Souhaitez vous supprimer ce contact ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Supprimer !'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location = "index.php?page=admin/profilutil&id_util" + id_util;
        }
    })
}

// AJOUTER DES BOUTONS EXTRACTION
$(document).ready(function() {
    $('#tableutil').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    });
});
</script>

<!-- DATATABLE LISTE DES RESERVATIONS UTILISATEURS -->
<div class="card m-3 text-center">
    <div class="card-header" id="title">
        <h3 class="m-2">Liste des réservations utilisateurs</h3>
    </div>
    <div class="card mb-5 p-3 d-flex flex-row align-items-center">
        <div class="container mt-5">

            <div class="table-responsive">
                <table id="resaUtil" class="table table-hover text-left">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Service</th>
                            <th>Réservation</th>
                            <th>Dates</th>
                            <th>Modifier</th>
                            <th>Supprimer</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
</main>
<script>
$(document).ready(function() {
    $('#resaUtil').DataTable();
});

// SCRIPT BTN SUPPRIMER
function suppression_utilisateur(id_util) {
    Swal.fire({
        title: 'Supprimer un contact !',
        text: "Souhaitez vous supprimer ce contact ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Supprimer !'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location = "index.php?page=admin/profilutil&id_util" + id_util;
        }
    })
}

// AJOUTER DES BOUTONS EXTRACTION
$(document).ready(function() {
    $('#tableutil').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    });
});
</script>
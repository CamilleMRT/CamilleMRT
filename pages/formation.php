    <!-- APPELER DB POUR TABLEAU DATABASE -->
    <?php 
    include('utils/db.php');
    include('functions/actions.php');

    $stmtformation = $pdo->prepare("SELECT * FROM formations");
    $stmtformation->execute();
    $resultformation=$stmtformation->fetchAll(PDO::FETCH_ASSOC);

    // SUPPRIMER FICHE ACTION
    if (isset($_POST['supprimerAction'])){
        deleteAction($pdo, $_POST);
    }
    ?>

    <!-- TITRE PAGE -->

    <main role="main" id="datatable" class="flex-wrap col-md-9 md-ml-sm-auto">
        <div class="card m-3 text-center">
            <div class="card-header" id="title">
                <h3>Formations

            </div>
            <!-- CREER FICHE ACTION -->
            <?php
                        if (isAdmin() || isDirection() || isCFP()) {
                            ?>
            <div class="text-center">
                <a class='btn btn-xs col-md-3 mt-4' id="btnCreate" href="index.php?page=actions/ficheaction">
                    Créer une fiche action <br>
                    <i class="fa-solid fa-plus"></i></a>
                <?php
                }
                ?>
                </h3>
            </div>
            <br>



            <!-- LISTE FICHE ACTION -->

            <div class="card p-2 mt-5" id="subtitle">
                <h5 class="titreform">Liste fiches action</h5>
            </div>

            <!-- TABLE -->

            <div class="container">
                <div class="table-responsive mt-5">
                    <div class="row col-md-12">
                        <table class="table table-hover table-sm text-center" id="listeformation">
                            <thead>
                                <tr>
                                    <th>N° action</th>
                                    <th>Secteur</th>
                                    <th>Intitulé</th>
                                    <th>Site principal</th>
                                    <th>Site secondaire</th>
                                    <th>CFP Référent</th>
                                    <th>Date début</th>
                                    <th>Date fin</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                    foreach ($resultformation as $formation){
                                        echo "<tr>";
                                        echo "<td>".$formation['id_formation']. "</td>
                                        <td>".$formation['ID_SECTEUR_FORMATION']."</td>
                                        <td>".$formation['intitule_formation']."</td>
                                        <td>".$formation['id_site_formation']."</td>
                                        <td>".$formation['id_site_secondaire']."</td>
                                        <td>".$formation['cfp_ref_formation']."</td>
                                        <td>".$formation['datedebut_formation']."</td>
                                        <td>".$formation['datefin_formation']."</td>  
                                        <td>
                                        <a href='#' class='btn btn-success btn-xs'><i class='far fa-eye'></i></a>
                                        <a class='btn btn-info btn-xs' href='index.php?page=actions/ficheactionModif&id_action=".$formation['id_formation']."'>
                                        <i class='far fa-edit'></i></a>
                                    <form method='POST' action='index.php?page=formation' value=".$formation['id_formation'].">
                                    <button type='submit' name='supprimerAction' class='btn btn-danger btn-xs'>
                                        <i class='far fa-trash-alt'></i></button>
                                     </form>
                                </td>
                                </tr>";
                                    }
                                    ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <script>
            $(document).ready(function() {
                $('#listeformation').DataTable();
            });
            </script>



            <!-- CALENDRIER FORMATION GANTT -->
            <div class="card m-5" id="calendar">
                <h5 class="titreform">Calendrier des Formations</h5>
            </div>
            <p>EN COURS DE CONSTRUCTION</p>
        </div>




    </main>
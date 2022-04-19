    <!-- APPELER DB POUR TABLEAU DATABASE -->
    <?php 
    include('utils/db.php');

    $stmtformation = $pdo->prepare("SELECT * FROM formations");
    $stmtformation->execute();
    $resultformation=$stmtformation->fetchAll(PDO::FETCH_ASSOC);
    ?>

    <!-- TITRE PAGE -->

    <main role="main" id="datatable" class="col-md-9 md-ml-sm-auto">
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
                    <div class="row col-md-12 col-md-offset-2 custyle">
                        <table class="table table-hover table-sm text-center">
                            <thead>
                                <tr>
                                    <th>N° action</th>
                                    <th>Secteur</th>
                                    <th>Intitulé</th>
                                    <th>Niveau</th>
                                    <th>Parcours</th>
                                    <th>Lieu principal</th>
                                    <th>Site</th>
                                    <th>CFP Référent</th>
                                    <th>Date début</th>
                                    <th>Date fin</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>

                                <td>
                                    <a href="#" class="btn btn-success btn-xs"><i class="far fa-eye"></i></a>
                                    <a class='btn btn-info btn-xs' href="#">
                                        <i class="far fa-edit"></i></a>
                                    <a href="#" class="btn btn-danger btn-xs">
                                        <i class="far fa-trash-alt"></i></a>
                                </td>
                                <?php
                                    foreach ($resultformation as $formation){
                                        echo "<tr>";
                                        echo "<td>".$formation['ID_FORMATION']. "</td>
                                        <td>".$formation['ID_SECTEUR_FORMATION']."</td>
                                        <td>".$formation['intitule_formation']."</td>
                                        <td>".$formation['niveau_formation']."</td>
                                        <td>".$formation['ID_PARCOURS']."</td>
                                        <td>".$formation['id_site_formation']."</td>
                                        <td>".$formation['cfp_ref_formation']."</td>
                                        <td>".$formation['datedebut_formation']."</td>
                                        <td>".$formation['datefin_formation']."</td>";                                                                             
                                        
                                    }
                                  
                                    ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- CALENDRIER FORMATION GANTT -->
            <div class="card m-5" id="calendar">
                <h5 class="titreform">Calendrier des Formations</h5>
            </div>
        </div>




    </main>
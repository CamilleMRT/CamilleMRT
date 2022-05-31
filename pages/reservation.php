<!-- RESERVATION -->

<main role="main" class="col-md-9 ml-sm-auto px-md-4">
    <div class="card m-3 text-center bg-light">
        <div class="card-header" id="title">
            <h3 class="m-3">Réservations</h3>
        </div>
        <br>

        <!-- FORMULAIRE RESERVATION -->
        <h4>Créer une réservation</h4>

        <div class="container mt-4">
            <div class="row m-2">
                <div class="col-sm-12 col-md-4">
                    <form id="register-form" action="" method="POST" role="form">
                        <p class="text-left ">Nom</p>
                        <input type="text" name="nom" id="nom" tabindex="1" class="form-control"
                            placeholder="<?php echo $_SESSION['nom']?>" value="<?php echo $_SESSION['nom']?>" readonly>
                </div>

                <div class="col-sm-12 col-md-4">
                    <p class="text-left">Prénom</p>
                    <input type="text" name="prenom" id="prenom" tabindex="1" class="form-control"
                        placeholder="<?php echo $_SESSION['prenom']?>" value="<?php echo $_SESSION['prenom']?>"
                        readonly>
                </div>
                <div class="col-sm-12 col-md-4">
                    <p class="text-left">Adresse e-mail</p>
                    <input type="email" name="email" id="email" tabindex="1" class="form-control"
                        placeholder="<?php echo $_SESSION['email']?>" value="<?php echo $_SESSION['email']?>" readonly>
                </div>
            </div>
            <div class="row m-2">
                <div class="col-sm-12 col-md-4 mt-3">
                    <p class="text-left m-0">Date de la demande</p>
                    <input type="text" name="date" id="date" tabindex="1" class="form-control"
                        placeholder="<?php echo date('d/m/Y');?>" value="" readonly>
                </div>

                <div class="col-sm-12 col-md-4 mt-3">
                    <p class="text-left"> Date de début de réservation
                        <input type="date" class="form-control" value="" name="datedebut_réservation" required>
                    </p>
                </div>

                <div class="col-sm-12 col-md-4 mt-3">
                    <p class="text-left"> Date de fin de réservation
                        <input type="date" class="form-control" value="" name="datefin_réservation" required>
                    </p>
                </div>
            </div>

            <div class="row m-2">
                <div class="col-sm-12 col-md-4 mt-2">
                    <p class="text-left m-0">Type de réservation</p>
                    <select class="custom-select" aria-label="Default select example">
                        <option value="" selected>Choix</option>
                        <option value="">Matériel</option>
                        <option value="">Véhicule</option>
                        <option value="">Salle</option>
                    </select>
                </div>
                <div class="col-sm-12 col-md-6 mt-2">
                    <p class="text-left m-0">Sélection</p>
                    <select class="custom-select" aria-label="Default select example">
                        <option value="" selected>Choix</option>
                        <option value="">ACER - Ordinateur</option>
                        <option value="">RENAULT - Clio</option>
                        <option value="">GRETA CFA 49 - SALLE 122</option>
                    </select>
                </div>
            </div>
            <!-- Commentaire -->
            <div class="row m-2">
                <div class="col-12 mt-3">
                    <div class="form-group text-left mb-5">
                        <p class="text-left">Commentaire</p>
                        <textarea class="form-control" rows="2"></textarea>
                    </div>
                </div>
            </div>

            <input type="submit" name="register-submit" id="register-submit" tabindex="4" class="btn btn-success mb-5"
                value="Soumettre la demande">
            </form>
        </div>
    </div>

    <!-- LISTE RESERVATIONS -->
    <div class="card m-3 text-center bg-light">
        <div class="card-header" id="title">
            <h3 class="m-3">Historique de mes réservations</h3>
        </div>
        <br>

        <!-- TABLE -->
        <div class="container m-2">
            <div class="table-responsive mx-auto">
                <div class="row col-md-12 col-md-offset-2 custyle col-sm-12">
                    <table class="table table-hover table-sm">
                        <caption>Tableau historique des réservations</caption>
                        <thead>
                            <tr>
                                <th>N° réservation</th>
                                <th>Type</th>
                                <th>Date début</th>
                                <th>Date fin</th>
                                <th>Site</th>
                                <th>Modifier</th>
                            </tr>
                        </thead>

                    </table>
                </div>
            </div>
        </div>
    </div>
    </div>
</main>
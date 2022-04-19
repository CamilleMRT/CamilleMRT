<!-- APPELER DB POUR TABLEAU DATABASE -->
<?php 
    include('utils/db.php');
    include ('configs/values.php');

    $stmtgroupe = $pdo->prepare("SELECT * FROM utilisateursgreta");
    $stmtgroupe->execute();
    $resultgroupe=$stmtgroupe->fetchAll(PDO::FETCH_ASSOC);
    ?>



<!-- FORMULAIRE -->
<main role="main" class="col-md-9 ml-sm-auto px-md-4">
    <div class="card m-3 text-center bg-light">
        <div class="card-header" id="title">
            <h3 class="m-2">Créer un utilisateur</h3>
        </div>

        <div class="container mt-5">
            <div class="row">
                <div class="col-sm-12 col-md-4">
                    <form id="register-util" action="index.php?page=admin/profilutil" method="post" role="form">
                        <div class="form-group">
                            <input type="text" name="nom" id="nom" class="form-control" placeholder="Nom"
                                autocomplete="off" required>
                        </div>
                </div>

                <div class="col-sm-12 col-md-4">
                    <div class="form-group">
                        <input type="text" name="prenom" id="prenom" class="form-control" placeholder="Prénom"
                            autocomplete="off" required>
                    </div>
                </div>
                <div class="col-sm-12 col-md-4">
                    <div class="form-group">
                        <input type="email" name="email" id="email" class="form-control" placeholder="Email"
                            autocomplete="off" required>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12 col-md-4">
                    <div class="form-group">
                        <select class="form-control" name="groupe" id="groupe"
                            placeholder="Choix du groupe utilisateur">

                            <?php
                                    foreach ($groupe as $groupe ) {
                                    if ($groupe == $utilisateur['groupe']) {
                                        echo "<option selected value='$groupe '>$groupe </option>";
                                    } else {
                                        echo "<option value='$groupe '>$groupe </option>";
                                    }
                                }
                            ?>
                        </select>
                    </div>
                </div>

                <div class="col-sm-12 col-md-4">

                    <div class="form-group">
                        <input type="password" name="pwd" id="password" tabindex="2" class="form-control"
                            placeholder="Mot de passe" autocomplete="off" required>
                    </div>
                </div>

                <div class="col-sm-12 col-md-4">

                    <div class="form-group">
                        <input type="password" name="pwd" id="password" tabindex="2" class="form-control"
                            placeholder="Confirmation mot de passe" autocomplete="off" required>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group">
            <input type="submit" name="creer" tabindex="4" class="btn btn-success mt-4" value="Inscription">
        </div>
        </form>


        <!-- PASSWORD -->
        <!-- Script pour afficher / masquer password -->
        <script>
        function afficher() {
            const password = document.querySelector("#password");
            const eye = document.querySelector("#eye");

            if (password.type == "password") {
                // cas où la valeur du pwd est cachée
                password.type = "text";
                eye.src = "./public/img/eye-slash.svg";
            } else {
                password.type = "password";
                eye.src = "./public/img/eye.svg";
            }
        }
        </script>
    </div>
    <div class="card m-3 text-center">
        <div class="card-header" id="title">
            <h3 class="m-2">Liste des utilisateurs</h3>
        </div>


<!-- SCRIPT VALIDATION FORMULAIRE -->
<script>
$('#register-util').validate({
    rules: {
        nom:{
            required: true,
            minlength:2
        },
        prenom:{
            required:true,
            minlength:2
        },
        email:{
            required: true,
            maxlength: 255
        },
        groupe:"required",
        password: "required",
        passconfirm:{
            required: true,
            equalTo: "#password"
        }
    },
    // MESSAGE MOT DE PASSE QUI NE CORRESPOND PAS
    messages:{
        passconfirm:{
            equalTo:"Vous devez saisir le même mot de passe"
        }
    },
    // LE FORMULAIRE NE S'ENVOI PAS SI LES CHAMPS SONT INCORRECTS
    errorClass: "invalid",
    submitHandler:function(form){
        if(form.valid()){
            form.submit();
        }
        return false;
    }
});

// VERIFIER CONFORMITE ADRESSE EMAIL
$.validator.addMethod('email', function(value) {
    if (value.length > 0) {
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
    }
    return true;
  }, 'le format de l\'email est invalide.');

  // VERIFICATION REGEX MOT DE PASSE
  $.validator.addMethod('password', function(value) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z\d])\S{12,50}$/.test(value);
  }, 'Le mot de passe doit avoir plus de 12 caractères, au moins une majuscule, une minuscule, un chiffre et un caractère spécial');

</script>


        <!-- DATATABLE -->

        <div class="card mb-5 p-3 d-flex flex-row align-items-center">
            <div class="container mt-5">

                <div class="table-responsive">
                    <table id="utilisateur" class="table table-hover text-left">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Service</th>
                                <th>Email</th>
                                <th>Modifier</th>
                                <th>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>


                            <?php

                      foreach ($resultgroupe as $utilisateurs) {
                          ?>
                            <tr>
                                <td><?php echo $utilisateurs['id_util']; ?></td>
                                <td><?php echo $utilisateurs['nom']; ?></td>
                                <td><?php echo $utilisateurs['prenom']; ?></td>
                                <td><?php echo $utilisateurs['groupe']; ?></td>
                                <td><?php echo $utilisateurs['email']; ?></td>

                                <td><a class='btn btn-info btn-xs'
                                        href="index.php?page=admin/profilutil&id=<?= $utilisateurs['id_util'] ?>">
                                        <i class="far fa-edit"></i></a></td>
                                <td><a class="btn btn-danger btn-xs" name="supprimer"
                                        onclick="suppression_utilisateur(<?= $utilisateurs['id_util'] ?>)">
                                        <i class="far fa-trash-alt"></i></a></td>
                            </tr>
                            <?php
                      }  
                      ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

</main>
<script>
$(document).ready(function() {
    $('#utilisateur').DataTable();
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
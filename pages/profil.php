<?php
include ('./functions/actionsGestionConnexion.php')
?>

<div class="profilutil">
    <main role="main" class="col-md-9 ml-sm-auto px-md-4">
        <div class="card m-3 text-center bg-light">
            <div class="card-header" id="title">
                <h3 class="m-3">Mon profil</h3>
            </div>
            <div class="profilebis mt-3">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="row">
                <div class="col-md-6 col-sm-12 text-left ml-5 mt-4">
                    <p><strong>Nom :</strong> <?php echo $_SESSION['nom'] ?></p>
                    <p><strong>Prénom :</strong> <?php echo $_SESSION['prenom'] ?></p>
                    <p><strong>Email :</strong> <?php echo $_SESSION['email'] ?></p>
                    <p><strong>Groupe :</strong> <?php echo $_SESSION['groupe'] ?></p>
                </div>

                <div class="col-md-4 col-sm-12 text-center ml-5">
                    <form action="" class="" id="update-pwd">
                        <h6><strong>Modifier mon mot de passe</strong></h6>
                        <div class="input-group p-2" id="formpwd">
                            <input type="password" class="form-control" placeholder="Nouveau mot de passe"
                                name="password" id="password">
                        </div>
                        <div class="input-group p-2" id="formpwd">
                            <input type="password" class="form-control" placeholder="Confirmer mot de passe"
                                name="passconfirm" id="passconfirm">
                        </div>
                <button id="updatepwd" onclick="alert('Modification validée, vous allez être redirigé vers la page de connexion')" class="btn btn-success m-3">Valider la modification</button>
            </form>
        </div>
    </div>
</div>

<!-- SCRIPT VALIDATION FORMULAIRE -->
<script>
$('#update-pwd').validate({
    rules: {
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
  
});

  // VERIFICATION REGEX MOT DE PASSE
  $.validator.addMethod('password', function(value) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z\d])\S{8,50}$/.test(value);
  }, 'Le mot de passe doit contenir au minimum 8 caractères, au moins une majuscule, une minuscule, un chiffre et un caractère spécial');

</script>
</div>
</main>
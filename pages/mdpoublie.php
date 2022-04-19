<div class="background">
       <div class="shape"></div>
       <div class="shape"></div>
   </div>

   <div class="form">

       <form action="index.php?page=authentification" method="POST">
           <!-- action = fichier qui enregistrera en bdd les valeurs saisies -->

           <img class="d-block mx-auto" src="public/img/logo-gretapdl.png" alt="logo">

           <!-- EMAIL -->
           <div>
               <input type="text" class="form-control text-center mt-5" placeholder="Identifiant" name="email"
                   id="email" autocomplete="off" onFocus="email" required>

           </div>

           <!-- PASSWORD -->
           <div class="input-group">
               <input type="password" class="form-control text-center" placeholder="Mot de Passe" name="pwd"
                   id="password" required>
               <div class="input-group-prepend">
                   <span class="input-group-text">
                       <img id="eye" src="./public/img/eye.svg" onclick="afficher()" alt=""></span>
               </div>
           </div>


           <!-- SCRIPT REGLES DE CONNEXION PASSWORD
           /*  function controlPwd(elemPwd) {
              const pwd = String(elemPwd.value);
              if (!pwd.match(/[0-9]/g) ||
                  !pwd.match(/[A-Z]/g) ||
                  !pwd.match(/[a-z]/g) ||
                  !pwd.match(/[^a-zA-Z\d]/g) ||
                  pwd.length < 12) {
                      //mot de passe invalide
                      elemPwd.validity.valid = "false";
                      //info bulle sur le type d'erreur
                      elemPwd.setCustomValidity("Votre mot de passe doit comporter au moins une majuscule, minuscule, chiffre et signe de ponctuation");
                  } else {
                      //nettoyage de l'invalidité de la zone
                      elemPwd.validity.valid = "true";
                      elemPwd.setCustomValidity("");
                  }
             } */
           </script> -->

           <div class="container">
               <div class="row">
                   <div class="col text-center">
                       <div>
                           <label for="connexion"></label>
                           <input class="btn btn-info my-2" type="submit" value="Connexion" name="connexion"
                               id="connexion">
                       </div>

                   </div>
               </div>
           </div>
       </form>


       <!-- Si incorrecte afficher message -->


       <div class="text-center">

           <a href="mailto:camillemarante@gmail.com" id="assistance" class="text-dark">Assistance technique</a>

       </div>
   </div>
   </div>

   </div>
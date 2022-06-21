  <div class="background">
      <div class="shape"></div>
      <div class="shape"></div>
  </div>

  <div class="form">

      <form action="index.php?page=authentification" method="POST">
          <img class="d-block mx-auto" src="public/img/logo-gretapdl.png" alt="logo">

          <!-- EMAIL -->
          <div>
              <input type="text" class="form-control text-center mt-5" placeholder="Identifiant" name="email"
                  id="emailco" autocomplete="off" onFocus="email" required>

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
          <!-- Message d'erreur de connexion -->
          <?php
                if (isset($_SESSION["etatConnexion"]) && 
                $_SESSION["etatConnexion"] == 0) {
                echo 
                "<p class=text-center>Identifiant ou 
                mot de passe incorrect</p>";
                }
                ?>

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

          <div class="text-center">

              <script>
              function redirection() {
                  const email = $('#emailco').val();
                  window.location.href = "index.php?page=mdpoublie&email=" + email;
              }
              </script>

              <a href="#" id="mdp" class="text-dark" onclick="redirection()">Mot de passe oublié ?</a>

          </div>

          <div class="text-center">

              <a onclick="window.location.href='mailto:camillemarante@gmail.com'" id="assistance"
                  class="text-dark">Assistance technique</a>

      </form>
  </div>
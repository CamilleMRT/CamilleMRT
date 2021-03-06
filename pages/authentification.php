<?php 
    //vérification de l'existance de l'identifiant et du mot de passe.
    //chargement des paramètres de la BD et connexion
    include('./utils/db.php');
        $username = htmlspecialchars($_POST['email']);
        $pwd = $_POST['pwd'];
        $stmt = $pdo->prepare("SELECT * FROM utilisateursgreta WHERE email=?");
        $stmt->execute([$username]);    
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        //il y a un résultat donc l'utilisateur existe, maintenant vérification du mot de passe
        $pwdHashBD = $result['pwd'];
        
        if (password_verify($pwd, $pwdHashBD)) {
            
            $_SESSION["etatConnexion"] = "1";
            //toutes les informations concernant l'utilisateur pourront être accessible durant la session
            $_SESSION["prenom"] = $result['prenom'];
            $_SESSION["nom"] = $result['nom'];
            $_SESSION["email"] = $result['email'];
            $_SESSION["id_util"] = $result['id_util'];
            $_SESSION["groupe"] = $result['groupe'];
            //redirection vers la page d'accueil
          header('Location: index.php?page=accueil');
          die();

        } else {
            //ce paramètre stocké en session permettra de savoir que la connexion a échoué
            //et donc d'afficher un message d'echec sur la page d'authentification
            $_SESSION["etatConnexion"] = "0";
            header('Location: index.php?page=connexion');
            echo "<p>Identifiant ou mot de passe incorrect</p>";
           die();
        }
    
    }
    ?>
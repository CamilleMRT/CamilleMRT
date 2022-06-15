<?php
ob_start();



?>
<!--
<header>
    <div class="header">
        <a href="index.php?page=accueil"><img class=logo src="./public/img/logo-gretapdl.png" alt="logo"></a>
        <h5>Bonjour <?php echo $_SESSION['prenom']?> !</h5>
        
    </div>
</header>

<!-- SIDEBAR 

<div class="side-navbar active-nav d-flex justify-content-between flex-wrap" id="sidebar">
      <ul class="nav flex-column text-black w-100">

      <div class="side-navbar-header">
                <a href="index.php?page=profil" class="profile"><i class="fas fa-user-circle"></i></a>
            </div>

        <li>
                    <a class="home" href="index.php?page=accueil"><i class="fas fa-home"></i> Accueil</a>
                </li>
                <li>
                    <a href="index.php?page=formation"><i class="far fa-folder-open"></i> Formations</a>
                </li>

                <li>
                    <a href="index.php?page=reservation"><i class="fa-regular fa-calendar-days"></i> Réservations</a>
                </li>

             <?php if (isAdmin()) {?>

                <li>
                    <a class="gestionutil" href="index.php?page=admin/profilutil">Gestion utilisateurs</a>
                </li>

                <li>
                    <a class="gestionresa" href="index.php?page=admin/gestionresa">Gestion réservations</a>
                </li>

                <?php }?>

                <li>
                    <a class="help" href="index.php?page=aide"><i class="far fa-question-circle"></i> Aide</a>
                </li>

                <li>
                    <a class="deconnexion" href="index.php?page=connexion"><i class="fas fa-sign-out-alt"></i>Déconnexion</a>
                </li>

            </ul>

      <span href="#" class="nav-link h4 w-100 mb-5">
        <a href=""><i class="fad fa-bars"></i></a>
        <a href=""><i class="bx bxl-twitter px-2 text-white"></i></a>
        <a href=""><i class="bx bxl-facebook text-white"></i></a>
      </span>
    </div>

    <!-- Main Wrapper 
    <div class="p-1 my-container active-cont">
      <!-- Top Nav 
      <nav class="navbar top-navbar px-5">
        <a class="btn border-0" id="menu-btn"><i class="fa-solid fa-bars"></i></a>
      </nav> 


    <!-- custom js 
    <script>
      var menu_btn = document.querySelector("#menu-btn");
      var sidebar = document.querySelector("#sidebar");
      var container = document.querySelector(".my-container");
      menu_btn.addEventListener("click", () => {
        sidebar.classList.toggle("active-nav");
        container.classList.toggle("active-cont");
      });
    </script>
    -->

<!-- TEST NAVBAR -->
<nav class="navbar navbar-expand-lg navbar-dark">
    <a class="navbar-brand mb-0 h1" href="" index.php?page=accueil"><img class=logo src="./public/img/logo-gretapdl.png"
            alt="logo"></a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#headNavigation">
        <span class="navbar-toggler-icon burger_icon"></span>
    </button>
    </div>
</nav>

<!-- Only For Mobile  -->

<nav class="navbar navbar-expand-lg navbar-dark d-none mobile_only">
    <div class="collapse navbar-collapse" id="headNavigation">
        <div class="side-navbar-header">
            <a href="index.php?page=profil" class="profile"><i class="fas fa-user-circle"></i></a>
            <h5>Bonjour <?php echo $_SESSION['prenom']?> !</h5>
        </div>
        <ul class="navbar-nav flex-column">
            <li class="nav-link active">
                <a class="home" href="index.php?page=accueil"><i class="fas fa-home"></i> Accueil</a>
            </li>
            <li class="nav-link">
                <a href="index.php?page=formation"><i class="far fa-folder-open"></i> Formations</a>
            </li>
            <li class="nav-link">
                <a href="index.php?page=reservation"><i class="fa-regular fa-calendar-days"></i> Réservations</a>
            </li>
            <?php if (isAdmin()) {?>

            <li class="nav-link">
                <a class="gestionutil" href="index.php?page=admin/profilutil">Gestion utilisateurs</a>
            </li>
            <li class="nav-link">
                <a class="gestionresa" href="index.php?page=admin/gestionresa">Gestion réservations</a>

            </li>
            <?php } ?>
            <li class="nav-link">
                <a class="help" href="index.php?page=aide"><i class="far fa-question-circle"></i> Aide</a>
            </li>
            <li class="nav-link">
                <a class="deconnexion" href="index.php?page=connexion"><i
                        class="fas fa-sign-out-alt"></i>Déconnexion</a>
            </li>
        </ul>
    </div>
</nav>

<!-- Left Side Sidebar -->

<div class="container-fluid">
    <div class="row">
        <div class="col-lg-2 d-none d-lg-block" id="nav-left">
            <div class="side-navbar-header">
                <a href="index.php?page=profil" class="profile"><i class="fas fa-user-circle"></i></a>
                <h5>Bonjour <?php echo $_SESSION['prenom']?> !</h5>

            </div>
            <ul class="navbar-nav flex-column">
                <li class="nav-link">
                    <a class="home" href="index.php?page=accueil"><i class="fas fa-home"></i> Accueil</a>
                </li>
                <li class="nav-link">
                    <a href="index.php?page=formation"><i class="far fa-folder-open"></i> Formations</a>
                </li>
                <li class="nav-link">
                    <a href="index.php?page=reservation"><i class="fa-regular fa-calendar-days"></i> Réservations</a>
                </li>
                <?php if (isAdmin()) {?>

                <li class="nav-link">
                    <a class="gestionutil" href="index.php?page=admin/profilutil">Gestion utilisateurs</a>
                </li>
                <li class="nav-link">
                    <a class="gestionresa" href="index.php?page=admin/gestionresa">Gestion réservations</a>
                </li>
                <?php } ?>
                <li class="nav-link">
                    <a class="help" href="index.php?page=aide"><i class="far fa-question-circle"></i> Aide</a>

                </li>
                <li class="nav-link">
                    <a class="deconnexion" href="index.php?page=connexion"><i
                            class="fas fa-sign-out-alt"></i>Déconnexion</a>

                </li>
            </ul>
        </div>
    </div>
</div>

<script>
var mobile = 1;
$('.burger_icon').click(function() {
    if (mobile == 1) {
        $(".mobile_only").addClass('d-block d-lg-none');
        mobile = 0;
    } else {
        setTimeout(function() {
            $(".mobile_only").delay(2000).removeClass('d-block d-lg-none');
        }, 300);
        mobile = 1;
    }
});
</script>
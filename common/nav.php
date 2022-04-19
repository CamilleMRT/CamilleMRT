<?php
ob_start();

include('./functions/utilisateurs.php');

?>

<header>
    <div class="header">
        <a href="index.php?page=accueil"><img class=logo src="./public/img/logo-gretapdl.png" alt="logo"></a>
        <h5>Bonjour <?php echo $_SESSION['prenom']?> !</h5>
        
    </div>
</header>

<!-- SIDEBAR -->

<div class="side-navbar active-nav d-flex justify-content-between flex-wrap flex-column" id="sidebar">
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
                    <a class="gestionresa" href="index.php?page=actions/gestionresa">Gestion réservations</a>
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

    <!-- Main Wrapper -->
    <div class="p-1 my-container active-cont">
      <!-- Top Nav -->
      <nav class="navbar top-navbar px-5">
        <a class="btn border-0" id="menu-btn"><i class="fa-solid fa-bars"></i></a>
      </nav>


    <!-- custom js -->
    <script>
      var menu_btn = document.querySelector("#menu-btn");
      var sidebar = document.querySelector("#sidebar");
      var container = document.querySelector(".my-container");
      menu_btn.addEventListener("click", () => {
        sidebar.classList.toggle("active-nav");
        container.classList.toggle("active-cont");
      });
    </script>
                


<!-- ANCIENNE NAV 
<nav>

    <div class="wrapper d-flex">
        <div class="sidebar">
            <div class="sidebar-header">
                <a href="index.php?page=profil" class="profile"><i class="fas fa-user-circle"></i></a>
            </div>
            <ul>

                <li>
                    <a class="home" href="index.php?page=accueil"><i class="fas fa-home"></i> Accueil</a>
                </li>
                <li>
                    <a href="index.php?page=formation"><i class="far fa-folder-open"></i> Formations</a>
                </li>

                <li>
                    <a href="index.php?page=reservation"><i class="fa-light fa-calendar-days"></i> Réservations</a>
                </li>

                <?php if (isAdmin()) {?>

<li>
    <a class="gestionutil" href="index.php?page=admin/profilutil"> <i
            class="fa-regular fa-address-card"></i> Gestion utilisateurs</a>
</li>

<li>
    <a class="gestionresa" href="index.php?page=actions/gestionresa"><i
            class="fa-light fa-calendar"></i> Gestion réservations</a>
</li>

<?php }?>

<li>
    <a class="help" href="index.php?page=aide"><i class="far fa-question-circle"></i> Aide</a>
</li>

<li>
    <a class="deconnexion" href="index.php?page=connexion"><i class="fas fa-sign-out-alt"></i>Déconnexion</a>
</li>

</ul>
</div>
</div> 
</nav> --> 
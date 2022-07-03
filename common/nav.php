<?php
ob_start();



?>
<!-- NAV LATERALE -->
<nav class="navbar navbar-expand-lg">
    <a class="navbar-brand mb-0 h1" href="index.php?page=accueil"><img class=logo src="./public/img/logo-gretapdl.png"
            alt="logo"></a>
    <button class="navbar-toggler" data-toggle="collapse" data-target="#headNavigation">
        <span class="navbar-toggler-icon burger_icon"><i class="fa-solid fa-bars"></i></span>
    </button>
    </div>
</nav>

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

<!-- NAV MOBILE -->
<nav class="navbar navbar-toggle d-none mobile_only">
    <div>
        <ul class="mobile-navbar-nav">
            <li class="nav-link active">
                <a class="home" href="index.php?page=accueil">Accueil</a>
            </li>
            <li class="nav-link">
                <a href="index.php?page=profil">Mon profil</a>
            </li>
            <li class="nav-link">
                <a href="index.php?page=formation">Formations</a>
            </li>
            <li class="nav-link">
                <a href="index.php?page=reservation">Réservations</a>
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
                <a class="help" href="index.php?page=aide">Aide</a>
            </li>
            <li class="nav-link">
                <a class="link-danger" href="index.php?page=connexion">Déconnexion</a>
            </li>
        </ul>
    </div>
</nav>

<script>
var mobile = 1;
$('.burger_icon').click(function() {
    if (mobile == 1) {
        $(".mobile_only").addClass('d-block');
        mobile = 0;
    } else {
        setTimeout(function() {
            $(".mobile_only").delay(2000).removeClass('d-block d-lg-none');
        }, 300);
        mobile = 1;
    }
});
</script>



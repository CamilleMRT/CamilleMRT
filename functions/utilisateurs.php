<?php

function isAdmin()
{
    return @$_SESSION['groupe'] == 'ADMIN';
}

function isDirection()
{
    return $_SESSION['groupe'] == 'DIRECTION';
}

function isCFP()
{
    return $_SESSION['groupe'] == 'CFP';
}

function isRespProd()
{
    return $_SESSION['groupe'] == 'RESPONSABLE_PRODUCTION';
}

function isAssistantForm()
{
    return $_SESSION['groupe'] == 'ASSISTANT_FORMATION';
}

function isCoordo()
{
    return $_SESSION['groupe'] == 'COORDONNATEUR';
}

function isIntervenant()
{
    return $_SESSION['groupe'] == 'INTERVENANT';
}

function isServiceGestion()
{
    return $_SESSION['groupe'] == 'SERVICE_GESTION';
}

function isFormateur()
{
    return $_SESSION['groupe'] ==' FORMATEUR';
}






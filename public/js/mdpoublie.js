//fonction qui vérifie que l'identifiant trouvé pour le token est le même que celui saisie par l'utilisateur
function verifUser(valMailToken) {
    const valUser = $('#email').val();
    if (valMailToken != valUser) {
        alert("l'identifant saisi n'est pas celui de la demande!");
    }
}

$('#recovery-form').validate({
    rules: {
        email: {
            required: true,
            minlength: 2
        },
        pwd: {
            required: true,
        },
        pwdConf: {
            required: true,
            equalTo: "#pwd"
        }
    },
    messages: {
        pwdConf: {
            equalTo: "Vous devez saisir le même mot de passe."
        }
    },
 /*   errorClass: "invalid",*/
    onsubmit: false,
    submitHandler: function(form) {
        if (form.valid()) {
            form.submit();
        }
        return false;
    }
});
$.validator.addMethod('pwd', function(value) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z\d])\S{12,50}$/.test(value);
}, 'Le mot de passe doit avoir plus de 12 caractères, au moins une majuscule, une minuscule, un chiffre et un caractère spécial');

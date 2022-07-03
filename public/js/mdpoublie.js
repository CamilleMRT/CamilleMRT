$('recovery-form').validate({
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
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(value);
}, 'Le mot de passe doit contenir 8 caractères minimum, au moins une majuscule, une minuscule, un chiffre et un caractère spécial');

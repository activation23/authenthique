$(document).ready(function() {
    const apiUrl = 'http://localhost:5000';
    const COOKIE_NAME = 'authToken';
    const COOKIE_EXPIRES_DAYS = 7;

    // Vérifier si l'utilisateur est déjà connecté
    const authToken = Cookies.get(COOKIE_NAME);
    if (authToken) {
        showWelcomeMessage();
    } else {
        showLoginForm();
    }

    function showLoginForm() {
        $('#authContainer').html(`
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Adresse Email</label>
                    <input type="email" class="form-control" id="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Mot de Passe</label>
                    <input type="password" class="form-control" id="password" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Connexion</button>
                <button type="button" class="btn btn-link btn-block" id="forgotPassword">Mot de Passe Oublié</button>
                <button type="button" class="btn btn-link btn-block" id="signUp">Créer un Compte</button>
            </form>
        `);

        $('#loginForm').submit(handleLogin);
        $('#forgotPassword').click(showForgotPasswordForm);
        $('#signUp').click(showSignUpForm);
    }

    function handleLogin(event) {
        event.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();

        fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                // Stocker le token dans un cookie
                Cookies.set(COOKIE_NAME, data.token, { expires: COOKIE_EXPIRES_DAYS });
                Swal.fire('Succès', data.message, 'success').then(() => showWelcomeMessage());
            } else {
                Swal.fire('Erreur', 'Identifiants incorrects', 'error');
            }
        })
        .catch(error => {
            Swal.fire('Erreur', 'Une erreur est survenue lors de la connexion', 'error');
        });
    }

    function showSignUpForm() {
        $('#authContainer').html(`
            <form id="signUpForm">
                <div class="form-group">
                    <label for="fullName">Nom Complet</label>
                    <input type="text" class="form-control" id="fullName" required>
                </div>
                <div class="form-group">
                    <label for="email">Adresse Email</label>
                    <input type="email" class="form-control" id="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Mot de Passe</label>
                    <input type="password" class="form-control" id="password" required>
                </div>
                <div class="form-group">
                    <label for="phoneNumber">Numéro de Téléphone</label>
                    <input type="tel" class="form-control" id="phoneNumber" required>
                </div>
                <div class="form-group">
                    <label for="country">Pays</label>
                    <select class="form-control" id="country">
                        <!-- Ajouter les options de pays ici -->
                    </select>
                </div>
                <button type="submit" class="btn btn-primary btn-block">S'inscrire</button>
                <button type="button" class="btn btn-link btn-block" id="login">Connexion</button>
            </form>
        `);

        $('#signUpForm').submit(handleSignUp);
        $('#login').click(showLoginForm);
    }

    function handleSignUp(event) {
        event.preventDefault();

        // Récupérer l'adresse IP
        $.getJSON('https://api.ipify.org?format=json', function(data) {
            const ipAddress = data.ip;
            const fullName = $('#fullName').val();
            const email = $('#email').val();
            const password = $('#password').val();
            const phoneNumber = $('#phoneNumber').val();
            const country = $('#country').val();

            fetch(`${apiUrl}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fullName, email, password, phoneNumber, country, ipAddress })
            })
            .then(response => response.json())
            .then(data => {
                Swal.fire('Succès', data.message, 'success')
                    .then(() => showVerificationForm());
            })
            .catch(error => {
                Swal.fire('Erreur', 'Une erreur est survenue lors de l\'inscription', 'error');
            });
        });
    }

    function showVerificationForm() {
        $('#authContainer').html(`
            <form id="verificationForm">
                <div class="form-group">
                    <label for="verificationCode">Code de Vérification</label>
                    <input type="text" class="form-control" id="verificationCode" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Confirmer</button>
            </form>
        `);

        $('#verificationForm').submit(handleVerification);
    }

    function handleVerification(event) {
        event.preventDefault();
        const verificationCode = $('#verificationCode').val();

        fetch(`${apiUrl}/verify_code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ verificationCode })
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire('Succès', data.message, 'success')
                .then(() => showWelcomeMessage());
        })
        .catch(error => {
            Swal.fire('Erreur', 'Une erreur est survenue lors de la vérification du code', 'error');
        });
    }

    function showForgotPasswordForm() {
        $('#authContainer').html(`
            <form id="forgotPasswordForm">
                <div class="form-group">
                    <label for="email">Adresse Email</label>
                    <input type="email" class="form-control" id="email" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Envoyer un Code de Réinitialisation</button>
                <button type="button" class="btn btn-link btn-block" id="login">Connexion</button>
            </form>
        `);

        $('#forgotPasswordForm').submit(handleForgotPassword);
        $('#login').click(showLoginForm);
    }

    function handleForgotPassword(event) {
        event.preventDefault();
        const email = $('#email').val();

        fetch(`${apiUrl}/forgot_password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire('Succès', data.message, 'success')
                .then(() => showResetPasswordForm());
        })
        .catch(error => {
            Swal.fire('Erreur', 'Une erreur est survenue lors de l\'envoi du code de réinitialisation', 'error');
        });
    }

    function showResetPasswordForm() {
        $('#authContainer').html(`
            <form id="resetPasswordForm">
                <div class="form-group">
                    <label for="resetCode">Code de Vérification</label>
                    <input type="text" class="form-control" id="resetCode" required>
                </div>
                <div class="form-group">
                    <label for="newPassword">Nouveau Mot de Passe</label>
                    <input type="password" class="form-control" id="newPassword" required>
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirmer le Nouveau Mot de Passe</label>
                    <input type="password" class="form-control" id="confirmPassword" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Réinitialiser le Mot de Passe</button>
            </form>
        `);

        $('#resetPasswordForm').submit(handleResetPassword);
    }

    function handleResetPassword(event) {
        event.preventDefault();
        const resetCode = $('#resetCode').val();
        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();

        if (newPassword !== confirmPassword) {
            Swal.fire('Erreur', 'Les mots de passe ne correspondent pas', 'error');
            return;
        }

        fetch(`${apiUrl}/reset_password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ resetCode, newPassword })
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire('Succès', data.message, 'success')
                .then(() => showLoginForm());
        })
        .catch(error => {
            Swal.fire('Erreur', 'Une erreur est survenue lors de la réinitialisation du mot de passe', 'error');
        });
    }

    function showWelcomeMessage() {
        $('#authContainer').html(`
            <div class="welcome-message">
                <h1>Bienvenue !</h1>
                <button class="btn btn-primary" id="logout">Déconnexion</button>
            </div>
        `);

        $('#logout').click(handleLogout);
    }

    function handleLogout() {
        // Supprimer le cookie d'authentification
        Cookies.remove(COOKIE_NAME);
        showLoginForm();
    }
});

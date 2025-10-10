document.addEventListener('DOMContentLoaded', () => {
    const submitLoginButton = document.getElementById('submitLogin');
    const usernameField = document.getElementById('usernameField');
    const passwordField = document.getElementById('passwordField');
    const submitRegisterButton = document.getElementById('submitRegister');
    const emailField = document.getElementById('emailField');
    const signupLabel = document.getElementById('signupLabel');
    const logInLabel = document.getElementById('logInLabel');

    if (submitLoginButton && usernameField && passwordField) {
        submitLoginButton.addEventListener('click', async () => {
            const username = usernameField.value;
            const password = passwordField.value;

            if (username.length > 24) {
                alert('El nombre de usuario no puede ser mayor a 24 caracteres');
                return;
            }
            if (password.length > 254) {
                alert('La contraseña no puede ser mayor a 254 caracteres');
                return;
            }

            try {
                const response = await fetch('https://enabled-elephant-presently.ngrok-free.app/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    const sessionId = response.headers.get('x-session-id');
                    localStorage.setItem('sessionId', sessionId);
                    const responseBody = await response.json();
                    localStorage.setItem('userId', responseBody.userId);
                    localStorage.setItem('username', responseBody.username);
                    localStorage.setItem('email', responseBody.email);
                    window.location.href = 'view.html';
                } else {
                    const errorText = await response.text();
                    alert(`Error: ${errorText}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Ocurrio un error al iniciar sesion.');
            }
        });
    }

    if (submitRegisterButton && usernameField && passwordField && emailField) {
        submitRegisterButton.addEventListener('click', async () => {
            const username = usernameField.value;
            const password = passwordField.value;
            const email = emailField.value;
            const pin = '000000'; 

            if (!email || !password || !username || !pin) {
                alert('Los campos no pueden estar vacios');
                return;
            }
            if (username.length > 24) {
                alert('El nombre de usuario no puede ser mayor a 24 caracteres');
                return;
            }
            if (email.length > 254 || password.length > 254) {
                alert('El email y la contraseña no pueden ser mayores a 254 caracteres');
                return;
            }
            if (pin.length !== 6) {
                alert('El pin debe ser de 6 digitos');
                return;
            }

            try {
                const response = await fetch('https://enabled-elephant-presently.ngrok-free.app/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify({ username, password, email, pin })
                });

                if (response.ok) {
                    alert('Bienvenido a inMind!');
                    window.location.href = 'index.html';
                } else {
                    const errorText = await response.text();
                    alert(`Error: ${errorText}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Ocurrio un error al registrar usuario.');
            }
        });
    }

    if (signupLabel) {
        signupLabel.addEventListener('click', () => {
            window.location.href = 'https://aledotcv.com/uni/notes/registrar.html';
        });
    }

    if (logInLabel) {
        logInLabel.addEventListener('click', () => {
            window.location.href = 'https://aledotcv.com/uni/notes/';
        });
    }
});
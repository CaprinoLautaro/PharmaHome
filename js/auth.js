// auth.js - Manejo de autenticación y sesión de usuario

// Función para registrar un nuevo usuario
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Verificar si hay una sesión activa al cargar la página
    checkSession();

    // Mostrar mensaje de registro exitoso si viene del registro
    showRegistrationSuccess();
});

function handleRegister(e) {
    e.preventDefault();

    const nombreCompleto = document.getElementById('nombreCompleto').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const cuil = document.getElementById('cuil').value;
    const tramiteDNI = document.getElementById('tramiteDNI').value;

    // Validaciones básicas
    if (!validateEmail(email)) {
        alert('Por favor, ingresa un correo electrónico válido.');
        return;
    }

    if (password.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres.');
        return;
    }

    // Verificar si el usuario ya existe
    const existingUsers = JSON.parse(localStorage.getItem('pharmahome_users') || '[]');
    const userExists = existingUsers.some(user => user.email === email);

    if (userExists) {
        alert('Ya existe un usuario registrado con este correo electrónico.');
        return;
    }

    // Crear nuevo usuario
    const newUser = {
        id: generateId(),
        nombreCompleto,
        email,
        password, // En una aplicación real, esto debería estar encriptado
        cuil,
        tramiteDNI,
        fechaRegistro: new Date().toISOString()
    };

    // Guardar usuario
    existingUsers.push(newUser);
    localStorage.setItem('pharmahome_users', JSON.stringify(existingUsers));

    // ✅ CAMBIO: Redirigir a la página de login en lugar de iniciar sesión automáticamente
    alert('¡Registro exitoso! Ahora puedes iniciar sesión con tus credenciales.');
    window.location.href = 'login.html?registro=exitoso';
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Buscar usuario
    const users = JSON.parse(localStorage.getItem('pharmahome_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Iniciar sesión
        loginUser(user);

        // Redirigir a la página principal
        window.location.href = '../index.html';
    } else {
        alert('Correo electrónico o contraseña incorrectos.');
    }
}

function loginUser(user) {
    // Guardar información de sesión
    const sessionData = {
        isLoggedIn: true,
        userId: user.id,
        userName: user.nombreCompleto,
        userEmail: user.email,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem('pharmahome_session', JSON.stringify(sessionData));

    // Actualizar la interfaz
    updateUIForLoggedInUser(user.nombreCompleto);
}

function logoutUser() {
    // Eliminar información de sesión
    localStorage.removeItem('pharmahome_session');

    // Actualizar la interfaz
    updateUIForLoggedOutUser();

    // Redirigir a la página principal
    window.location.href = '../index.html';
}

function checkSession() {
    const sessionData = JSON.parse(localStorage.getItem('pharmahome_session') || '{}');

    if (sessionData.isLoggedIn) {
        updateUIForLoggedInUser(sessionData.userName);
    } else {
        updateUIForLoggedOutUser();
    }
}

function updateUIForLoggedInUser(userName) {
    // Actualizar el botón de ingresar por el nombre del usuario
    const loginButton = document.querySelector('.btn-ingresar');

    if (loginButton) {
        // Extraer solo el primer nombre
        const firstName = userName.split(' ')[0];

        loginButton.innerHTML = `
            <i class="fa-regular fa-circle-user me-2"></i>${firstName}
            <div class="dropdown-menu" aria-labelledby="userDropdown">
                <a class="dropdown-item" href="#" id="logoutBtn">Cerrar Sesión</a>
            </div>
        `;

        // Convertir el botón en un dropdown
        loginButton.classList.add('dropdown-toggle');
        loginButton.setAttribute('data-bs-toggle', 'dropdown');
        loginButton.setAttribute('aria-expanded', 'false');
        loginButton.id = 'userDropdown';

        // Agregar evento para cerrar sesión
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
}

function updateUIForLoggedOutUser() {
    const loginButton = document.querySelector('.btn-ingresar');

    if (loginButton) {
        loginButton.innerHTML = '<i class="fa-regular fa-circle-user me-2"></i>Ingresar';
        loginButton.href = 'pages/login.html';

        // Remover características de dropdown
        loginButton.classList.remove('dropdown-toggle');
        loginButton.removeAttribute('data-bs-toggle');
        loginButton.removeAttribute('aria-expanded');
        loginButton.removeAttribute('id');
    }
}

function showRegistrationSuccess() {
    // Mostrar mensaje de registro exitoso si viene de la página de registro
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registro') === 'exitoso') {
        const successAlert = document.getElementById('registroExitoso');
        if (successAlert) {
            successAlert.classList.remove('d-none');

            // Ocultar el mensaje después de 5 segundos
            setTimeout(() => {
                successAlert.classList.add('d-none');
            }, 5000);
        }
    }
}

// Funciones auxiliares
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}
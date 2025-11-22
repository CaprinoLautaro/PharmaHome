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

    // Protección de páginas para acceso directo
    checkPageProtection();

    // Verificar redirección después del login
    checkRedirectAfterLogin();
});

function checkPageProtection() {
    // Lista de páginas que requieren autenticación
    const protectedPages = [
        'misRecetas.html'
    ];

    // Obtener el nombre del archivo actual
    const currentPage = window.location.pathname.split('/').pop();

    // Verificar si la página actual está protegida
    if (protectedPages.includes(currentPage)) {
        const sessionData = JSON.parse(localStorage.getItem('pharmahome_session') || '{}');

        if (!sessionData.isLoggedIn) {
            // Redirigir al login
            window.location.href = 'login.html';
        }
    }
}

// NUEVA FUNCIÓN: Verificar redirección después del login
function checkRedirectAfterLogin() {
    const sessionData = JSON.parse(localStorage.getItem('pharmahome_session') || '{}');
    const redirectUrl = localStorage.getItem('redirectAfterLogin');
    
    // Solo redirigir si hay una URL guardada Y el usuario está logueado
    if (redirectUrl && sessionData.isLoggedIn) {
        const currentPage = window.location.pathname.split('/').pop();
        
        // Solo redirigir si estamos en login.html o index.html
        if (currentPage === 'login.html' || currentPage === 'index.html') {
            setTimeout(() => {
                localStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectUrl;
            }, 500);
        }
    }
}

function handleRegister(e) {
    e.preventDefault();

    const nombreCompleto = document.getElementById('nombreCompleto').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const dni = document.getElementById('dni').value; // Cambiado de cuil a dni
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

    // Validar DNI (7 u 8 dígitos)
    if (!/^\d{7,8}$/.test(dni)) {
        alert('Por favor, ingresa un DNI válido (7 u 8 dígitos).');
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
        password,
        dni, // Cambiado de cuil a dni
        tramiteDNI,
        fechaRegistro: new Date().toISOString()
    };

    // Guardar usuario
    existingUsers.push(newUser);
    localStorage.setItem('pharmahome_users', JSON.stringify(existingUsers));

    // Redirigir a la página de login
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

        // Verificar si hay redirección pendiente
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        
        if (redirectUrl) {
            // Redirigir a la URL guardada
            setTimeout(() => {
                localStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectUrl;
            }, 1000);
        } else {
            // Si no hay redirección, ir al home
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        }
        
        // Mostrar mensaje de éxito
        mostrarMensajeLoginExitoso();
        
    } else {
        alert('Correo electrónico o contraseña incorrectos.');
    }
}

// Función para mostrar mensaje de login exitoso
function mostrarMensajeLoginExitoso() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Crear mensaje de éxito
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success mt-3';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ¡Inicio de sesión exitoso! Redirigiendo...
        `;
        
        // Insertar después del formulario
        loginForm.parentNode.insertBefore(successMessage, loginForm.nextSibling);
        
        // Deshabilitar el formulario
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Redirigiendo...';
        }
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
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logoutUser();
            });
        }
    }

    // ✅ ACTUALIZAR TAMBIÉN EL ENLACE "MIS RECETAS"
    updateMisRecetasLink(true);
}

function updateUIForLoggedOutUser() {
    const loginButton = document.querySelector('.btn-ingresar');

    if (loginButton) {
        loginButton.innerHTML = '<i class="fa-regular fa-circle-user me-2"></i>Ingresar';
        loginButton.href = '/pages/login.html';

        // Remover características de dropdown
        loginButton.classList.remove('dropdown-toggle');
        loginButton.removeAttribute('data-bs-toggle');
        loginButton.removeAttribute('aria-expanded');
        loginButton.removeAttribute('id');
    }

    // ✅ ACTUALIZAR TAMBIÉN EL ENLACE "MIS RECETAS"
    updateMisRecetasLink(false);
}

// ✅ NUEVA FUNCIÓN: Actualizar el enlace de Mis Recetas
function updateMisRecetasLink(isLoggedIn) {
    const misRecetasLink = document.querySelector('a[href="/pages/login.html"] .fa-receipt')?.closest('a');

    if (misRecetasLink) {
        if (isLoggedIn) {
            // Usuario logueado - apuntar a Mis Recetas
            misRecetasLink.href = '/pages/tusRecetas.html';
        } else {
            // Usuario NO logueado - apuntar a Login
            misRecetasLink.href = '/pages/login.html';
        }
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

// Exportar funciones para uso en otros archivos
window.verificarSesion = function() {
    const sessionData = JSON.parse(localStorage.getItem('pharmahome_session') || '{}');
    return sessionData.isLoggedIn === true;
};

window.obtenerUsuario = function() {
    return JSON.parse(localStorage.getItem('pharmahome_session') || '{}');
};
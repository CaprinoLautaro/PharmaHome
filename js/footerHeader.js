document.addEventListener('DOMContentLoaded', function() {
    // Cargar header
    fetch('/pages/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;

            // Después de cargar el header, verificar la sesión
            // para actualizar el botón de usuario
            if (typeof checkSession === 'function') {
                checkSession();
            }
        })
        .catch(error => console.error('Error cargando el header:', error));

    // Cargar footer
    fetch('/pages/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => console.error('Error cargando el footer:', error));
});

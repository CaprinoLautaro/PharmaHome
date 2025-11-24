document.addEventListener('DOMContentLoaded', function() {

        function inicializarBuscador() {
            const searchInput = document.querySelector('.search-form input');
            const searchBtn = document.querySelector('.search-form button');

            if (searchInput && searchBtn) {

                const realizarBusqueda = () => {
                    const texto = searchInput.value.trim();
                    if (texto) {
                        window.location.href = `/pages/tienda.html?busqueda=${encodeURIComponent(texto)}`;
                    }
                };

                searchBtn.addEventListener('click', realizarBusqueda);

                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') realizarBusqueda();
                });

            }
        }


    // Cargar header
    fetch('../pages/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('header').innerHTML = data;
            inicializarBuscador();

            if (typeof checkSession === 'function') {
                checkSession();
            }
        })
        .catch(error => console.error('Error cargando el header:', error));

    // Cargar footer
    fetch('../pages/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => console.error('Error cargando el footer:', error));

        fetch('../pages/modal.html') 
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('modal-container').innerHTML = data;
        })
        .catch(error => console.error('Error cargando el modal:', error));
});
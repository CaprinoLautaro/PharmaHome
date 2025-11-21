document.addEventListener('DOMContentLoaded', function () {
    
    const initialCoords = [-38.416, -63.616]; 
    const initialZoom = 4;
    const map = L.map('map').setView(initialCoords, initialZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const provinciaInput = document.getElementById('provincia-input');
    const localidadInput = document.getElementById('localidad-input');
    const codPostalInput = document.getElementById('cod-postal-input');
    const searchBtn = document.getElementById('search-btn');

    function buscarUbicacion() {
        const provincia = provinciaInput.value;
        const localidad = localidadInput.value;
        const codPostal = codPostalInput.value;

        if (!localidad.trim() || !provincia.trim()) {
            alert('Por favor, ingresa al menos una provincia y una localidad.');
            return;
        }

        const query = `${localidad}, ${codPostal}, ${provincia}, Argentina`;
        
        const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

        console.log("Buscando en:", apiUrl); 

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const bestResult = data[0];
                    const lat = bestResult.lat;
                    const lon = bestResult.lon;
                    
                    map.flyTo([lat, lon], 14); 

                    L.marker([lat, lon]).addTo(map)
                        .bindPopup(`<b>${bestResult.display_name}</b>`)
                        .openPopup();

                } else {
                    alert('No se encontraron resultados para la ubicación especificada. Intenta ser más específico.');
                }
            })
            .catch(error => {
                alert('Ocurrió un error al conectar con el servicio de mapas.');
            });
    }

    searchBtn.addEventListener('click', buscarUbicacion);
});
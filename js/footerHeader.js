document.addEventListener("DOMContentLoaded", function() {
    
    const headerURL = 'pages/header.html';
    const footerURL = 'pages/footer.html';

    const loadComponent = (url, elementId) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al cargar ${url}: ${response.statusText}`);
                }
                return response.text(); 
            })
            .then(html => {
                document.getElementById(elementId).innerHTML = html;
            })
            .catch(error => {
                document.getElementById(elementId).innerHTML = `<p>Error al cargar esta sección.</p>`;
            });
    };

    loadComponent(headerURL, 'header');
    loadComponent(footerURL, 'footer');

});

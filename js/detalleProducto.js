// detalleProducto.js
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    // Obtener datos del producto desde la URL
    const nombre = params.get('nombre') || 'Producto';
    const marca = params.get('marca') || '';
    const precio = parseInt(params.get('precio')) || 2200;
    const img = params.get('img') || '/img/F_000001106329.png';
    const descripcion = params.get('descripcion') || 'Descripción no disponible.';

    // Actualizar la página con los datos del producto
    const titleEl = document.querySelector('.product-title');
    const marcaEl = document.querySelector('.product-subtitle');
    const imgEl = document.getElementById('mainProductImage');
    const priceEl = document.querySelector('.price');
    const descEl = document.querySelector('.product-description');

    if(titleEl) titleEl.textContent = nombre;
    if(marcaEl) marcaEl.textContent = marca ? marca.toUpperCase() : 'VENTA LIBRE';
    if(imgEl) imgEl.src = img;
    if(priceEl) priceEl.textContent = `$${precio.toLocaleString()}`;
    if(descEl) descEl.textContent = descripcion;

    // Actualizar breadcrumbs
    const breadcrumbsContainer = document.getElementById('product-breadcrumbs');
    if(breadcrumbsContainer) {
        breadcrumbsContainer.innerHTML = `<a href="tienda.html">Tienda</a> <span>${nombre}</span>`;
    }

    // Funcionalidad del selector de cantidad
    let cantidad = 1;
    const quantityValueEl = document.getElementById('quantity-value');
    const totalPriceEl = document.getElementById('total-price');

    function actualizarTotal() {
        const total = (precio * cantidad) + 2000; // + envío
        if (totalPriceEl) {
            totalPriceEl.textContent = `$${total.toLocaleString()}`;
        }
    }

    // Botones de cantidad
    document.querySelector('.btn-quantity.minus').addEventListener('click', () => {
        if (cantidad > 1) {
            cantidad--;
            quantityValueEl.textContent = cantidad;
            actualizarTotal();
        }
    });

    document.querySelector('.btn-quantity.plus').addEventListener('click', () => {
        cantidad++;
        quantityValueEl.textContent = cantidad;
        actualizarTotal();
    });

    // Botón de agregar al carrito - SUPER SIMPLE
    document.getElementById('btn-add-to-cart-detalle').addEventListener('click', () => {
        const producto = {
            nombre: nombre,
            precio: precio,
            marca: marca,
            img: img
        };

        // Agregar cada unidad al carrito
        for (let i = 0; i < cantidad; i++) {
            agregarAlCarrito(producto);
        }

        
        // Resetear cantidad a 1
        cantidad = 1;
        quantityValueEl.textContent = '1';
        actualizarTotal();
    });

    // Inicializar total
    actualizarTotal();
});
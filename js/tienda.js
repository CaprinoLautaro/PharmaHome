// tienda.js
document.addEventListener('DOMContentLoaded', () => {
  const contenedorVentaLibre = document.getElementById('contenedorVentaLibre');

  fetch('../js/productos.json')
    .then(res => res.json())
    .then(productos => {
      productos.forEach(prod => {
        const card = document.createElement('div');
        card.classList.add('card-productos');
        card.dataset.id = prod.id;
        card.dataset.nombre = prod.nombre;
        card.dataset.marca = prod.marca;
        card.dataset.farmacia = prod.farmacia;
        card.dataset.precio = prod.precio; // Ya es número
        card.dataset.img = prod.img;
        card.dataset.descripcion = prod.descripcion;

        // Formatear precio para mostrar con formato $
        const precioFormateado = `$${prod.precio.toLocaleString()}`;

        card.innerHTML = `
          <img src="${prod.img}" alt="${prod.nombre}">
          <p style="font-weight:bold;">${prod.nombre}</p>
          <p>${prod.marca}</p>
          <p>${prod.farmacia}</p>
          <label>${precioFormateado}</label>
          <button class="boton-carrito" type="button">Agregar al carrito</button>
        `;

        // Navegar a detalle al hacer clic en la card
        card.addEventListener('click', (e) => {
          if (!e.target.classList.contains('boton-carrito')) {
            const params = new URLSearchParams(card.dataset);
            window.location.href = `detalleProducto.html?${params.toString()}`;
          }
        });

        // Agregar al carrito
        const btn = card.querySelector('.boton-carrito');
        if (btn) {
          btn.addEventListener('click', e => {
            e.stopPropagation();
            agregarAlCarrito({
              id: prod.id,
              nombre: prod.nombre,
              precio: prod.precio, // Ya es número
              marca: prod.marca,
              farmacia: prod.farmacia,
              img: prod.img
            });
          });
        }

        contenedorVentaLibre.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error cargando productos:', error);
      contenedorVentaLibre.innerHTML = '<p>Error cargando productos</p>';
    });

  // Configurar productos estáticos (Mis recetados)
  document.querySelectorAll('#carouselMulti .card-productos').forEach(card => {
    // Navegar a detalle
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('boton-carrito')) {
        const params = new URLSearchParams(card.dataset);
        window.location.href = `detalleProducto.html?${params.toString()}`;
      }
    });

    // Agregar al carrito
    const btn = card.querySelector('.boton-carrito');
    if (btn) {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const producto = {
          id: card.dataset.id,
          nombre: card.dataset.nombre,
          precio: parseInt(card.dataset.precio),
          marca: card.dataset.marca,
          farmacia: card.dataset.farmacia,
          img: card.dataset.img
        };
        agregarAlCarrito(producto);
      });
    }
  });
});
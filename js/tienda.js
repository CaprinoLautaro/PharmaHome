document.addEventListener('DOMContentLoaded', () => {

  const contenedorVentaLibre = document.getElementById('contenedorVentaLibre');

  fetch('../js/productos.json')
    .then(res => res.json())
    .then(productos => {
      productos.forEach(prod => {
        const card = document.createElement('div');
        card.classList.add('card-productos');
        card.dataset.nombre = prod.nombre;
        card.dataset.marca = prod.marca;
        card.dataset.farmacia = prod.farmacia;
        card.dataset.precio = prod.precio;
        card.dataset.img = prod.img;
        card.dataset.descripcion = prod.descripcion;

        card.innerHTML = `
          <img src="${prod.img}" alt="${prod.nombre}">
          <p style="font-weight:bold;">${prod.nombre}</p>
          <p>${prod.marca}</p>
          <p>${prod.farmacia}</p>
          <label>${prod.precio}</label>
          <button class="boton-carrito" type="button">Agregar al carrito</button>
        `;

        card.addEventListener('click', () => {
          const params = new URLSearchParams(card.dataset);
          window.location.href = `detalleProducto.html?${params.toString()}`;
        });


        const btn = card.querySelector('.boton-carrito');
        if (btn) btn.addEventListener('click', e => e.stopPropagation());

        contenedorVentaLibre.appendChild(card);
      });
    });

  document.querySelectorAll('#carouselMulti .card-productos').forEach(card => {
    card.addEventListener('click', () => {
      const params = new URLSearchParams(card.dataset);
      window.location.href = `detalleProducto.html?${params.toString()}`;
    });

    const btn = card.querySelector('.boton-carrito');
    if (btn) btn.addEventListener('click', e => e.stopPropagation());
  });
});
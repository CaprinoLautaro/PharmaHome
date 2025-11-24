document.addEventListener('DOMContentLoaded', () => {
  const contenedorVentaLibre = document.getElementById('contenedorVentaLibre');
  const tituloVentaLibre = document.querySelector('h3');
  const carruselRecetados = document.getElementById('carouselMulti');
  const tituloRecetados = carruselRecetados.previousElementSibling;

  const params = new URLSearchParams(window.location.search);
  const textoBusqueda = params.get('busqueda');

  if (textoBusqueda) {
      setTimeout(() => {
          const searchInput = document.querySelector('.search-form input');
          if(searchInput) searchInput.value = textoBusqueda;
      }, 600);
  }

  fetch('../js/productos.json')
    .then(res => res.json())
    .then(productos => {

      let productosAmostrar = productos;

      if (textoBusqueda) {
        if(carruselRecetados) carruselRecetados.style.display = 'none';
        if(tituloRecetados) tituloRecetados.style.display = 'none';

        if(tituloVentaLibre) tituloVentaLibre.textContent = `Resultados para: "${textoBusqueda}"`;

        productosAmostrar = productos.filter(prod =>
             prod.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
             prod.marca.toLowerCase().includes(textoBusqueda.toLowerCase())
        );
      }

      contenedorVentaLibre.innerHTML = '';

      if (productosAmostrar.length === 0) {
          contenedorVentaLibre.innerHTML = '<p class="text-center w-100">No se encontraron productos que coincidan con tu búsqueda.</p>';
          return;
      }

      productosAmostrar.forEach(prod => {
        const card = document.createElement('div');
        card.classList.add('card-productos');
        card.dataset.id = prod.id;
        card.dataset.nombre = prod.nombre;
        card.dataset.marca = prod.marca;
        card.dataset.farmacia = prod.farmacia;
        card.dataset.precio = prod.precio;
        card.dataset.img = prod.img;
        card.dataset.descripcion = prod.descripcion;

        const precioFormateado = `$${prod.precio.toLocaleString()}`;

        card.innerHTML = `
          <img src="${prod.img}" alt="${prod.nombre}">
          <p style="font-weight:bold;">${prod.nombre}</p>
          <p>${prod.marca}</p>
          <p>${prod.farmacia}</p>
          <label>${precioFormateado}</label>
          <button class="boton-carrito" type="button">Agregar al carrito</button>
        `;

        card.addEventListener('click', (e) => {
          if (!e.target.classList.contains('boton-carrito')) {
            const params = new URLSearchParams(card.dataset);
            window.location.href = `detalleProducto.html?${params.toString()}`;
          }
        });

        const btn = card.querySelector('.boton-carrito');
        if (btn) {
          btn.addEventListener('click', e => {
            e.stopPropagation();
            if(typeof agregarAlCarrito === 'function'){
                agregarAlCarrito({
                id: prod.id,
                nombre: prod.nombre,
                precio: prod.precio,
                marca: prod.marca,
                farmacia: prod.farmacia,
                img: prod.img
                });
            }
          });
        }

        contenedorVentaLibre.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error cargando productos:', error);
      contenedorVentaLibre.innerHTML = '<p>Error cargando productos</p>';
    });

  if (!textoBusqueda) {
      document.querySelectorAll('#carouselMulti .card-productos').forEach(card => {
        card.addEventListener('click', (e) => {
          if (!e.target.classList.contains('boton-carrito')) {
            const params = new URLSearchParams(card.dataset);
            window.location.href = `detalleProducto.html?${params.toString()}`;
          }
        });
         const btn = card.querySelector('.boton-carrito');
            if (btn) {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                if(typeof agregarAlCarrito === 'function'){
                    const producto = {
                        id: card.dataset.id,
                        nombre: card.dataset.nombre,
                        precio: parseInt(card.dataset.precio),
                        marca: card.dataset.marca,
                        farmacia: card.dataset.farmacia,
                        img: card.dataset.img
                    };
                    agregarAlCarrito(producto);
                }
            });
            }
      });
  }
});

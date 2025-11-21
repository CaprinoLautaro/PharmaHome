document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);

  const nombre = params.get('nombre') || 'Producto';
  const marca = params.get('marca') || '';
  const farmacia = params.get('farmacia') || '';
  const precio = decodeURIComponent(params.get('precio') || '$0');
  const img = params.get('img') || '/img/default-product.png';
  const descripcion = params.get('descripcion') || 'Descripción no disponible.';

  const titleEl = document.querySelector('.product-title');
  const subtitleEl = document.querySelector('.product-subtitle');
  const imgEl = document.getElementById('mainProductImage');
  const priceEl = document.querySelector('.price');
  const descEl = document.querySelector('.product-description');

  if(titleEl) titleEl.textContent = nombre;
  if(subtitleEl) subtitleEl.textContent = marca ? marca.toUpperCase() : '';
  if(imgEl) imgEl.src = img;
  if(priceEl) priceEl.textContent = precio;
  if(descEl) descEl.textContent = descripcion;

  
  const breadcrumbs = document.querySelector('.product-breadcrumbs');
  if(breadcrumbs) {
    breadcrumbs.innerHTML = `<a href="tienda.html">Tienda</a> <a href="#">${marca}</a> <span>${nombre}</span>`;
  }
});
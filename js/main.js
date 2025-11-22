fetch('../pages/modal.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('modal-container').innerHTML = data;

        if (typeof initCart === 'function') {
            initCart(); // ⭐ AQUÍ SE ACTIVA EL CARRITO
        }
    });
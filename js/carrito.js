let carrito = [];

// Cargar carrito desde LocalStorage
document.addEventListener("DOMContentLoaded", () => {
    const guardado = localStorage.getItem("carrito");
    carrito = guardado ? JSON.parse(guardado) : [];

    actualizarCarritoUI();
});

// Guardar carrito
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Agregar producto
function agregarAlCarrito(producto) {
    const existe = carrito.find(p => p.id === producto.id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito();
    actualizarCarritoUI();
    document.getElementById("carrito-aside").classList.add("open");

}

// Eliminar
function eliminarProducto(id) {
    carrito = carrito.filter(p => p.id !== id);
    guardarCarrito();
    actualizarCarritoUI();
}

// Actualizar UI
function actualizarCarritoUI() {
    const lista = document.getElementById("carrito-lista");
    const totalSpan = document.getElementById("carrito-total");
    const badge = document.getElementById("cart-count");

    if (!lista || !totalSpan || !badge) return;

    lista.innerHTML = "";
    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach(p => {
        total += p.precio * p.cantidad;
        cantidadTotal += p.cantidad;

    lista.innerHTML += `
    <li>

        <button class="btn-eliminar" onclick="eliminarProducto(${p.id})">X</button>

        ${p.nombre} - $${p.precio}

        <div class="cantidad-box">
            <button onclick="cambiarCantidad(${p.id}, -1)">−</button>
            <span>${p.cantidad}</span>
            <button onclick="cambiarCantidad(${p.id}, +1)">+</button>
        </div>

    </li>
`;
    });

    totalSpan.textContent = total;
    badge.textContent = cantidadTotal;
}

// Cambiar Cantidad

function cambiarCantidad(id, delta) {
    const producto = carrito.find(p => p.id === id);

    if (!producto) return;

    producto.cantidad += delta;

    if (producto.cantidad <= 0) {
        // Si llega a 0 lo eliminamos
        carrito = carrito.filter(p => p.id !== id);
    }

    guardarCarrito();
    actualizarCarritoUI();
}

// Abrir / cerrar
document.addEventListener("click", (e) => {
    if (e.target.closest("#btn-carrito")) {
        document.getElementById("carrito-aside").classList.add("open");
    }

    if (e.target.closest("#cerrar-carrito")) {
        document.getElementById("carrito-aside").classList.remove("open");
    }
});

// Esperamos que se cargue el header/footer
document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
        actualizarCarritoUI();
    }
});

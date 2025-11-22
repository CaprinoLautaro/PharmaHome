// carrito.js
let carrito = [];
let carritoInicializado = false;

// Función para verificar si hay sesión activa
function verificarSesion() {
    const sessionData = JSON.parse(localStorage.getItem('pharmahome_session') || '{}');
    return sessionData.isLoggedIn === true;
}

// Función para obtener datos del usuario
function obtenerUsuario() {
    const sessionData = JSON.parse(localStorage.getItem('pharmahome_session') || '{}');
    return sessionData;
}

// Función para inicializar el carrito
function inicializarCarrito() {
    if (carritoInicializado) return;
    
    // Cargar carrito desde localStorage
    const guardado = localStorage.getItem('carrito');
    if (guardado) {
        try {
            carrito = JSON.parse(guardado);
        } catch (e) {
            console.error('Error al cargar el carrito:', e);
            carrito = [];
        }
    }
    
    actualizarCarritoUI();
    configurarEventListeners();
    carritoInicializado = true;
}

function configurarEventListeners() {
    // Delegación de eventos para mejor performance
    document.addEventListener('click', function(e) {
        // Abrir carrito
        if (e.target.closest('#btn-carrito')) {
            abrirCarrito();
            return;
        }
        
        // Cerrar carrito
        if (e.target.closest('#cerrar-carrito') || e.target.classList.contains('overlay')) {
            cerrarCarrito();
            return;
        }
        
        // Finalizar compra
        if (e.target.closest('#finalizar-compra')) {
            e.preventDefault();
            finalizarCompra();
            return;
        }
    });
    
    // Cerrar con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('carrito-aside')?.classList.contains('open')) {
            cerrarCarrito();
        }
    });
}

function abrirCarrito() {
    const carritoAside = document.getElementById('carrito-aside');
    const overlay = document.querySelector('.overlay');
    
    if (carritoAside && overlay) {
        carritoAside.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function cerrarCarrito() {
    const carritoAside = document.getElementById('carrito-aside');
    const overlay = document.querySelector('.overlay');
    
    if (carritoAside && overlay) {
        carritoAside.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Guardar carrito en localStorage
function guardarCarrito() {
    try {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    } catch (e) {
        console.error('Error al guardar el carrito:', e);
    }
}

// Agregar producto al carrito
function agregarAlCarrito(producto) {
    const idSimple = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const productoSeguro = {
        ...producto,
        id: idSimple
    };

    // Buscar producto existente
    const productoExistente = carrito.find(p => 
        p.nombre === productoSeguro.nombre && 
        p.precio === productoSeguro.precio
    );
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            ...productoSeguro,
            cantidad: 1
        });
    }
    
    guardarCarrito();
    actualizarCarritoUI();
    abrirCarrito();
    mostrarNotificacion(`"${producto.nombre}" agregado al carrito`);
}

// Eliminar producto del carrito
function eliminarProducto(id) {
    carrito = carrito.filter(p => p.id !== id);
    guardarCarrito();
    actualizarCarritoUI();
}

// Cambiar cantidad de producto
function cambiarCantidad(id, delta) {
    const producto = carrito.find(p => p.id === id);
    
    if (producto) {
        producto.cantidad += delta;
        
        if (producto.cantidad <= 0) {
            eliminarProducto(id);
        } else {
            guardarCarrito();
            actualizarCarritoUI();
        }
    }
}

// Función para finalizar compra con validación de sesión
function finalizarCompra() {
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito está vacío', 'warning');
        return;
    }
    
    if (!verificarSesion()) {
        mostrarNotificacion('Debes iniciar sesión para finalizar la compra', 'warning');
        
        // Guardar la URL actual para redirigir después del login
        localStorage.setItem('redirectAfterLogin', window.location.href);
        
        // Redirigir al login después de un breve delay
        setTimeout(() => {
            window.location.href = '/pages/login.html';
        }, 1500);
        return;
    }
    
    // Si hay sesión y el carrito tiene productos, proceder con el pago
    window.location.href = '/pages/pago.html';
}

// Actualizar interfaz del carrito
function actualizarCarritoUI() {
    const lista = document.getElementById('carrito-lista');
    const totalSpan = document.getElementById('carrito-total');
    const badge = document.getElementById('cart-count');
    const finalizarBtn = document.getElementById('finalizar-compra');
    
    if (!lista || !totalSpan) {
        console.warn('Elementos del carrito no encontrados, reintentando...');
        // Reintentar después de un breve delay
        setTimeout(actualizarCarritoUI, 100);
        return;
    }
    
    let total = 0;
    let cantidadTotal = 0;
    
    if (carrito.length === 0) {
        lista.innerHTML = '<li class="empty-cart">El carrito está vacío</li>';
        if (finalizarBtn) {
            finalizarBtn.disabled = true;
            finalizarBtn.classList.add('btn-disabled');
        }
    } else {
        lista.innerHTML = '';
        
        carrito.forEach(producto => {
            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;
            cantidadTotal += producto.cantidad;
            
            const item = document.createElement('li');
            item.innerHTML = `
                <div class="producto-info">
                    <div class="producto-detalles">
                        <div class="producto-nombre">${escapeHtml(producto.nombre)}</div>
                        ${producto.marca ? `<div class="producto-marca">${escapeHtml(producto.marca)}</div>` : ''}
                        <div class="producto-precio">$${producto.precio} c/u</div>
                    </div>
                    <button class="btn-eliminar" onclick="eliminarProducto('${producto.id}')" title="Eliminar producto">×</button>
                </div>
                <div class="cantidad-box">
                    <button onclick="cambiarCantidad('${producto.id}', -1)" title="Reducir cantidad">−</button>
                    <span>${producto.cantidad}</span>
                    <button onclick="cambiarCantidad('${producto.id}', 1)" title="Aumentar cantidad">+</button>
                    <span class="producto-subtotal">$${subtotal}</span>
                </div>
            `;
            lista.appendChild(item);
        });
        
        if (finalizarBtn) {
            finalizarBtn.disabled = false;
            finalizarBtn.classList.remove('btn-disabled');
        }
    }
    
    totalSpan.textContent = total.toLocaleString();
    if (badge) {
        badge.textContent = cantidadTotal;
        badge.style.display = cantidadTotal > 0 ? 'flex' : 'none';
    }
}

// Mostrar notificación mejorada
function mostrarNotificacion(mensaje, tipo = 'success') {
    // Eliminar notificación existente si hay
    const notificacionExistente = document.querySelector('.cart-notification');
    if (notificacionExistente) {
        notificacionExistente.remove();
    }
    
    const colores = {
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545'
    };
    
    const notificacion = document.createElement('div');
    notificacion.className = 'cart-notification';
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colores[tipo] || colores.success};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1070;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: 500;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notificacion.parentNode) {
                    document.body.removeChild(notificacion);
                }
            }, 300);
        }
    }, 3000);
}

// Función auxiliar para escapar HTML
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Exportar funciones globalmente
window.agregarAlCarrito = agregarAlCarrito;
window.eliminarProducto = eliminarProducto;
window.cambiarCantidad = cambiarCantidad;
window.finalizarCompra = finalizarCompra;

// Inicializar cuando el DOM esté listo Y después de que el header se cargue
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, esperando header...');
    
    // Esperar un poco más para asegurar que el header dinámico se cargó
    setTimeout(() => {
        inicializarCarrito();
    }, 100);
});

// Función para forzar la actualización del carrito (útil después de cargar header dinámico)
function actualizarCarritoDesdeStorage() {
    const guardado = localStorage.getItem('carrito');
    if (guardado) {
        try {
            carrito = JSON.parse(guardado);
            actualizarCarritoUI();
        } catch (e) {
            console.error('Error al actualizar carrito:', e);
        }
    }
}

// Exportar esta función también
window.actualizarCarritoDesdeStorage = actualizarCarritoDesdeStorage;
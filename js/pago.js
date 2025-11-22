// pago.js - VERSIÓN COMPLETA CON CARRITO REAL
document.addEventListener('DOMContentLoaded', function() {
    // Cargar carrito desde localStorage
    let carrito = [];
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        try {
            carrito = JSON.parse(carritoGuardado);
        } catch (e) {
            console.error('Error al cargar el carrito:', e);
            carrito = [];
        }
    }

    // Elementos de la barra de progreso
    const pasos = document.querySelectorAll('.paso');
    const lineas = document.querySelectorAll('.linea');
    
    // Secciones principales
    const seccionPaso1 = document.getElementById('paso-1');
    const seccionPaso2 = document.getElementById('paso-2');
    const seccionPaso3 = document.getElementById('paso-3');
    const seccionPaso4 = document.getElementById('paso-4');
    
    // Elementos del Paso 1 (Carrito)
    const botonContinuarCarrito = document.querySelector('.boton-continuar-carrito');
    const listaProductos = document.querySelector('.lista-productos');
    
    // Elementos del Resumen
    const detallesResumen = document.querySelector('.detalles-resumen');
    const totalesResumen = document.querySelector('.totales-resumen');
    const totalAPagar = document.querySelector('.total-a-pagar');

    // Elementos del Paso 2 (Pago)
    const metodoPago = document.querySelector('.metodo-pago');
    const formularioTarjeta = document.getElementById('formulario-tarjeta');
    const botonesMetodoPago = document.querySelectorAll('.card-pago .boton');
    const botonPagarTarjeta = document.querySelector('.boton-pagar-tarjeta');
    const botonVolverMetodos = document.querySelector('.boton-volver-metodos');
    
    // Elementos del Paso 3 (Envío)
    const botonContinuarEnvio = document.querySelector('.boton-continuar-envio');
    const botonVolverPago = document.querySelector('.boton-volver-pago');
    
    // Elementos del Paso 4 (Confirmación)
    const botonVolverInicio = document.querySelector('.boton-volver-inicio');
    
    // Elemento del resumen
    const tituloResumen = document.querySelector('.resumen-lateral .titulo-seccion');
    
    // Estado actual
    let pasoActual = 1;
    let metodoPagoSeleccionado = null;

    // Inicializar
    mostrarPaso(1);
    actualizarCarritoEnPago();
    actualizarResumenEnPago();

    // ============================================
    // PASO 1: Carrito Real
    // ============================================
    
    botonContinuarCarrito?.addEventListener('click', function() {
        if (carrito.length === 0) {
            alert('Tu carrito está vacío. Agrega productos para continuar.');
            return;
        }
        mostrarPaso(2);
    });

    // ============================================
    // PASO 2: Selección de método de pago
    // ============================================
    
    botonesMetodoPago.forEach(boton => {
        boton.addEventListener('click', function() {
            metodoPagoSeleccionado = this.getAttribute('data-metodo');
            
            if (metodoPagoSeleccionado === 'tarjeta') {
                metodoPago.classList.add('desactivado');
                formularioTarjeta.classList.remove('desactivado');
            } else if (metodoPagoSeleccionado === 'mercadopago') {
                mostrarPaso(3);
            }
        });
    });

    botonVolverMetodos?.addEventListener('click', function() {
        formularioTarjeta.classList.add('desactivado');
        metodoPago.classList.remove('desactivado');
        metodoPagoSeleccionado = null;
    });

    botonPagarTarjeta?.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (validarFormularioTarjeta()) {
            mostrarPaso(3);
        }
    });

    // ============================================
    // PASO 3: Información de envío
    // ============================================
    
    botonContinuarEnvio?.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (validarFormularioEnvio()) {
            // Guardar información de envío antes de continuar
            guardarInformacionEnvio();
            mostrarPaso(4);
        }
    });

    botonVolverPago?.addEventListener('click', function() {
        resetearPaso2();
        mostrarPaso(2);
    });

    // ============================================
    // FUNCIONES DEL CARRITO REAL
    // ============================================
    
    function actualizarCarritoEnPago() {
        if (!listaProductos) return;
        
        if (carrito.length === 0) {
            listaProductos.innerHTML = `
                <div class="carrito-vacio">
                    <i class="fas fa-shopping-cart" style="font-size: 4rem; color: #6c757d; margin-bottom: 20px;"></i>
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega algunos productos para continuar</p>
                    <button class="boton" onclick="window.location.href='../pages/tienda.html'">
                        <i class="fas fa-arrow-left"></i> Volver a Comprar
                    </button>
                </div>
            `;
            if (botonContinuarCarrito) {
                botonContinuarCarrito.disabled = true;
                botonContinuarCarrito.classList.add('boton-deshabilitado');
            }
            return;
        }

        listaProductos.innerHTML = '';
        
        carrito.forEach((producto, index) => {
            const productoElement = document.createElement('div');
            productoElement.className = 'producto-carrito';
            productoElement.innerHTML = `
                <div class="producto-imagen">
                    <img src="${producto.img || '../img/placeholder.jpg'}" alt="${producto.nombre}" onerror="this.src='../img/placeholder.jpg'">
                </div>
                <div class="producto-info">
                    <h4>${producto.nombre}</h4>
                    ${producto.marca ? `<p class="producto-desc">${producto.marca}</p>` : ''}
                    ${producto.farmacia ? `<p class="producto-farmacia">${producto.farmacia}</p>` : ''}
                    <div class="producto-controls">
                        <button class="btn-cantidad" data-accion="restar" data-index="${index}">-</button>
                        <span class="cantidad">${producto.cantidad}</span>
                        <button class="btn-cantidad" data-accion="sumar" data-index="${index}">+</button>
                    </div>
                </div>
                <div class="producto-precio">
                    <span class="precio-unitario">$${producto.precio} c/u</span>
                    <span class="precio-total">$${producto.precio * producto.cantidad}</span>
                    <button class="btn-eliminar" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            listaProductos.appendChild(productoElement);
        });

        if (botonContinuarCarrito) {
            botonContinuarCarrito.disabled = false;
            botonContinuarCarrito.classList.remove('boton-deshabilitado');
        }

        reinicializarEventListenersCarrito();
    }

    function reinicializarEventListenersCarrito() {
        // Botones de cantidad
        document.querySelectorAll('.btn-cantidad').forEach(btn => {
            btn.addEventListener('click', function() {
                const accion = this.getAttribute('data-accion');
                const index = parseInt(this.getAttribute('data-index'));
                
                if (accion === 'sumar') {
                    carrito[index].cantidad++;
                } else if (accion === 'restar' && carrito[index].cantidad > 1) {
                    carrito[index].cantidad--;
                }
                
                guardarCarrito();
                actualizarCarritoEnPago();
                actualizarResumenEnPago();
            });
        });

        // Botones de eliminar
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                carrito.splice(index, 1);
                guardarCarrito();
                actualizarCarritoEnPago();
                actualizarResumenEnPago();
            });
        });
    }

    function actualizarResumenEnPago() {
        if (!detallesResumen || !totalesResumen || !totalAPagar) return;
        
        let subtotal = 0;
        let envio = 500; // Costo fijo de envío
        
        // Actualizar detalles de productos
        detallesResumen.innerHTML = '';
        carrito.forEach(producto => {
            const productoTotal = producto.precio * producto.cantidad;
            subtotal += productoTotal;
            
            const detalle = document.createElement('p');
            detalle.innerHTML = `${producto.nombre} x${producto.cantidad} <span>$${productoTotal}</span>`;
            detallesResumen.appendChild(detalle);
        });
        
        // Actualizar totales
        totalesResumen.innerHTML = `
            <p>Subtotal: <span>$${subtotal}</span></p>
            <p>Envío: <span>$${envio}</span></p>
        `;
        
        const total = subtotal + envio;
        totalAPagar.innerHTML = `<p>TOTAL A PAGAR <span>$${total}</span></p>`;
    }

    function guardarCarrito() {
        try {
            localStorage.setItem('carrito', JSON.stringify(carrito));
            // Actualizar también el badge del carrito si existe
            const badge = document.getElementById('cart-count');
            if (badge) {
                const totalItems = carrito.reduce((sum, producto) => sum + producto.cantidad, 0);
                badge.textContent = totalItems;
                badge.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        } catch (e) {
            console.error('Error al guardar el carrito:', e);
        }
    }

    function guardarInformacionEnvio() {
        // Guardar información de envío para posible uso futuro
        const infoEnvio = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            direccion: document.getElementById('direccion').value,
            ciudad: document.getElementById('ciudad').value,
            cp: document.getElementById('cp').value,
            provincia: document.getElementById('provincia').value
        };
        localStorage.setItem('infoEnvio', JSON.stringify(infoEnvio));
    }

    // ============================================
    // FUNCIONES AUXILIARES EXISTENTES (modificadas)
    // ============================================
    
    function mostrarPaso(numeroPaso) {
        console.log(`Mostrando paso ${numeroPaso}`);
        
        // Ocultar TODAS las secciones principales
        seccionPaso1.classList.add('desactivado');
        seccionPaso2.classList.add('desactivado');
        seccionPaso3.classList.add('desactivado');
        seccionPaso4.classList.add('desactivado');
        
        // Mostrar solo la sección del paso actual
        const pasoActualElement = document.getElementById(`paso-${numeroPaso}`);
        if (pasoActualElement) {
            pasoActualElement.classList.remove('desactivado');
        }
        
        // Actualizar estado
        pasoActual = numeroPaso;
        
        // Actualizar barra de progreso
        actualizarProgreso();
        
        // Actualizar título del resumen según el paso
        actualizarTituloResumen(numeroPaso);
        
        // Resetear estados internos si es necesario
        if (numeroPaso === 2) {
            resetearPaso2();
        }
        
        // En el paso 4, vaciar el carrito
        if (numeroPaso === 4) {
            vaciarCarrito();
        }
    }

    function vaciarCarrito() {
        carrito = [];
        guardarCarrito();
    }

    function actualizarTituloResumen(numeroPaso) {
        if (!tituloResumen) return;
        
        const titulos = {
            1: 'Resumen del Pedido',
            2: 'Resumen del Pedido', 
            3: 'Resumen del Pedido',
            4: 'Pedido Confirmado'
        };
        tituloResumen.textContent = titulos[numeroPaso] || 'Resumen del Pedido';
    }

    function resetearPaso2() {
        formularioTarjeta.classList.add('desactivado');
        metodoPago.classList.remove('desactivado');
        metodoPagoSeleccionado = null;
        document.getElementById('form-tarjeta')?.reset();
    }

    function actualizarProgreso() {
        console.log(`Actualizando progreso al paso ${pasoActual}`);
        
        pasos.forEach((paso, index) => {
            const numeroPaso = parseInt(paso.getAttribute('data-paso'));
            if (numeroPaso <= pasoActual) {
                paso.classList.add('activo');
            } else {
                paso.classList.remove('activo');
            }
        });

        lineas.forEach((linea, index) => {
            const numeroLinea = parseInt(linea.getAttribute('data-linea'));
            if (numeroLinea < pasoActual) {
                linea.classList.add('activo');
            } else {
                linea.classList.remove('activo');
            }
        });
    }

    function validarFormularioTarjeta() {
        const nroTarjeta = document.getElementById('nro-tarjeta').value;
        const soloNumeros = nroTarjeta.replace(/\s/g, '');
        const nombre = document.getElementById('nya').value;
        const expiracion = document.getElementById('expiracion').value;
        const cvc = document.getElementById('cvc').value;

        if (!soloNumeros || soloNumeros.length !== 16) {
            alert('Por favor ingresa un número de tarjeta válido (16 dígitos)');
            return false;
        }

        if (!nombre) {
            alert('Por favor ingresa el nombre del titular');
            return false;
        }

        if (!expiracion || !/^\d{2}\/\d{2}$/.test(expiracion)) {
            alert('Por favor ingresa una fecha de expiración válida (MM/AA)');
            return false;
        }

        if (!cvc || cvc.length < 3) {
            alert('Por favor ingresa un CVC válido');
            return false;
        }

        return true;
    }

    function validarFormularioEnvio() {
        const camposRequeridos = ['nombre', 'apellido', 'email', 'telefono', 'direccion', 'ciudad', 'cp', 'provincia'];
        
        for (let campo of camposRequeridos) {
            const elemento = document.getElementById(campo);
            if (!elemento.value.trim()) {
                alert(`Por favor completa el campo: ${campo}`);
                elemento.focus();
                return false;
            }
        }

        const email = document.getElementById('email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor ingresa un email válido');
            return false;
        }

        return true;
    }

    // Formateadores de input (mantener igual)
    document.getElementById('nro-tarjeta')?.addEventListener('input', function(e) {
        let cursorPosition = e.target.selectionStart;
        let cleanValue = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        cleanValue = cleanValue.substring(0, 16);
        
        let formattedValue = '';
        for (let i = 0; i < cleanValue.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += cleanValue[i];
        }
        
        e.target.value = formattedValue;
        let addedSpaces = Math.floor(cursorPosition / 4);
        let newCursorPosition = cursorPosition + addedSpaces;
        e.target.setSelectionRange(newCursorPosition, newCursorPosition);
    });

    document.getElementById('expiracion')?.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });

    document.getElementById('cvc')?.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/gi, '');
    });

    // Generar número de pedido aleatorio
    function generarNumeroPedido() {
        const numero = Math.floor(100000 + Math.random() * 900000);
        const elemento = document.getElementById('numero-pedido');
        if (elemento) {
            elemento.textContent = numero;
        }
    }

    generarNumeroPedido();
});
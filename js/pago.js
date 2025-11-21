// pago.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos de la barra de progreso
    const pasos = document.querySelectorAll('.paso');
    const lineas = document.querySelectorAll('.linea');
    
    // Secciones principales (ahora son 4 pasos)
    const seccionPaso1 = document.getElementById('paso-1');
    const seccionPaso2 = document.getElementById('paso-2');
    const seccionPaso3 = document.getElementById('paso-3');
    const seccionPaso4 = document.getElementById('paso-4');
    
    // Elementos del Paso 1 (Carrito)
    const botonContinuarCarrito = document.querySelector('.boton-continuar-carrito');
    
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

    // Inicializar - mostrar solo el paso 1 (Carrito)
    mostrarPaso(1);

    // ============================================
    // PASO 1: Carrito
    // ============================================
    
    botonContinuarCarrito?.addEventListener('click', function() {
        mostrarPaso(2);
    });

    // Funcionalidad del carrito
    inicializarCarrito();

    // ============================================
    // PASO 2: Selección de método de pago
    // ============================================
    
    botonesMetodoPago.forEach(boton => {
        boton.addEventListener('click', function() {
            metodoPagoSeleccionado = this.getAttribute('data-metodo');
            
            if (metodoPagoSeleccionado === 'tarjeta') {
                // Ocultar métodos y mostrar formulario de tarjeta
                metodoPago.classList.add('desactivado');
                formularioTarjeta.classList.remove('desactivado');
            } else if (metodoPagoSeleccionado === 'mercadopago') {
                // Ir directamente al paso 3 (Envío)
                mostrarPaso(3);
            }
        });
    });

    // Volver a métodos de pago desde formulario de tarjeta
    botonVolverMetodos?.addEventListener('click', function() {
        formularioTarjeta.classList.add('desactivado');
        metodoPago.classList.remove('desactivado');
        metodoPagoSeleccionado = null;
    });

    // Continuar con pago de tarjeta
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
            mostrarPaso(4);
        }
    });

    // Volver al paso 2 desde envío
    botonVolverPago?.addEventListener('click', function() {
        // Resetear el estado del paso 2 antes de volver
        resetearPaso2();
        mostrarPaso(2);
    });

    // ============================================
    // FUNCIONES AUXILIARES
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
    }

    function inicializarCarrito() {
        // Botones de cantidad
        document.querySelectorAll('.btn-cantidad').forEach(btn => {
            btn.addEventListener('click', function() {
                const accion = this.getAttribute('data-accion');
                const producto = this.closest('.producto-carrito');
                const cantidadElement = producto.querySelector('.cantidad');
                let cantidad = parseInt(cantidadElement.textContent);
                
                if (accion === 'sumar') {
                    cantidad++;
                } else if (accion === 'restar' && cantidad > 1) {
                    cantidad--;
                }
                
                cantidadElement.textContent = cantidad;
                actualizarPrecioProducto(producto);
                actualizarResumen();
            });
        });

        // Botones de eliminar
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const producto = this.closest('.producto-carrito');
                producto.remove();
                actualizarResumen();
                
                // Si no quedan productos, mostrar mensaje
                if (document.querySelectorAll('.producto-carrito').length === 0) {
                    mostrarCarritoVacio();
                }
            });
        });
    }

    function actualizarPrecioProducto(producto) {
        const cantidad = parseInt(producto.querySelector('.cantidad').textContent);
        const precioUnitario = parseInt(producto.querySelector('.precio-unitario').textContent.replace('$', '').replace(' c/u', ''));
        const precioTotalElement = producto.querySelector('.precio-total');
        
        const precioTotal = cantidad * precioUnitario;
        precioTotalElement.textContent = `$${precioTotal}`;
    }

    function actualizarResumen() {
        // Aquí puedes implementar la actualización del resumen
        // cuando cambian las cantidades o se eliminan productos
        console.log('Actualizando resumen...');
    }

    function mostrarCarritoVacio() {
        const carritoContainer = document.querySelector('.carrito-container');
        carritoContainer.innerHTML = `
            <div class="carrito-vacio">
                <i class="fas fa-shopping-cart" style="font-size: 4rem; color: #6c757d; margin-bottom: 20px;"></i>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega algunos productos para continuar</p>
                <button class="boton" onclick="window.location.href='../pages/tienda.html'">
                    <i class="fas fa-arrow-left"></i> Volver a Comprar
                </button>
            </div>
        `;
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
        // Ocultar formulario de tarjeta si está visible
        formularioTarjeta.classList.add('desactivado');
        // Mostrar métodos de pago
        metodoPago.classList.remove('desactivado');
        // Resetear selección de método
        metodoPagoSeleccionado = null;
        // Limpiar formulario de tarjeta
        document.getElementById('form-tarjeta')?.reset();
    }

    function actualizarProgreso() {
        console.log(`Actualizando progreso al paso ${pasoActual}`);
        
        // Actualizar pasos
        pasos.forEach((paso, index) => {
            const numeroPaso = parseInt(paso.getAttribute('data-paso'));
            if (numeroPaso <= pasoActual) {
                paso.classList.add('activo');
            } else {
                paso.classList.remove('activo');
            }
        });

        // Actualizar líneas
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

        // Validar 16 dígitos (sin contar espacios)
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

        // Validar email
        const email = document.getElementById('email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor ingresa un email válido');
            return false;
        }

        return true;
    }

    // Formateadores de input
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

    // Generar número de pedido aleatorio para la confirmación
    function generarNumeroPedido() {
        const numero = Math.floor(100000 + Math.random() * 900000);
        document.getElementById('numero-pedido').textContent = numero;
    }

    generarNumeroPedido();
});
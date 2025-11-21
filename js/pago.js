// pago.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos de la barra de progreso
    const pasos = document.querySelectorAll('.paso');
    const lineas = document.querySelectorAll('.linea');
    
    // Secciones principales
    const seccionPaso1 = document.getElementById('paso-1');
    const seccionPaso2 = document.getElementById('paso-2');
    const seccionPaso3 = document.getElementById('paso-3');
    
    // Elementos del Paso 1
    const metodoPago = document.querySelector('.metodo-pago');
    const formularioTarjeta = document.getElementById('formulario-tarjeta');
    const botonesMetodoPago = document.querySelectorAll('.card-pago .boton');
    const botonPagarTarjeta = document.querySelector('.boton-pagar-tarjeta');
    const botonVolverMetodos = document.querySelector('.boton-volver-metodos');
    
    // Elementos del Paso 2
    const botonContinuarEnvio = document.querySelector('.boton-continuar-envio');
    const botonVolverPago = document.querySelector('.boton-volver-pago');
    
    // Elementos del Paso 3
    const botonVolverInicio = document.querySelector('.boton-volver-inicio');
    
    // Estado actual
    let pasoActual = 1;
    let metodoPagoSeleccionado = null;

    // Inicializar - mostrar solo el paso 1
    mostrarPaso(1);

    // ============================================
    // PASO 1: Selección de método de pago
    // ============================================
    
    botonesMetodoPago.forEach(boton => {
        boton.addEventListener('click', function() {
            metodoPagoSeleccionado = this.getAttribute('data-metodo');
            
            if (metodoPagoSeleccionado === 'tarjeta') {
                // Ocultar métodos y mostrar formulario de tarjeta
                metodoPago.classList.add('desactivado');
                formularioTarjeta.classList.remove('desactivado');
            } else if (metodoPagoSeleccionado === 'mercadopago') {
                // Ir directamente al paso 2
                mostrarPaso(2);
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
            mostrarPaso(2);
        }
    });

    // ============================================
    // PASO 2: Información de envío
    // ============================================
    
    botonContinuarEnvio?.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (validarFormularioEnvio()) {
            mostrarPaso(3);
        }
    });

    // Volver al paso 1 desde envío
    botonVolverPago?.addEventListener('click', function() {
        // Resetear el estado del paso 1 antes de volver
        resetearPaso1();
        mostrarPaso(1);
    });

    // ============================================
    // PASO 3: Confirmación
    // ============================================
    
    botonVolverInicio?.addEventListener('click', function() {
        // Aquí podrías redirigir al inicio
        alert('Redirigiendo al inicio...');
        // window.location.href = '/index.html';
    });

    // ============================================
    // FUNCIONES AUXILIARES
    // ============================================
    
    function mostrarPaso(numeroPaso) {
        // Ocultar todas las secciones principales
        seccionPaso1.classList.add('desactivado');
        seccionPaso2.classList.add('desactivado');
        seccionPaso3.classList.add('desactivado');
        
        // Mostrar solo la sección del paso actual
        document.getElementById(`paso-${numeroPaso}`).classList.remove('desactivado');
        
        // Actualizar estado
        pasoActual = numeroPaso;
        
        // Actualizar barra de progreso
        actualizarProgreso();
        
        // Si estamos volviendo al paso 1, resetear su estado interno
        if (numeroPaso === 1) {
            resetearPaso1();
        }
    }

    function resetearPaso1() {
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
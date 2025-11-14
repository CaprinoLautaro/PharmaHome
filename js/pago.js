  // Datos hardcodeados del carrito
        const cartItems = [
            { name: "Ibuprofeno 400mg", quantity: 2, price: 2500, total: 5000, category: "venta-libre" },
            { name: "Tafiro! Plus", quantity: 2, price: 3000, total: 6000, category: "venta-libre" },
            { name: "Amoxidal 500mg", quantity: 1, price: 6000, total: 6000, category: "recetados" }
        ];
        
        const discount = 5500;
        const shippingCost = 500;
        
        // Función para navegar entre secciones
        function showSection(sectionId) {
            // Ocultar todas las secciones
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar la sección seleccionada
            document.getElementById(sectionId).classList.add('active');
            
            // Actualizar indicador de pasos
            updateStepIndicator(sectionId);
        }
        
        function updateStepIndicator(sectionId) {
            const steps = document.querySelectorAll('.step');
            steps.forEach(step => {
                step.classList.remove('active', 'completed');
            });
            
            switch(sectionId) {
                case 'cart-section':
                    document.getElementById('step-cart').classList.add('active');
                    break;
                case 'shipping-section':
                    document.getElementById('step-cart').classList.add('completed');
                    document.getElementById('step-shipping').classList.add('active');
                    break;
                case 'payment-section':
                    document.getElementById('step-cart').classList.add('completed');
                    document.getElementById('step-shipping').classList.add('completed');
                    document.getElementById('step-payment').classList.add('active');
                    break;
                case 'confirmation-section':
                    document.getElementById('step-cart').classList.add('completed');
                    document.getElementById('step-shipping').classList.add('completed');
                    document.getElementById('step-payment').classList.add('completed');
                    document.getElementById('step-confirmation').classList.add('active');
                    break;
            }
        }
        
        function goToShipping() {
            showSection('shipping-section');
        }
        
        function goToPayment() {
            // Validar formulario de envío antes de continuar
            const form = document.getElementById('shipping-form');
            if (form.checkValidity()) {
                showSection('payment-section');
            } else {
                form.reportValidity();
            }
        }
        
        function goToConfirmation() {
            showSection('confirmation-section');
        }
        
        function goToHome() {
            showSection('cart-section');
        }
        
        // Inicializar la página mostrando la sección del carrito
        document.addEventListener('DOMContentLoaded', function() {
            showSection('cart-section');
        });
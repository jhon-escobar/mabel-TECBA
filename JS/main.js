// Funcionalidades principales
document.addEventListener('DOMContentLoaded', function() {
    // Navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Carrusel de testimonios
    let currentTestimonial = 0;
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    
    function showTestimonial(index) {
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        testimonialSlides[index].classList.add('active');
    }
    
    document.getElementById('testimonial-next').addEventListener('click', function() {
        currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
        showTestimonial(currentTestimonial);
    });
    
    document.getElementById('testimonial-prev').addEventListener('click', function() {
        currentTestimonial = (currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length;
        showTestimonial(currentTestimonial);
    });
    
    // Auto-avance del carrusel
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    
    // Carrito de compras - toggle
    const cartToggle = document.getElementById('cart-toggle');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartClose = document.getElementById('cart-close');
    
    cartToggle.addEventListener('click', function() {
        cartSidebar.classList.add('active');
    });
    
    cartClose.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
    });
    
    // Modal de usuario - toggle
    const userToggle = document.getElementById('user-toggle');
    const userModal = document.getElementById('user-modal');
    const userClose = document.getElementById('user-close');
    
    userToggle.addEventListener('click', function() {
        userModal.classList.add('active');
    });
    
    userClose.addEventListener('click', function() {
        userModal.classList.remove('active');
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(e) {
        if (e.target === userModal) {
            userModal.classList.remove('active');
        }
    });
    
    // Formulario de login
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Aquí iría la lógica real de autenticación
        console.log('Login attempt:', { email, password });
        
        // Simulación de login exitoso
        showNotification('Inicio de sesión exitoso');
        userModal.classList.remove('active');
        loginForm.reset();
    });
    
    // Botón CTA del hero
    const heroCta = document.getElementById('hero-cta');
    
    heroCta.addEventListener('click', function() {
        const catalogSection = document.getElementById('catalogo');
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = catalogSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
    
    // Botón de checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Tu carrito está vacío');
            return;
        }
        
        // Aquí iría la lógica real de checkout
        showNotification('Procediendo al pago...');
        
        // Simulación de proceso de pago
        setTimeout(() => {
            showNotification('¡Compra realizada con éxito!');
            cart = [];
            updateCart();
            cartSidebar.classList.remove('active');
        }, 2000);
    });
    
    // Mostrar sección activa en navegación
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveSection);
});
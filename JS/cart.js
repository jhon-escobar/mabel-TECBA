// Carrito de compras
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// Función para agregar producto al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification('Producto agregado al carrito');
}

// Función para eliminar producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Función para actualizar cantidad de producto en el carrito
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
    }
    
    updateCart();
}

// Función para actualizar la visualización del carrito
function updateCart() {
    // Actualizar contador
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = cartCount;
    
    // Actualizar total
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    document.getElementById('cart-total-price').textContent = `$${cartTotal.toLocaleString('es-CL')}`;
    
    // Actualizar items del carrito
    const cartItems = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toLocaleString('es-CL')}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">Eliminar</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Agregar event listeners a los botones del carrito
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateQuantity(productId, item.quantity - 1);
            }
        });
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateQuantity(productId, item.quantity + 1);
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Función para mostrar notificación
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: var(--shadow);
        z-index: 1003;
        transition: var(--transition);
    `;
    
    document.body.appendChild(notification);
    
    // Remover notificación después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Inicializar carrito
document.addEventListener('DOMContentLoaded', function() {
    updateCart();
});
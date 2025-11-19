// Datos de productos
const products = [
    {
        id: 1,
        name: "Quinua Real Andes Gold",
        description: "Quinua precocida premium, lista en 5 minutos",
        price: 5990,
        image: "images/productos/quinua-500g.jpg",
        type: "real",
        size: "500g"
    },
    {
        id: 2,
        name: "Quinua Real Andes Gold",
        description: "Quinua precocida premium, lista en 5 minutos",
        price: 10990,
        image: "images/productos/quinua-1kg.jpg",
        type: "real",
        size: "1kg"
    },
    {
        id: 3,
        name: "Quinua Orgánica Andes Gold",
        description: "Quinua orgánica precocida, certificada",
        price: 7990,
        image: "images/productos/quinua-organica.jpg",
        type: "organica",
        size: "500g"
    },
    {
        id: 4,
        name: "Quinua Orgánica Andes Gold",
        description: "Quinua orgánica precocida, certificada",
        price: 14990,
        image: "images/productos/quinua-organica.jpg",
        type: "organica",
        size: "1kg"
    }
];

// Función para renderizar productos
function renderProducts(filteredProducts = products) {
    const productsGrid = document.getElementById('products-grid');
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No se encontraron productos con los filtros seleccionados.</p>';
        return;
    }
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description} - ${product.size}</p>
                <div class="product-price">$${product.price.toLocaleString('es-CL')}</div>
                <button class="add-to-cart" data-id="${product.id}">Agregar al Carrito</button>
            </div>
        </div>
    `).join('');
    
    // Agregar event listeners a los botones de agregar al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Función para filtrar productos
function filterProducts() {
    const typeFilter = document.getElementById('type-filter').value;
    const sizeFilter = document.getElementById('size-filter').value;
    
    let filteredProducts = products;
    
    if (typeFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.type === typeFilter);
    }
    
    if (sizeFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.size === sizeFilter);
    }
    
    renderProducts(filteredProducts);
}

// Inicializar productos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    
    // Configurar event listeners para filtros
    document.getElementById('type-filter').addEventListener('change', filterProducts);
    document.getElementById('size-filter').addEventListener('change', filterProducts);
});
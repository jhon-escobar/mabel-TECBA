// Gestión de productos en el panel administrativo
class ProductsAdmin {
    constructor() {
        this.products = window.productsData.products;
        this.initializeEventListeners();
        this.loadProductsTable();
    }

    initializeEventListeners() {
        // Botón para agregar producto
        document.getElementById('add-product-btn').addEventListener('click', () => {
            this.showProductModal();
        });

        // Formulario de producto
        document.getElementById('product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });

        // Cancelar producto
        document.getElementById('cancel-product-btn').addEventListener('click', () => {
            this.closeProductModal();
        });
    }

    loadProductsTable() {
        const tbody = document.getElementById('products-tbody');
        
        tbody.innerHTML = this.products.map(product => `
            <tr>
                <td>
                    <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                </td>
                <td>${product.name}</td>
                <td>${this.getTypeLabel(product.type)}</td>
                <td>${product.size}</td>
                <td>$${product.price.toLocaleString('es-CL')}</td>
                <td>${product.stock}</td>
                <td>
                    <span class="status-badge ${product.status === 'active' ? 'status-active' : 'status-inactive'}">
                        ${product.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td>
                    <button class="btn-action btn-edit" onclick="productsAdmin.editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="productsAdmin.deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getTypeLabel(type) {
        const types = {
            'real': 'Quinua Real',
            'organica': 'Orgánica'
        };
        return types[type] || type;
    }

    showProductModal(product = null) {
        const modal = document.getElementById('product-modal');
        const title = document.getElementById('product-modal-title');
        const form = document.getElementById('product-form');

        if (product) {
            title.textContent = 'Editar Producto';
            this.populateForm(product);
        } else {
            title.textContent = 'Nuevo Producto';
            form.reset();
            form.dataset.editId = '';
        }

        modal.classList.add('active');
    }

    populateForm(product) {
        const form = document.getElementById('product-form');
        form.dataset.editId = product.id;

        document.getElementById('product-name').value = product.name;
        document.getElementById('product-sku').value = product.sku;
        document.getElementById('product-type').value = product.type;
        document.getElementById('product-size').value = product.size;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-image').value = product.image;
    }

    saveProduct() {
        const form = document.getElementById('product-form');
        const editId = form.dataset.editId;
        const formData = this.getFormData();

        if (editId) {
            // Editar producto existente
            this.updateProduct(parseInt(editId), formData);
        } else {
            // Crear nuevo producto
            this.createProduct(formData);
        }

        this.closeProductModal();
        this.loadProductsTable();
        this.updateDashboardStats();
    }

    getFormData() {
        return {
            name: document.getElementById('product-name').value,
            sku: document.getElementById('product-sku').value,
            type: document.getElementById('product-type').value,
            size: document.getElementById('product-size').value,
            price: parseFloat(document.getElementById('product-price').value),
            stock: parseInt(document.getElementById('product-stock').value),
            description: document.getElementById('product-description').value,
            image: document.getElementById('product-image').value,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };
    }

    createProduct(productData) {
        const newId = Math.max(...this.products.map(p => p.id)) + 1;
        const newProduct = {
            id: newId,
            ...productData
        };

        this.products.push(newProduct);
        this.saveToLocalStorage();
        this.showNotification('Producto creado exitosamente');
    }

    updateProduct(id, productData) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = {
                ...this.products[index],
                ...productData,
                updatedAt: new Date().toISOString().split('T')[0]
            };
            this.saveToLocalStorage();
            this.showNotification('Producto actualizado exitosamente');
        }
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            this.showProductModal(product);
        }
    }

    deleteProduct(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.saveToLocalStorage();
            this.loadProductsTable();
            this.updateDashboardStats();
            this.showNotification('Producto eliminado exitosamente');
        }
    }

    closeProductModal() {
        document.getElementById('product-modal').classList.remove('active');
    }

    saveToLocalStorage() {
        // En un caso real, aquí se haría una petición al servidor
        // Por ahora, solo actualizamos el objeto global
        window.productsData.products = this.products;
        
        // Simular guardado en localStorage
        localStorage.setItem('andesGoldProducts', JSON.stringify(this.products));
    }

    updateDashboardStats() {
        if (window.adminPanel) {
            window.adminPanel.updateStats();
        }
    }

    showNotification(message) {
        // Reutilizar la función de notificación del panel principal
        if (window.adminPanel && window.adminPanel.showNotification) {
            window.adminPanel.showNotification(message);
        } else {
            alert(message);
        }
    }
}

// Inicializar gestión de productos
document.addEventListener('DOMContentLoaded', function() {
    window.productsAdmin = new ProductsAdmin();
});
// Gestión de pedidos en el panel administrativo
class OrdersAdmin {
    constructor() {
        this.orders = window.ordersData.orders;
        this.initializeEventListeners();
        this.loadOrdersTable();
    }

    initializeEventListeners() {
        // Filtro de estado
        document.getElementById('order-status-filter').addEventListener('change', () => {
            this.loadOrdersTable();
        });
    }

    loadOrdersTable() {
        const tbody = document.getElementById('orders-tbody');
        const statusFilter = document.getElementById('order-status-filter').value;
        
        let filteredOrders = this.orders;
        
        if (statusFilter !== 'all') {
            filteredOrders = this.orders.filter(order => order.status === statusFilter);
        }

        tbody.innerHTML = filteredOrders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>${this.formatDate(order.createdAt)}</td>
                <td>$${order.total.toLocaleString('es-CL')}</td>
                <td>
                    <span class="status-badge status-${order.status}">
                        ${this.getStatusLabel(order.status)}
                    </span>
                </td>
                <td>
                    <button class="btn-action btn-view" onclick="ordersAdmin.viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" onclick="ordersAdmin.editOrderStatus('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getStatusLabel(status) {
        const statusLabels = {
            'pendiente': 'Pendiente',
            'procesando': 'Procesando',
            'enviado': 'Enviado',
            'entregado': 'Entregado',
            'cancelado': 'Cancelado'
        };
        return statusLabels[status] || status;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CL');
    }

    viewOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            this.showOrderModal(order);
        }
    }

    showOrderModal(order) {
        const modal = document.getElementById('order-modal');
        const content = document.getElementById('order-details-content');

        content.innerHTML = `
            <div class="order-details">
                <div class="detail-section">
                    <h4>Información del Pedido</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>ID Pedido:</label>
                            <span>${order.id}</span>
                        </div>
                        <div class="detail-item">
                            <label>Fecha:</label>
                            <span>${this.formatDateTime(order.createdAt)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Estado:</label>
                            <span class="status-badge status-${order.status}">
                                ${this.getStatusLabel(order.status)}
                            </span>
                        </div>
                        <div class="detail-item">
                            <label>Método de Pago:</label>
                            <span>${this.getPaymentMethodLabel(order.paymentMethod)}</span>
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>Información del Cliente</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Nombre:</label>
                            <span>${order.customerName}</span>
                        </div>
                        <div class="detail-item">
                            <label>Email:</label>
                            <span>${order.customerEmail}</span>
                        </div>
                        <div class="detail-item">
                            <label>Teléfono:</label>
                            <span>${order.customerPhone}</span>
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>Dirección de Envío</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Dirección:</label>
                            <span>${order.shippingAddress.street}</span>
                        </div>
                        <div class="detail-item">
                            <label>Ciudad:</label>
                            <span>${order.shippingAddress.city}</span>
                        </div>
                        <div class="detail-item">
                            <label>Región:</label>
                            <span>${order.shippingAddress.region}</span>
                        </div>
                        <div class="detail-item">
                            <label>Código Postal:</label>
                            <span>${order.shippingAddress.zipCode}</span>
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>Productos</h4>
                    <table class="order-items-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>$${item.price.toLocaleString('es-CL')}</td>
                                    <td>${item.quantity}</td>
                                    <td>$${item.total.toLocaleString('es-CL')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
                                <td><strong>$${order.subtotal.toLocaleString('es-CL')}</strong></td>
                            </tr>
                            <tr>
                                <td colspan="3" style="text-align: right;"><strong>Envío:</strong></td>
                                <td><strong>$${order.shipping.toLocaleString('es-CL')}</strong></td>
                            </tr>
                            <tr>
                                <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                                <td><strong>$${order.total.toLocaleString('es-CL')}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    getPaymentMethodLabel(method) {
        const methods = {
            'webpay': 'Webpay',
            'meru': 'MERU',
            'airtm': 'AirTM'
        };
        return methods[method] || method;
    }

    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    editOrderStatus(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            const newStatus = prompt(
                'Selecciona el nuevo estado del pedido:\n\n' +
                'pendiente - Pendiente\n' +
                'procesando - Procesando\n' +
                'enviado - Enviado\n' +
                'entregado - Entregado\n' +
                'cancelado - Cancelado\n\n' +
                'Estado actual: ' + this.getStatusLabel(order.status),
                order.status
            );

            if (newStatus && this.isValidStatus(newStatus)) {
                this.updateOrderStatus(orderId, newStatus);
            } else if (newStatus) {
                alert('Estado no válido. Los estados válidos son: pendiente, procesando, enviado, entregado, cancelado');
            }
        }
    }

    isValidStatus(status) {
        const validStatuses = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];
        return validStatuses.includes(status);
    }

    updateOrderStatus(orderId, newStatus) {
        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            this.orders[orderIndex].status = newStatus;
            this.orders[orderIndex].updatedAt = new Date().toISOString();
            
            this.saveToLocalStorage();
            this.loadOrdersTable();
            this.showNotification(`Estado del pedido ${orderId} actualizado a ${this.getStatusLabel(newStatus)}`);
        }
    }

    saveToLocalStorage() {
        // En un caso real, aquí se haría una petición al servidor
        window.ordersData.orders = this.orders;
        localStorage.setItem('andesGoldOrders', JSON.stringify(this.orders));
    }

    showNotification(message) {
        if (window.adminPanel && window.adminPanel.showNotification) {
            window.adminPanel.showNotification(message);
        } else {
            alert(message);
        }
    }
}

// Inicializar gestión de pedidos
document.addEventListener('DOMContentLoaded', function() {
    window.ordersAdmin = new OrdersAdmin();
});
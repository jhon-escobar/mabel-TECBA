// Gestión de reportes en el panel administrativo
class ReportsAdmin {
    constructor() {
        this.initializeEventListeners();
        this.loadReportsData();
    }

    initializeEventListeners() {
        // Botón aplicar filtros
        document.getElementById('apply-filters-btn').addEventListener('click', () => {
            this.generateReport();
        });

        // Botón exportar ventas
        document.getElementById('export-sales-btn').addEventListener('click', () => {
            this.exportSalesReport();
        });

        // Botón generar reporte
        document.getElementById('generate-report-btn').addEventListener('click', () => {
            this.generateCustomReport();
        });
    }

    loadReportsData() {
        this.generateReport();
    }

    generateReport() {
        const reportType = document.getElementById('report-type').value;
        const dateFrom = document.getElementById('date-from').value;
        const dateTo = document.getElementById('date-to').value;

        switch(reportType) {
            case 'ventas':
                this.generateSalesReport(dateFrom, dateTo);
                break;
            case 'productos':
                this.generateProductsReport(dateFrom, dateTo);
                break;
            case 'clientes':
                this.generateCustomersReport(dateFrom, dateTo);
                break;
            case 'inventario':
                this.generateInventoryReport(dateFrom, dateTo);
                break;
        }
    }

    generateSalesReport(dateFrom, dateTo) {
        const orders = this.filterOrdersByDate(window.ordersData.orders, dateFrom, dateTo);
        
        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
        
        const summaryContent = document.getElementById('report-summary-content');
        summaryContent.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Ventas Totales:</span>
                <span class="summary-value">$${totalSales.toLocaleString('es-CL')}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Total Pedidos:</span>
                <span class="summary-value">${totalOrders}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Valor Promedio por Pedido:</span>
                <span class="summary-value">$${avgOrderValue.toLocaleString('es-CL', {maximumFractionDigits: 0})}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Período:</span>
                <span class="summary-value">${this.getPeriodLabel(dateFrom, dateTo)}</span>
            </div>
        `;

        this.renderSalesChart(orders);
    }

    generateProductsReport(dateFrom, dateTo) {
        const orders = this.filterOrdersByDate(window.ordersData.orders, dateFrom, dateTo);
        const productSales = this.calculateProductSales(orders);
        
        const summaryContent = document.getElementById('report-summary-content');
        summaryContent.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Productos Vendidos:</span>
                <span class="summary-value">${Object.values(productSales).reduce((sum, qty) => sum + qty, 0)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Productos Únicos:</span>
                <span class="summary-value">${Object.keys(productSales).length}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Producto Más Vendido:</span>
                <span class="summary-value">${this.getTopProduct(productSales)}</span>
            </div>
        `;

        this.renderProductsChart(productSales);
    }

    generateCustomersReport(dateFrom, dateTo) {
        const orders = this.filterOrdersByDate(window.ordersData.orders, dateFrom, dateTo);
        const customerStats = this.calculateCustomerStats(orders);
        
        const summaryContent = document.getElementById('report-summary-content');
        summaryContent.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Clientes Activos:</span>
                <span class="summary-value">${customerStats.activeCustomers}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Nuevos Clientes:</span>
                <span class="summary-value">${customerStats.newCustomers}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Tasa de Repetición:</span>
                <span class="summary-value">${customerStats.repeatRate}%</span>
            </div>
        `;

        this.renderCustomersChart(customerStats);
    }

    generateInventoryReport(dateFrom, dateTo) {
        const products = window.productsData.products;
        const lowStockProducts = products.filter(p => p.stock <= p.minStock);
        
        const summaryContent = document.getElementById('report-summary-content');
        summaryContent.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Productos en Stock:</span>
                <span class="summary-value">${products.length}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Stock Total:</span>
                <span class="summary-value">${products.reduce((sum, p) => sum + p.stock, 0)} unidades</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Productos con Stock Bajo:</span>
                <span class="summary-value negative">${lowStockProducts.length}</span>
            </div>
        `;

        this.renderInventoryChart(products);
    }

    filterOrdersByDate(orders, dateFrom, dateTo) {
        let filteredOrders = orders;

        if (dateFrom) {
            filteredOrders = filteredOrders.filter(order => 
                new Date(order.createdAt) >= new Date(dateFrom)
            );
        }

        if (dateTo) {
            filteredOrders = filteredOrders.filter(order => 
                new Date(order.createdAt) <= new Date(dateTo + 'T23:59:59')
            );
        }

        return filteredOrders;
    }

    calculateProductSales(orders) {
        const productSales = {};
        
        orders.forEach(order => {
            order.items.forEach(item => {
                if (!productSales[item.name]) {
                    productSales[item.name] = 0;
                }
                productSales[item.name] += item.quantity;
            });
        });

        return productSales;
    }

    calculateCustomerStats(orders) {
        const customerOrders = {};
        const periodStart = document.getElementById('date-from').value;
        
        orders.forEach(order => {
            if (!customerOrders[order.customerId]) {
                customerOrders[order.customerId] = 0;
            }
            customerOrders[order.customerId]++;
        });

        const activeCustomers = Object.keys(customerOrders).length;
        const repeatCustomers = Object.values(customerOrders).filter(count => count > 1).length;
        const repeatRate = activeCustomers > 0 ? (repeatCustomers / activeCustomers * 100).toFixed(1) : 0;

        // Calcular nuevos clientes (simplificado)
        const newCustomers = this.calculateNewCustomers(orders, periodStart);

        return {
            activeCustomers,
            newCustomers,
            repeatRate
        };
    }

    calculateNewCustomers(orders, periodStart) {
        if (!periodStart) return orders.length; // Simplificación
        
        // En una implementación real, se compararía con el historial completo
        return orders.filter(order => 
            new Date(order.createdAt) >= new Date(periodStart)
        ).length;
    }

    getTopProduct(productSales) {
        if (Object.keys(productSales).length === 0) return 'N/A';
        
        const topProduct = Object.entries(productSales)
            .sort(([,a], [,b]) => b - a)[0];
        
        return `${topProduct[0]} (${topProduct[1]} unidades)`;
    }

    getPeriodLabel(dateFrom, dateTo) {
        if (!dateFrom && !dateTo) return 'Todo el período';
        if (!dateTo) return `Desde ${dateFrom}`;
        if (!dateFrom) return `Hasta ${dateTo}`;
        return `${dateFrom} al ${dateTo}`;
    }

    renderSalesChart(orders) {
        const ctx = document.getElementById('report-chart').getContext('2d');
        
        // Destruir gráfico anterior si existe
        if (this.salesChart) {
            this.salesChart.destroy();
        }

        const dailySales = this.groupSalesByDay(orders);

        this.salesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(dailySales),
                datasets: [{
                    label: 'Ventas Diarias',
                    data: Object.values(dailySales),
                    backgroundColor: '#4CAF50',
                    borderColor: '#2E7D32',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Ventas por Día'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    renderProductsChart(productSales) {
        const ctx = document.getElementById('report-chart').getContext('2d');
        
        if (this.productsChart) {
            this.productsChart.destroy();
        }

        this.productsChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(productSales),
                datasets: [{
                    data: Object.values(productSales),
                    backgroundColor: [
                        '#4CAF50', '#2196F3', '#FF9800', '#9C27B0',
                        '#F44336', '#00BCD4', '#8BC34A', '#FFC107'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribución de Ventas por Producto'
                    }
                }
            }
        });
    }

    renderCustomersChart(customerStats) {
        const ctx = document.getElementById('report-chart').getContext('2d');
        
        if (this.customersChart) {
            this.customersChart.destroy();
        }

        this.customersChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Clientes Nuevos', 'Clientes Recurrentes'],
                datasets: [{
                    data: [customerStats.newCustomers, customerStats.activeCustomers - customerStats.newCustomers],
                    backgroundColor: ['#2196F3', '#4CAF50']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribución de Clientes'
                    }
                }
            }
        });
    }

    renderInventoryChart(products) {
        const ctx = document.getElementById('report-chart').getContext('2d');
        
        if (this.inventoryChart) {
            this.inventoryChart.destroy();
        }

        const stockLevels = {
            'Stock Bajo': products.filter(p => p.stock <= p.minStock).length,
            'Stock Medio': products.filter(p => p.stock > p.minStock && p.stock <= p.minStock * 3).length,
            'Stock Alto': products.filter(p => p.stock > p.minStock * 3).length
        };

        this.inventoryChart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: Object.keys(stockLevels),
                datasets: [{
                    data: Object.values(stockLevels),
                    backgroundColor: [
                        '#F44336',
                        '#FFC107',
                        '#4CAF50'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Niveles de Stock'
                    }
                }
            }
        });
    }

    groupSalesByDay(orders) {
        const dailySales = {};
        
        orders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString('es-CL');
            if (!dailySales[date]) {
                dailySales[date] = 0;
            }
            dailySales[date] += order.total;
        });

        return dailySales;
    }

    exportSalesReport() {
        const orders = window.ordersData.orders;
        const csvContent = this.convertToCSV(orders);
        this.downloadCSV(csvContent, 'reporte-ventas.csv');
    }

    convertToCSV(orders) {
        const headers = ['ID Pedido', 'Cliente', 'Fecha', 'Productos', 'Total', 'Estado'];
        const rows = orders.map(order => [
            order.id,
            order.customerName,
            new Date(order.createdAt).toLocaleDateString('es-CL'),
            order.items.map(item => `${item.name} (${item.quantity})`).join('; '),
            order.total,
            order.status
        ]);

        return [headers, ...rows].map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
    }

    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    generateCustomReport() {
        // Aquí se puede implementar la generación de reportes personalizados
        alert('Función de reporte personalizado en desarrollo');
    }
}

// Inicializar gestión de reportes
document.addEventListener('DOMContentLoaded', function() {
    window.reportsAdmin = new ReportsAdmin();
});
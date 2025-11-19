// Funcionalidades principales del panel administrativo
class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.initializeEventListeners();
        this.loadDashboardData();
    }

    initializeEventListeners() {
        // Navegación entre secciones
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Cerrar sesión
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Modales
        this.initializeModals();
    }

    showSection(sectionName) {
        // Ocultar todas las secciones
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remover clase active de todos los enlaces
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Mostrar sección seleccionada
        document.getElementById(sectionName).classList.add('active');
        
        // Activar enlace correspondiente
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Cargar datos específicos de la sección
        this.loadSectionData(sectionName);
    }

    loadSectionData(sectionName) {
        switch(sectionName) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'productos':
                this.loadProductsData();
                break;
            case 'pedidos':
                this.loadOrdersData();
                break;
            case 'clientes':
                this.loadCustomersData();
                break;
            case 'inventario':
                this.loadInventoryData();
                break;
            case 'reportes':
                this.loadReportsData();
                break;
        }
    }

    loadDashboardData() {
        // Cargar estadísticas
        this.updateStats();
        
        // Cargar gráficos
        this.loadCharts();
        
        // Cargar actividad reciente
        this.loadRecentActivity();
    }

    updateStats() {
        const orders = window.ordersData.orders;
        const users = window.usersData.users;
        const products = window.productsData.products;

        // Calcular totales
        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const totalCustomers = users.length;
        const totalProducts = products.filter(p => p.status === 'active').length;

        // Actualizar UI
        document.getElementById('total-ventas').textContent = `$${totalSales.toLocaleString('es-CL')}`;
        document.getElementById('total-pedidos').textContent = totalOrders;
        document.getElementById('total-clientes').textContent = totalCustomers;
        document.getElementById('total-productos').textContent = totalProducts;
    }

    loadCharts() {
        this.loadSalesChart();
        this.loadProductsChart();
    }

    loadSalesChart() {
        const ctx = document.getElementById('sales-chart').getContext('2d');
        const orders = window.ordersData.orders;

        // Agrupar ventas por mes
        const monthlySales = this.groupSalesByMonth(orders);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(monthlySales),
                datasets: [{
                    label: 'Ventas Mensuales',
                    data: Object.values(monthlySales),
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    loadProductsChart() {
        const ctx = document.getElementById('products-chart').getContext('2d');
        const orders = window.ordersData.orders;

        // Contar productos vendidos
        const productSales = this.countProductSales(orders);

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(productSales),
                datasets: [{
                    data: Object.values(productSales),
                    backgroundColor: [
                        '#4CAF50',
                        '#2196F3',
                        '#FF9800',
                        '#9C27B0'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }

    groupSalesByMonth(orders) {
        const monthlySales = {};
        
        orders.forEach(order => {
            const date = new Date(order.createdAt);
            const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
            
            if (!monthlySales[monthYear]) {
                monthlySales[monthYear] = 0;
            }
            
            monthlySales[monthYear] += order.total;
        });

        return monthlySales;
    }

    countProductSales(orders) {
        const productCount = {};
        
        orders.forEach(order => {
            order.items.forEach(item => {
                if (!productCount[item.name]) {
                    productCount[item.name] = 0;
                }
                productCount[item.name] += item.quantity;
            });
        });

        return productCount;
    }

    loadRecentActivity() {
        const activityList = document.getElementById('recent-activity');
        const orders = window.ordersData.orders;
        
        // Ordenar órdenes por fecha (más recientes primero)
        const recentOrders = orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        activityList.innerHTML = recentOrders.map(order => `
            <div class="activity-item">
                <div class="activity-icon sale">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${order.customerName}</strong> realizó un pedido por $${order.total.toLocaleString('es-CL')}</p>
                    <div class="activity-time">${this.formatDate(order.createdAt)}</div>
                </div>
            </div>
        `).join('');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    initializeModals() {
        // Cerrar modales
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.remove('active');
                });
            });
        });

        // Cerrar modal al hacer clic fuera
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    logout() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            // Redirigir al login (en un caso real)
            window.location.href = '../index.html';
        }
    }
}

// Inicializar el panel administrativo cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    window.adminPanel = new AdminPanel();
});
// Funcionalidades principales del panel administrativo (actualizado)
class AdminPanel {
    constructor() {
        // Verificar autenticación
        if (!window.authManager || !window.authManager.currentUser) {
            window.location.href = 'index.html';
            return;
        }

        this.currentSection = 'dashboard';
        this.currentUser = window.authManager.currentUser;
        this.initializeEventListeners();
        this.loadDashboardData();
        this.updateUserInfo();
    }

    updateUserInfo() {
        // Actualizar información del usuario en la interfaz
        const usernameElement = document.getElementById('admin-username');
        if (usernameElement) {
            usernameElement.textContent = this.currentUser.name;
        }

        // Aplicar permisos según el rol
        this.applyRolePermissions();
    }

    applyRolePermissions() {
        const role = this.currentUser.role;
        
        // Ocultar/mostrar secciones según el rol
        const sections = {
            'productos': ['superadmin', 'inventory'],
            'inventario': ['superadmin', 'inventory'],
            'reportes': ['superadmin', 'sales'],
            'pedidos': ['superadmin', 'sales'],
            'clientes': ['superadmin', 'sales']
        };

        Object.entries(sections).forEach(([section, allowedRoles]) => {
            const navLink = document.querySelector(`[data-section="${section}"]`);
            if (navLink && !allowedRoles.includes(role)) {
                navLink.style.display = 'none';
            }
        });

        // Ocultar botones según permisos
        if (role !== 'superadmin' && role !== 'inventory') {
            const addProductBtn = document.getElementById('add-product-btn');
            if (addProductBtn) addProductBtn.style.display = 'none';
        }
    }

    initializeEventListeners() {
        // Navegación entre secciones
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                
                // Verificar permisos
                if (!this.checkSectionPermission(section)) {
                    alert('No tienes permisos para acceder a esta sección');
                    return;
                }
                
                this.showSection(section);
            });
        });

        // Cerrar sesión
        document.getElementById('logout-btn').addEventListener('click', () => {
            if (window.authManager) {
                window.authManager.logout();
            }
        });

        // Modales
        this.initializeModals();
    }

    checkSectionPermission(section) {
        const permissions = {
            'dashboard': ['superadmin', 'inventory', 'sales'],
            'productos': ['superadmin', 'inventory'],
            'pedidos': ['superadmin', 'sales'],
            'clientes': ['superadmin', 'sales'],
            'inventario': ['superadmin', 'inventory'],
            'reportes': ['superadmin', 'sales']
        };

        return permissions[section]?.includes(this.currentUser.role) || false;
    }

    // ... el resto del código permanece igual ...
}

// Modificar el inicio para verificar autenticación
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está autenticado
    const savedUser = localStorage.getItem('andesGoldAdminUser');
    if (!savedUser) {
        // Redirigir al login si no hay usuario
        if (!window.location.href.includes('login.html')) {
            window.location.href = 'index.html';
        }
        return;
    }

    // Inicializar el panel administrativo
    window.adminPanel = new AdminPanel();
});

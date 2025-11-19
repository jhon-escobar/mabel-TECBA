// Sistema de autenticación para el panel administrativo
class AuthManager {
    constructor() {
        this.adminUsers = [
            {
                id: 1,
                username: 'admin',
                password: 'andesgold2024',
                name: 'Administrador Principal',
                email: 'admin@andesgold.cl',
                role: 'superadmin',
                lastLogin: null
            },
            {
                id: 2,
                username: 'inventario',
                password: 'inventario123',
                name: 'Gestor de Inventario',
                email: 'inventario@andesgold.cl',
                role: 'inventory',
                lastLogin: null
            },
            {
                id: 3,
                username: 'ventas',
                password: 'ventas2024',
                name: 'Coordinador de Ventas',
                email: 'ventas@andesgold.cl',
                role: 'sales',
                lastLogin: null
            }
        ];
        
        this.currentUser = null;
        this.initializeAuth();
    }

    initializeAuth() {
        // Verificar si ya hay una sesión activa
        const savedUser = localStorage.getItem('andesGoldAdminUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showAdminPanel();
        } else {
            this.showLoginForm();
        }
    }

    showLoginForm() {
        // Crear formulario de login dinámicamente
        const loginHTML = `
            <div class="login-container">
                <div class="login-card">
                    <div class="login-header">
                        <i class="fas fa-crown"></i>
                        <h1>Andes Gold Admin</h1>
                        <p>Panel Administrativo</p>
                    </div>
                    <form id="admin-login-form" class="login-form">
                        <div class="form-group">
                            <label for="username">Usuario:</label>
                            <input type="text" id="username" name="username" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Contraseña:</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <button type="submit" class="btn-primary btn-login">
                            <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
                        </button>
                    </form>
                    <div class="login-footer">
                        <h3>Usuarios de Prueba:</h3>
                        <div class="test-users">
                            <div class="test-user">
                                <strong>Administrador:</strong> admin / andesgold2024
                            </div>
                            <div class="test-user">
                                <strong>Inventario:</strong> inventario / inventario123
                            </div>
                            <div class="test-user">
                                <strong>Ventas:</strong> ventas / ventas2024
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.innerHTML = loginHTML;
        this.attachLoginEvents();
    }

    attachLoginEvents() {
        document.getElementById('admin-login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });
    }

    login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const user = this.adminUsers.find(u => 
            u.username === username && u.password === password
        );

        if (user) {
            // Actualizar último login
            user.lastLogin = new Date().toISOString();
            this.currentUser = user;
            
            // Guardar en localStorage
            localStorage.setItem('andesGoldAdminUser', JSON.stringify(user));
            
            this.showAdminPanel();
        } else {
            this.showError('Usuario o contraseña incorrectos');
        }
    }

    showError(message) {
        // Remover error anterior si existe
        const existingError = document.querySelector('.login-error');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'login-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            ${message}
        `;

        const form = document.getElementById('admin-login-form');
        form.insertBefore(errorDiv, form.querySelector('button'));
    }

    showAdminPanel() {
        // Cargar el panel administrativo completo
        this.loadAdminPanelHTML();
    }

    loadAdminPanelHTML() {
        // Aquí cargaríamos el HTML completo del panel administrativo
        // Por ahora, recargamos la página para mostrar el panel
        window.location.reload();
    }

    logout() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            localStorage.removeItem('andesGoldAdminUser');
            this.currentUser = null;
            this.showLoginForm();
        }
    }

    checkPermission(requiredRole) {
        if (!this.currentUser) return false;
        
        const roles = {
            'superadmin': ['superadmin', 'inventory', 'sales'],
            'inventory': ['inventory'],
            'sales': ['sales']
        };

        return roles[requiredRole].includes(this.currentUser.role);
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Estilos para el login (agregar a admin.css)
const loginStyles = `
    <style>
        .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
            padding: 20px;
        }

        .login-card {
            background: var(--white);
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            width: 100%;
            max-width: 400px;
        }

        .login-header {
            text-align: center;
            margin-bottom: 30px;
        }

        .login-header i {
            font-size: 3rem;
            color: var(--primary-color);
            margin-bottom: 15px;
        }

        .login-header h1 {
            font-family: 'Montserrat', sans-serif;
            color: var(--text-dark);
            margin: 0 0 5px 0;
        }

        .login-header p {
            color: var(--text-light);
            margin: 0;
        }

        .login-form {
            margin-bottom: 20px;
        }

        .btn-login {
            width: 100%;
            padding: 12px;
            font-size: 1.1rem;
        }

        .login-footer {
            border-top: 1px solid var(--border-color);
            padding-top: 20px;
        }

        .login-footer h3 {
            font-size: 1rem;
            margin-bottom: 15px;
            color: var(--text-dark);
            text-align: center;
        }

        .test-users {
            font-size: 0.9rem;
        }

        .test-user {
            background: var(--background-light);
            padding: 8px 12px;
            margin-bottom: 8px;
            border-radius: 4px;
            border-left: 3px solid var(--primary-color);
        }

        .test-user strong {
            color: var(--primary-color);
        }

        .login-error {
            background: #f8d7da;
            color: #721c24;
            padding: 10px 15px;
            border-radius: 4px;
            margin-bottom: 15px;
            border: 1px solid #f5c6cb;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .login-error i {
            font-size: 1.1rem;
        }
    </style>
`;

// Agregar los estilos al documento
document.head.insertAdjacentHTML('beforeend', loginStyles);

// Inicializar el sistema de autenticación
document.addEventListener('DOMContentLoaded', function() {
    window.authManager = new AuthManager();
});
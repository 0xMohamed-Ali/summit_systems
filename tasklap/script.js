// Global state
let currentUser = null;
let notifications = [];
let tasks = [];

// Show Login Form based on role
function showLoginForm(role) {
    const loginForm = document.getElementById('loginForm');
    loginForm.innerHTML = `
        <form onsubmit="handleLogin(event, '${role}')" class="form-group">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" required>
            </div>
            <button type="submit" class="btn-submit">
                <i class="fas fa-sign-in-alt"></i> Login as ${role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
        </form>
    `;
}

// Handle Login
async function handleLogin(event, role) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Simulate authentication
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create user object
        currentUser = {
            id: Date.now(),
            username: username,
            role: role,
            avatar: '/api/placeholder/80/80'
        };

        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Initialize dashboard
        await initializeDashboard();
        showNotification('Login successful', 'success');
    } catch (error) {
        showNotification('Login failed. Please try again.', 'error');
    }
}

// Initialize Dashboard
async function initializeDashboard() {
    // Hide login page and show dashboard
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('dashboardContainer').style.display = 'block';
    
    // Update user profile
    const userProfile = document.getElementById('userProfile');
    userProfile.innerHTML = `
        <img src="${currentUser.avatar}" alt="Profile" class="profile-avatar">
        <h3>${currentUser.username}</h3>
        <p>${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</p>
    `;
    
    // Set up navigation
    const navLinks = document.getElementById('navLinks');
    const links = currentUser.role === 'student' ? [
        { icon: 'fas fa-home', text: 'Dashboard', id: 'dashboard' },
        { icon: 'fas fa-tasks', text: 'My Tasks', id: 'tasks' },
        { icon: 'fas fa-chart-line', text: 'Progress', id: 'progress' }
    ] : [
        { icon: 'fas fa-home', text: 'Dashboard', id: 'dashboard' },
        { icon: 'fas fa-clipboard-check', text: 'Review Tasks', id: 'review' },
        { icon: 'fas fa-users', text: 'Students', id: 'students' }
    ];
    
    navLinks.innerHTML = links.map(link => `
        <li>
            <a href="#${link.id}" class="nav-link">
                <i class="${link.icon}"></i>
                ${link.text}
            </a>
        </li>
    `).join('');
    
    // Show appropriate dashboard
    document.getElementById('studentDashboard').style.display = 
        currentUser.role === 'student' ? 'block' : 'none';
    document.getElementById('teacherDashboard').style.display = 
        currentUser.role === 'teacher' ? 'block' : 'none';
    
    // Load initial data
    await loadDashboardData();
}

// Check Authentication Status
function checkAuthStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        initializeDashboard();
    } else {
        showLoginPage();
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        // Simulate API fetch
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Load sample tasks based on role
        tasks = currentUser.role === 'student' ? [
            {
                id: '1',
                title: 'Sample Task',
                subject: 'mathematics',
                description: 'Sample description',
                dueDate: '2024-12-01',
                priority: 'medium',
                status: 'pending',
                submittedAt: new Date().toISOString(),
                attachments: []
            }
        ] : [
            {
                id: '1',
                studentName: 'John Doe',
                title: 'Sample Submission',
                subject: 'mathematics',
                submittedAt: new Date().toISOString(),
                status: 'pending'
            }
        ];
        
        loadDashboardStats();
        updateTasksList();
        
    } catch (error) {
        showNotification('Failed to load dashboard data', 'error');
    }
}

// Logout Function
function logout() {
    // Clear all state
    localStorage.removeItem('currentUser');
    currentUser = null;
    tasks = [];
    notifications = [];
    
    // Reset UI
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.innerHTML = '';
    }
    
    // Show login page
    document.getElementById('dashboardContainer').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
    
    // Clear any active sidebars or modals
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.remove('active');
    }
    
    const modal = document.getElementById('taskDetailModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    showNotification('Logged out successfully', 'success');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    setupEventListeners();
    initializeMobileMenu();
});

// Show notification
function showNotification(message, type = 'info') {
    const toast = document.getElementById('notificationToast');
    if (toast) {
        toast.className = `notification-toast ${type}`;
        toast.textContent = message;
        toast.style.display = 'block';

        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}

// Update task list
function updateTasksList(filteredTasks = null) {
    const tasksToDisplay = filteredTasks || tasks;
    const container = currentUser.role === 'student' ? 
        document.getElementById('studentTaskList') : 
        document.getElementById('teacherTaskList');
    
    if (!container) return;
    
    const statusFilter = document.getElementById('taskStatusFilter')?.value || 'all';
    const submissionFilter = document.getElementById('submissionFilter')?.value || 'all';
    
    const filteredByStatus = tasksToDisplay.filter(task => {
        const filter = currentUser.role === 'student' ? statusFilter : submissionFilter;
        return filter === 'all' || task.status === filter;
    });
    
    container.innerHTML = filteredByStatus.map(task => `
        <div class="task-card" onclick="showTaskDetails('${task.id}')">
            <h4>${task.title}</h4>
            <p>${task.subject}</p>
            ${currentUser.role === 'teacher' ? 
                `<p>Submitted by: ${task.studentName}</p>` : ''}
            <p>Submitted: ${formatDate(task.submittedAt)}</p>
            <span class="task-status status-${task.status}">
                ${task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
        </div>
    `).join('');
}

// Export functions for HTML
window.showLoginForm = showLoginForm;
window.handleLogin = handleLogin;
window.logout = logout;
window.showTaskDetails = showTaskDetails;
window.closeModal = closeModal;
window.toggleNotifications = toggleNotifications;
window.updateTaskStatus = updateTaskStatus;
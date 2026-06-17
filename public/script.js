/**
 * 🏎️ Formula 1 API - Script Principal
 * Gerencia interações com a API e interface
 */

// ========================================
// Configurações
// ========================================

const API_BASE = 'http://localhost:3000';
let currentTheme = localStorage.getItem('theme') || 'light';
let allDrivers = [];
let editingDriverId = null;
let deletingDriverId = null;

// ========================================
// Inicialização
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initEventListeners();
    loadDashboard();
    loadTeams();
});

// ========================================
// Theme Management
// ========================================

function initTheme() {
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeButton();
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    document.body.classList.toggle('dark-mode');
    updateThemeButton();
}

function updateThemeButton() {
    const btn = document.getElementById('themeBtn');
    btn.textContent = currentTheme === 'light' ? '🌙' : '☀️';
}

// ========================================
// Event Listeners
// ========================================

function initEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.currentTarget.dataset.view;
            switchView(view);
        });
    });

    // Theme
    document.getElementById('themeBtn').addEventListener('click', toggleTheme);

    // Forms
    document.getElementById('createForm').addEventListener('submit', handleCreateDriver);
    document.getElementById('editForm').addEventListener('submit', handleEditDriver);

    // Filters
    document.getElementById('searchDriver').addEventListener('input', filterDrivers);
    document.getElementById('filterTeam').addEventListener('change', filterDrivers);
    document.getElementById('filterSort').addEventListener('change', filterDrivers);

    // Modals
    document.querySelector('#editModal .modal-close').addEventListener('click', closeEditModal);
    document.querySelector('#deleteModal .modal-close').addEventListener('click', closeDeleteModal);
    
    document.getElementById('editModal').addEventListener('click', (e) => {
        if (e.target.id === 'editModal') closeEditModal();
    });
    
    document.getElementById('deleteModal').addEventListener('click', (e) => {
        if (e.target.id === 'deleteModal') closeDeleteModal();
    });
}

// ========================================
// Navigation
// ========================================

function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    // Show selected view
    document.getElementById(viewName).classList.add('active');

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === viewName) {
            btn.classList.add('active');
        }
    });

    // Load view data
    if (viewName === 'drivers') {
        loadDrivers();
    } else if (viewName === 'ranking') {
        loadRanking();
    }
}

// ========================================
// Dashboard
// ========================================

async function loadDashboard() {
    try {
        const response = await fetch(`${API_BASE}/drivers`);
        const result = await response.json();
        
        if (result.success) {
            const drivers = result.data;
            allDrivers = drivers;

            // Update stats
            document.getElementById('totalDrivers').textContent = drivers.length;
            
            const teams = [...new Set(drivers.map(d => d.team))];
            document.getElementById('totalTeams').textContent = teams.length;

            const leader = drivers.reduce((max, d) => d.points > max.points ? d : max);
            document.getElementById('leaderPoints').textContent = leader.points;

            const totalChampionships = drivers.reduce((sum, d) => sum + d.championships, 0);
            document.getElementById('totalChampionships').textContent = totalChampionships;
        }
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        showToast('Erro ao carregar dados', 'error');
    }
}

// ========================================
// Drivers
// ========================================

async function loadDrivers() {
    try {
        const response = await fetch(`${API_BASE}/drivers`);
        const result = await response.json();
        
        if (result.success) {
            allDrivers = result.data;
            displayDrivers(allDrivers);
        }
    } catch (error) {
        console.error('Erro ao carregar pilotos:', error);
        showToast('Erro ao carregar pilotos', 'error');
        displayDrivers([]);
    }
}

function displayDrivers(drivers) {
    const container = document.getElementById('driversList');
    
    if (drivers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">😢</div>
                <p>Nenhum piloto encontrado</p>
            </div>
        `;
        return;
    }

    container.innerHTML = drivers.map(driver => `
        <div class="driver-card">
            <div class="driver-number">${driver.number}</div>
            
            <h3 class="driver-name">${driver.name}</h3>
            
            <div class="team-badge">${driver.team}</div>
            
            <div class="driver-info">
                <div class="info-item">
                    <span class="info-label">Nacionalidade</span>
                    <span class="info-value">${driver.nationality}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Pontos</span>
                    <span class="info-value">${driver.points}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Campeonatos</span>
                    <span class="info-value">${driver.championships}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Status</span>
                    <span class="active-badge">${driver.active ? '✅ Ativo' : '❌ Inativo'}</span>
                </div>
            </div>
            
            <div class="driver-actions">
                <button class="btn btn-primary btn-small" onclick="openEditModal(${driver.id})">
                    ✏️ Editar
                </button>
                <button class="btn btn-danger btn-small" onclick="openDeleteModal(${driver.id})">
                    🗑️ Remover
                </button>
            </div>
        </div>
    `).join('');
}

function filterDrivers() {
    const search = document.getElementById('searchDriver').value.toLowerCase();
    const team = document.getElementById('filterTeam').value;
    const sort = document.getElementById('filterSort').value;

    let filtered = allDrivers.filter(driver => {
        const matchSearch = driver.name.toLowerCase().includes(search);
        const matchTeam = !team || driver.team === team;
        return matchSearch && matchTeam;
    });

    if (sort === 'points') {
        filtered.sort((a, b) => b.points - a.points);
    } else if (sort === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'championships') {
        filtered.sort((a, b) => b.championships - a.championships);
    }

    displayDrivers(filtered);
}

// ========================================
// Create Driver
// ========================================

async function handleCreateDriver(e) {
    e.preventDefault();

    const driverData = {
        name: document.getElementById('driverName').value,
        team: document.getElementById('driverTeam').value,
        nationality: document.getElementById('driverNationality').value,
        number: parseInt(document.getElementById('driverNumber').value),
        points: parseInt(document.getElementById('driverPoints').value),
        championships: parseInt(document.getElementById('driverChampionships').value)
    };

    try {
        const response = await fetch(`${API_BASE}/drivers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(driverData)
        });

        const result = await response.json();

        if (result.success) {
            showToast(`✅ ${result.data.name} criado com sucesso!`, 'success');
            document.getElementById('createForm').reset();
            loadDashboard();
            switchView('drivers');
            loadDrivers();
        } else {
            showToast(`❌ ${result.error}`, 'error');
        }
    } catch (error) {
        console.error('Erro ao criar piloto:', error);
        showToast('Erro ao criar piloto', 'error');
    }
}

// ========================================
// Edit Driver
// ========================================

async function openEditModal(driverId) {
    editingDriverId = driverId;
    const driver = allDrivers.find(d => d.id === driverId);

    if (!driver) return;

    document.getElementById('editDriverId').value = driver.id;
    document.getElementById('editName').value = driver.name;
    document.getElementById('editTeam').value = driver.team;
    document.getElementById('editPoints').value = driver.points;
    document.getElementById('editChampionships').value = driver.championships;

    document.getElementById('editModal').classList.add('open');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('open');
    editingDriverId = null;
}

async function handleEditDriver(e) {
    e.preventDefault();

    const driverId = parseInt(document.getElementById('editDriverId').value);
    const updateData = {
        name: document.getElementById('editName').value,
        team: document.getElementById('editTeam').value,
        points: parseInt(document.getElementById('editPoints').value),
        championships: parseInt(document.getElementById('editChampionships').value)
    };

    try {
        const response = await fetch(`${API_BASE}/drivers/${driverId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (result.success) {
            showToast(`✅ ${result.data.name} atualizado com sucesso!`, 'success');
            closeEditModal();
            loadDashboard();
            loadDrivers();
        } else {
            showToast(`❌ ${result.error}`, 'error');
        }
    } catch (error) {
        console.error('Erro ao atualizar piloto:', error);
        showToast('Erro ao atualizar piloto', 'error');
    }
}

// ========================================
// Delete Driver
// ========================================

function openDeleteModal(driverId) {
    deletingDriverId = driverId;
    const driver = allDrivers.find(d => d.id === driverId);
    
    if (driver) {
        document.getElementById('deleteMessage').textContent = 
            `Tem certeza que deseja remover ${driver.name} (${driver.team})?`;
    }

    document.getElementById('deleteModal').classList.add('open');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('open');
    deletingDriverId = null;
}

async function confirmDelete() {
    if (!deletingDriverId) return;

    try {
        const response = await fetch(`${API_BASE}/drivers/${deletingDriverId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showToast(`✅ ${result.data.name} removido com sucesso!`, 'success');
            closeDeleteModal();
            loadDashboard();
            loadDrivers();
        } else {
            showToast(`❌ ${result.error}`, 'error');
        }
    } catch (error) {
        console.error('Erro ao remover piloto:', error);
        showToast('Erro ao remover piloto', 'error');
    }
}

// ========================================
// Ranking
// ========================================

async function loadRanking() {
    try {
        const response = await fetch(`${API_BASE}/drivers/ranking/points`);
        const result = await response.json();

        if (result.success) {
            displayRanking(result.data);
        }
    } catch (error) {
        console.error('Erro ao carregar ranking:', error);
        showToast('Erro ao carregar ranking', 'error');
    }
}

function displayRanking(drivers) {
    const container = document.getElementById('rankingList');

    container.innerHTML = drivers.map((driver, index) => {
        let positionClass = '';
        let medal = '';

        if (index === 0) {
            positionClass = 'gold';
            medal = '🥇';
        } else if (index === 1) {
            positionClass = 'silver';
            medal = '🥈';
        } else if (index === 2) {
            positionClass = 'bronze';
            medal = '🥉';
        }

        return `
            <div class="ranking-item">
                <div class="ranking-position ${positionClass}">
                    ${medal} #${driver.position}
                </div>
                <div class="ranking-info">
                    <div>
                        <div class="ranking-name">${driver.name}</div>
                        <div class="ranking-team">${driver.team}</div>
                    </div>
                    <div>
                        <div class="ranking-points">${driver.points} pts</div>
                        <div class="ranking-championships">
                            🏆 ${driver.championships} ${driver.championships === 1 ? 'campeão' : 'campeões'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ========================================
// Teams
// ========================================

async function loadTeams() {
    try {
        const response = await fetch(`${API_BASE}/drivers/teams`);
        const result = await response.json();

        if (result.success) {
            const select = document.getElementById('filterTeam');
            result.data.forEach(team => {
                const option = document.createElement('option');
                option.value = team;
                option.textContent = team;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar times:', error);
    }
}

// ========================================
// Utilities
// ========================================

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function reloadData() {
    loadDashboard();
    showToast('✅ Dados recarregados!', 'success');
}

// ========================================
// API Health Check
// ========================================

async function checkApiHealth() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        const result = await response.json();
        return result.status === 'ok';
    } catch (error) {
        console.error('API não está acessível:', error);
        return false;
    }
}

// Verificar saúde da API ao carregar
window.addEventListener('load', async () => {
    const isHealthy = await checkApiHealth();
    if (!isHealthy) {
        showToast('⚠️ API não está respondendo', 'warning');
    }
});

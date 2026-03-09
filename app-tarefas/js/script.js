// ==========================================
// 1. DATA E HORA EM TEMPO REAL
// ==========================================
function updateTime() {
    const now = new Date();
    
    // Formatar hora
    document.getElementById('time-display').textContent = now.toLocaleTimeString('pt-PT', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Formatar data
    document.getElementById('date-display').textContent = now.toLocaleDateString('pt-PT', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
    });
}
setInterval(updateTime, 1000);
updateTime(); // Chama logo ao carregar o ecrã

// ==========================================
// 2. LÓGICA DA APLICAÇÃO DE TAREFAS
// ==========================================
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let searchTerm = '';

const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');

// Guarda no navegador
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Renderiza as tarefas no ecrã com base nos filtros e pesquisa
function renderTasks() {
    taskList.innerHTML = ''; // Limpa a lista atual
    
    // Aplica a pesquisa e o filtro
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = 
            currentFilter === 'all' ? true :
            currentFilter === 'pending' ? !task.completed :
            currentFilter === 'completed' ? task.completed : true;
        
        return matchesSearch && matchesFilter;
    });

    // Cria o HTML para cada tarefa filtrada
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');
        
        const span = document.createElement('span');
        span.textContent = task.text;
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';
        
        const checkBtn = document.createElement('button');
        checkBtn.innerHTML = '✓';
        checkBtn.className = 'btn-action btn-check';
        checkBtn.title = 'Concluir';
        checkBtn.onclick = () => toggleTask(task.id);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '✕';
        deleteBtn.className = 'btn-action btn-delete';
        deleteBtn.title = 'Eliminar';
        deleteBtn.onclick = () => deleteTask(task.id);
        
        actionsDiv.append(checkBtn, deleteBtn);
        li.append(span, actionsDiv);
        taskList.appendChild(li);
    });
}

// Adiciona uma nova tarefa
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    
    tasks.push({ id: Date.now(), text, completed: false });
    taskInput.value = '';
    
    saveTasks();
    renderTasks();
}

// Alterna o estado da tarefa (Concluída/Pendente)
function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks();
    renderTasks();
}

// Apaga a tarefa
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// ==========================================
// 3. EVENT LISTENERS (Cliques e Teclado)
// ==========================================
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') addTask();
});

// Atualiza a pesquisa em tempo real enquanto escreve
searchInput.addEventListener('input', e => {
    searchTerm = e.target.value;
    renderTasks();
});

// Lógica dos botões de filtro
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove a classe 'active' de todos
        filterBtns.forEach(b => b.classList.remove('active'));
        // Adiciona ao botão clicado
        btn.classList.add('active');
        
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Renderiza as tarefas pela primeira vez ao abrir a página
renderTasks();
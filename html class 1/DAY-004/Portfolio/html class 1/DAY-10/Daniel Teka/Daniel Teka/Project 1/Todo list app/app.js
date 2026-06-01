// DOM Element Selectors
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const currentDateEl = document.getElementById('current-date');
const historyList = document.getElementById('history-list');

// Persistent Application State
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let historyItems = JSON.parse(localStorage.getItem('todo_history')) || [];

// Set Live Heading Date
function setLiveDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    currentDateEl.textContent = new Date().toLocaleDateString('en-US', options);
}

// Sync values to localStorage
function syncData() {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('todo_history', JSON.stringify(historyItems));
}

// Render dynamic elements
function renderApp() {
    renderActiveTodos();
    renderHistory();
}

// Render the active items panel
function renderActiveTodos() {
    todoList.innerHTML = '';

    if (todos.length === 0) {
        todoList.innerHTML = `<li class="empty-state">No pending tasks! ✨</li>`;
        updateCounter();
        return;
    }

    todos.forEach((todo) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        li.innerHTML = `
            <div class="todo-item-left">
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
            </div>
            <button class="delete-btn" aria-label="Delete">🗑️</button>
        `;
        todoList.appendChild(li);
    });
    updateCounter();
}

// Render History panel — sorted with newest items at the top
function renderHistory() {
    historyList.innerHTML = '';

    if (historyItems.length === 0) {
        historyList.innerHTML = `<div class="empty-state">No cleared history yet.</div>`;
        return;
    }

    // Sort historyItems array matching newest completion timestamps first
    const sortedHistory = [...historyItems].sort((a, b) => b.timestamp - a.timestamp);

    sortedHistory.forEach(item => {
        const box = document.createElement('div');
        box.className = 'history-box';

        box.innerHTML = `
            <span class="history-text">${item.text}</span>
            <span class="history-time">${item.formattedTime}</span>
        `;
        historyList.appendChild(box);
    });
}

function updateCounter() {
    const activeTasks = todos.filter(todo => !todo.completed).length;
    taskCount.textContent = `${activeTasks} task${activeTasks === 1 ? '' : 's'} left`;
}

// Event Handlers
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();
    if (!taskText) return;

    todos.push({
        id: Date.now().toString(),
        text: taskText,
        completed: false
    });

    syncData();
    renderActiveTodos();
    todoInput.value = '';
});

todoList.addEventListener('click', (e) => {
    const item = e.target.closest('.todo-item');
    if (!item) return;
    const itemId = item.dataset.id;

    if (e.target.type === 'checkbox') {
        todos = todos.map(t => t.id === itemId ? { ...t, completed: e.target.checked } : t);
        item.classList.toggle('completed', e.target.checked);
        syncData();
        updateCounter();
    }

    if (e.target.classList.contains('delete-btn')) {
        todos = todos.filter(t => t.id !== itemId);
        syncData();
        renderActiveTodos();
    }
});

// Clear lists action — Converts completed elements to History Boxes
clearCompletedBtn.addEventListener('click', () => {
    const completedTasks = todos.filter(t => t.completed);
    if (completedTasks.length === 0) return;

    const timeNow = new Date();
    // Format timestamp string safely to HH:MM AM/PM
    const formattedTime = timeNow.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    // Move properties to history items structure
    completedTasks.forEach(task => {
        historyItems.push({
            id: task.id,
            text: task.text,
            timestamp: timeNow.getTime(), // Numeric reference for sorting calculations
            formattedTime: formattedTime
        });
    });

    // Strip completed out from active checklist array
    todos = todos.filter(t => !t.completed);

    syncData();
    renderApp();
});

// Run Initial setup
setLiveDate();
renderApp();

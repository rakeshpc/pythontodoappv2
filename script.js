// API base URL
const API_BASE = '';

// State management
let todos = [];
let currentFilter = 'all';
let editingTodoId = null;

// DOM Elements
const todoForm = document.getElementById('todoForm');
const todoTitleInput = document.getElementById('todoTitle');
const todoDescriptionInput = document.getElementById('todoDescription');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const filterButtons = document.querySelectorAll('.filter-btn');
const totalTodosSpan = document.getElementById('totalTodos');
const activeTodosSpan = document.getElementById('activeTodos');
const completedTodosSpan = document.getElementById('completedTodos');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Form submission
    todoForm.addEventListener('submit', handleFormSubmit);
    
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTodos();
        });
    });
}

// Load todos from API
async function loadTodos() {
    try {
        const response = await fetch(`${API_BASE}/todos`);
        const data = await response.json();
        todos = data.todos || [];
        updateStats();
        renderTodos();
    } catch (error) {
        console.error('Error loading todos:', error);
        showNotification('Error loading todos', 'error');
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const title = todoTitleInput.value.trim();
    const description = todoDescriptionInput.value.trim();
    
    if (!title) {
        showNotification('Please enter a task title', 'error');
        return;
    }
    
    if (editingTodoId) {
        await updateTodo(editingTodoId, title, description);
    } else {
        await createTodo(title, description);
    }
    
    // Reset form
    todoForm.reset();
    editingTodoId = null;
    todoForm.querySelector('.btn-primary').innerHTML = '<span class="btn-icon">+</span> Add Task';
}

// Create new todo
async function createTodo(title, description) {
    try {
        const response = await fetch(`${API_BASE}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        });
        
        if (response.ok) {
            const newTodo = await response.json();
            todos.push(newTodo);
            updateStats();
            renderTodos();
            showNotification('Task added successfully!', 'success');
        } else {
            throw new Error('Failed to create todo');
        }
    } catch (error) {
        console.error('Error creating todo:', error);
        showNotification('Error adding task', 'error');
    }
}

// Update todo
async function updateTodo(id, title, description) {
    try {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        
        const response = await fetch(`${API_BASE}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, completed: todo.completed })
        });
        
        if (response.ok) {
            const updatedTodo = await response.json();
            const index = todos.findIndex(t => t.id === id);
            todos[index] = updatedTodo;
            updateStats();
            renderTodos();
            showNotification('Task updated successfully!', 'success');
        } else {
            throw new Error('Failed to update todo');
        }
    } catch (error) {
        console.error('Error updating todo:', error);
        showNotification('Error updating task', 'error');
    }
}

// Toggle todo completion
async function toggleTodo(id) {
    try {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        
        const response = await fetch(`${API_BASE}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                title: todo.title,
                description: todo.description,
                completed: !todo.completed 
            })
        });
        
        if (response.ok) {
            const updatedTodo = await response.json();
            const index = todos.findIndex(t => t.id === id);
            todos[index] = updatedTodo;
            updateStats();
            renderTodos();
        } else {
            throw new Error('Failed to toggle todo');
        }
    } catch (error) {
        console.error('Error toggling todo:', error);
        showNotification('Error updating task', 'error');
    }
}

// Delete todo
async function deleteTodo(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/todos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            todos = todos.filter(t => t.id !== id);
            updateStats();
            renderTodos();
            showNotification('Task deleted successfully!', 'success');
        } else {
            throw new Error('Failed to delete todo');
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
        showNotification('Error deleting task', 'error');
    }
}

// Edit todo
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    todoTitleInput.value = todo.title;
    todoDescriptionInput.value = todo.description || '';
    editingTodoId = id;
    
    const submitBtn = todoForm.querySelector('.btn-primary');
    submitBtn.innerHTML = '<span class="btn-icon">✓</span> Update Task';
    
    todoTitleInput.focus();
    todoTitleInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Render todos based on current filter
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        emptyState.classList.remove('hidden');
        todoList.innerHTML = '';
        todoList.appendChild(emptyState);
        return;
    }
    
    emptyState.classList.add('hidden');
    
    todoList.innerHTML = filteredTodos.map(todo => createTodoElement(todo)).join('');
    
    // Add event listeners to newly created elements
    filteredTodos.forEach(todo => {
        const checkbox = document.getElementById(`checkbox-${todo.id}`);
        const editBtn = document.getElementById(`edit-${todo.id}`);
        const deleteBtn = document.getElementById(`delete-${todo.id}`);
        
        if (checkbox) {
            checkbox.addEventListener('change', () => toggleTodo(todo.id));
        }
        if (editBtn) {
            editBtn.addEventListener('click', () => editTodo(todo.id));
        }
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
        }
    });
}

// Get filtered todos
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
}

// Create todo element HTML
function createTodoElement(todo) {
    const createdDate = todo.created_at ? new Date(todo.created_at).toLocaleDateString() : '';
    
    return `
        <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <div class="todo-header">
                <input 
                    type="checkbox" 
                    id="checkbox-${todo.id}" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                >
                <div class="todo-content">
                    <div class="todo-title">${escapeHtml(todo.title)}</div>
                    ${todo.description ? `<div class="todo-description">${escapeHtml(todo.description)}</div>` : ''}
                    ${createdDate ? `<div class="todo-meta">Created: ${createdDate}</div>` : ''}
                </div>
            </div>
            <div class="todo-actions">
                <button class="btn-small btn-edit" id="edit-${todo.id}">
                    Edit
                </button>
                <button class="btn-small btn-delete" id="delete-${todo.id}">
                    Delete
                </button>
            </div>
        </div>
    `;
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;
    
    totalTodosSpan.textContent = total;
    activeTodosSpan.textContent = active;
    completedTodosSpan.textContent = completed;
    
    // Animate number changes
    animateNumber(totalTodosSpan, total);
    animateNumber(activeTodosSpan, active);
    animateNumber(completedTodosSpan, completed);
}

// Animate number changes
function animateNumber(element, newValue) {
    element.style.transform = 'scale(1.2)';
    setTimeout(() => {
        element.textContent = newValue;
        element.style.transform = 'scale(1)';
    }, 150);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

class TodoApp {
    constructor() {
        // DOM elements
        this.form = document.getElementById('taskForm');
        this.notification = document.getElementById('notification');
        this.errorMessage = document.getElementById('errorMessage');
        this.popup = document.getElementById('taskTablePopup');
        this.popupCloseBtn = document.querySelector('.close-popup');
        this.taskTableBody = document.getElementById('taskTableBody');
        this.openPopupBtn = document.getElementById('openTaskTableBtn');
        this.deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
        this.selectAllBtn = document.getElementById('selectAllBtn');
        this.selectAllCheckbox = document.getElementById('selectAllCheckbox');
        this.alarmAudio = document.getElementById('alarmAudio');
        this.backgroundContent = document.getElementById('background-content');

        // State
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.editTaskId = null;
        this.selectedTasks = new Set();
        this.timers = new Map();

        // Bind methods
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.toggleTaskSelection = this.toggleTaskSelection.bind(this);
        this.deleteSelectedTasks = this.deleteSelectedTasks.bind(this);
        this.toggleSelectAll = this.toggleSelectAll.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        // Initialize
        this.initEventListeners();
        this.restoreTimers();
        this.renderTaskTable();
    }

    initEventListeners() {
        this.form.addEventListener('submit', this.handleFormSubmit);
        this.popupCloseBtn.addEventListener('click', () => this.closePopup());
        this.openPopupBtn.addEventListener('click', () => this.openPopup());
        this.deleteSelectedBtn.addEventListener('click', this.deleteSelectedTasks);
        this.selectAllBtn.addEventListener('click', this.toggleSelectAll);
        this.selectAllCheckbox.addEventListener('change', this.toggleSelectAll);
        window.addEventListener('click', e => {
            if (e.target === this.popup) this.closePopup();
        });
        document.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(e) {
        // Close popup with Escape key
        if (e.key === 'Escape' && this.popup.style.display === 'flex') {
            this.closePopup();
        }

        // Submit form with Enter key when focused on an input
        if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
            e.preventDefault();
            this.form.dispatchEvent(new Event('submit'));
        }

        // Open popup with Ctrl + T
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            this.openPopup();
        }
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    showNotification(message, duration = 3000) {
        this.notification.textContent = message;
        this.notification.style.display = 'block';
        setTimeout(() => {
            this.notification.style.display = 'none';
        }, duration);
    }

    startTimer(taskId, minutes) {
        const endTime = Date.now() + minutes * 60 * 1000;
        this.timers.set(taskId, endTime);

        const updateTimer = () => {
            const now = Date.now();
            const timeLeft = endTime - now;
            if (timeLeft <= 0) {
                this.timers.delete(taskId);
                this.alarmAudio.play().catch(err => console.error('Audio playback failed:', err));
                this.showNotification(`Timer for task ${taskId} has ended!`);
                this.renderTaskTable();
                return;
            }
            this.renderTaskTable();
            requestAnimationFrame(updateTimer);
        };
        requestAnimationFrame(updateTimer);
    }

    restoreTimers() {
        this.tasks.forEach(task => {
            if (task.timerEnd && task.timerEnd > Date.now()) {
                this.startTimer(task.id, (task.timerEnd - Date.now()) / 1000 / 60);
            }
        });
    }

    formatTimeLeft(endTime) {
        if (!endTime || endTime <= Date.now()) return 'Expired';
        const seconds = Math.floor((endTime - Date.now()) / 1000);
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    }

    renderTaskTable() {
        this.taskTableBody.innerHTML = '';

        if (this.tasks.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 8;
            td.style.textAlign = 'center';
            td.textContent = 'No tasks available.';
            tr.appendChild(td);
            this.taskTableBody.appendChild(tr);
            return;
        }

        this.tasks.forEach(task => {
            const tr = document.createElement('tr');
            if (task.completed) tr.classList.add('completed');

            // Selection checkbox
            const tdSelect = document.createElement('td');
            const selectCheckbox = document.createElement('input');
            selectCheckbox.type = 'checkbox';
            selectCheckbox.checked = this.selectedTasks.has(task.id);
            selectCheckbox.addEventListener('change', () => this.toggleTaskSelection(task.id));
            tdSelect.appendChild(selectCheckbox);

            const tdId = document.createElement('td');
            tdId.textContent = task.id;

            const tdText = document.createElement('td');
            tdText.textContent = task.text;

            const tdCategory = document.createElement('td');
            tdCategory.textContent = task.category;

            const tdPriority = document.createElement('td');
            tdPriority.className = `priority-${task.priority.toLowerCase()}`;
            tdPriority.textContent = task.priority;

            const tdTimer = document.createElement('td');
            tdTimer.textContent = task.timerEnd ? this.formatTimeLeft(task.timerEnd) : '-';

            const tdStatus = document.createElement('td');
            tdStatus.textContent = task.completed ? 'Completed' : 'Pending';

            const tdActions = document.createElement('td');
            tdActions.className = 'table-actions';

            const toggleBtn = document.createElement('button');
            toggleBtn.title = 'Toggle Complete';
            toggleBtn.textContent = task.completed ? 'Undo' : 'Done';
            toggleBtn.addEventListener('click', () => {
                task.completed = !task.completed;
                if (task.completed && this.timers.has(task.id)) {
                    this.timers.delete(task.id);
                }
                this.saveTasks();
                this.renderTaskTable();
            });

            const editBtn = document.createElement('button');
            editBtn.title = 'Edit Task';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => {
                this.closePopup();
                this.editTask(task.id);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.title = 'Delete Task';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                this.deleteTask(task.id);
            });

            tdActions.appendChild(toggleBtn);
            tdActions.appendChild(editBtn);
            tdActions.appendChild(deleteBtn);

            tr.appendChild(tdSelect);
            tr.appendChild(tdId);
            tr.appendChild(tdText);
            tr.appendChild(tdCategory);
            tr.appendChild(tdPriority);
            tr.appendChild(tdTimer);
            tr.appendChild(tdStatus);
            tr.appendChild(tdActions);

            this.taskTableBody.appendChild(tr);
        });

        this.updateDeleteButtonState();
        this.updateSelectAllCheckbox();
    }

    toggleTaskSelection(taskId) {
        if (this.selectedTasks.has(taskId)) {
            this.selectedTasks.delete(taskId);
        } else {
            this.selectedTasks.add(taskId);
        }
        this.updateDeleteButtonState();
        this.updateSelectAllCheckbox();
    }

    deleteSelectedTasks() {
        if (this.selectedTasks.size === 0) return;
        if (!confirm(`Are you sure you want to delete ${this.selectedTasks.size} task(s)?`)) return;

        this.tasks = this.tasks.filter(task => !this.selectedTasks.has(task.id));
        this.selectedTasks.forEach(id => this.timers.delete(id));
        this.selectedTasks.clear();
        this.saveTasks();
        this.renderTaskTable();
        this.showNotification('Selected tasks deleted.');
    }

    toggleSelectAll() {
        if (this.selectedTasks.size === this.tasks.length) {
            this.selectedTasks.clear();
        } else {
            this.tasks.forEach(task => this.selectedTasks.add(task.id));
        }
        this.renderTaskTable();
    }

    updateDeleteButtonState() {
        this.deleteSelectedBtn.disabled = this.selectedTasks.size === 0;
    }

    updateSelectAllCheckbox() {
        this.selectAllCheckbox.checked = this.selectedTasks.size === this.tasks.length && this.tasks.length > 0;
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.errorMessage.textContent = '';

        const text = this.form.taskText.value.trim();
        const category = this.form.taskCategory.value;
        const priority = this.form.taskPriority.value;
        const timer = this.form.taskTimer.value.trim();

        // Validation
        if (!text) {
            this.errorMessage.textContent = 'Task description cannot be empty.';
            return;
        }

        if (!category) {
            this.errorMessage.textContent = 'Please select a category.';
            return;
        }

        if (timer && (isNaN(timer) || Number(timer) <= 0)) {
            this.errorMessage.textContent = 'Timer must be a positive number or left blank.';
            return;
        }

        if (this.editTaskId !== null) {
            const index = this.tasks.findIndex(t => t.id === this.editTaskId);
            if (index !== -1) {
                this.timers.delete(this.tasks[index].id);
                this.tasks[index].text = text;
                this.tasks[index].category = category;
                this.tasks[index].priority = priority;
                this.tasks[index].timerEnd = timer ? Date.now() + Number(timer) * 60 * 1000 : null;
                if (timer) {
                    this.startTimer(this.tasks[index].id, Number(timer));
                }
                this.showNotification('Task updated successfully.');
            }
            this.editTaskId = null;
        } else {
            const newTask = {
                id: Date.now(),
                text,
                category,
                priority,
                timerEnd: timer ? Date.now() + Number(timer) * 60 * 1000 : null,
                completed: false,
            };
            this.tasks.push(newTask);
            if (timer) {
                this.startTimer(newTask.id, Number(timer));
            }
            this.showNotification('Task added successfully.');
        }

        this.form.reset();
        this.form.taskCategory.value = '';
        this.saveTasks();
        this.renderTaskTable();
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        this.form.taskText.value = task.text;
        this.form.taskCategory.value = task.category;
        this.form.taskPriority.value = task.priority;
        this.form.taskTimer.value = task.timerEnd ? Math.ceil((task.timerEnd - Date.now()) / 1000 / 60) : '';

        this.editTaskId = id;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    deleteTask(id) {
        if (!confirm('Are you sure you want to delete this task?')) return;
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.timers.delete(id);
        this.saveTasks();
        this.renderTaskTable();
        this.showNotification('Task deleted.');
    }

    openPopup() {
        this.popup.style.display = 'flex';
        this.backgroundContent.classList.add('popup-open');
        this.renderTaskTable();
    }

    closePopup() {
        this.popup.style.display = 'none';
        this.backgroundContent.classList.remove('popup-open');
        this.selectedTasks.clear();
        this.renderTaskTable();
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => new TodoApp());
const savedTasks = JSON.parse(localStorage.getItem("tasks"));

let taskState = {
    selectedTasks: savedTasks || []
} || [];

let toastTimer;

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');

    // Clear any existing timer to prevent premature hiding
    clearTimeout(toastTimer);

    toast.textContent = message;
    toast.classList.add('show');

    // Apply styles
    toast.style.color = isError ? "red" : "";
    toast.style.backgroundColor = isError ? "#ff949452" : "";

    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
        // Reset styles after hiding
        setTimeout(() => {
            toast.style.color = "";
            toast.style.backgroundColor = "";
        }, 300);
    }, 3000);
}

function savedTasksToStorage() {
    localStorage.setItem("tasks", JSON.stringify(taskState.selectedTasks));
}

function renderTasks() {
    const taskContainer = document.getElementById('task-list');
    const doneTaskContainer = document.getElementById('done-tasks');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const taskCount = document.getElementById('task-count');
    const quickActionsContainer = document.querySelector('.quick-actions');
    if (!taskContainer || !doneTaskContainer) return;

    // Clear current task list
    taskContainer.innerHTML = '';
    doneTaskContainer.innerHTML = '';


    // Looping through each task individually to keep them separate
    taskState.selectedTasks.forEach(task => {
        let taskSectionHeader = `
        <li style="list-style: none; margin-top: 18px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: start; gap: 16px; border-left: 4px solid ${task.completed ? 'green' : 'var(--primary-color)'};">
             <label class="custom-checkbox" style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" onchange="toggleTask(${task.id})" ${task.completed ? 'checked' : ''}>
                    <span class="checkmark"></span>
                    <span style="text-decoration: ${task.completed ? 'line-through' : 'none'}; text-decoration-color: green; text-decoration-thickness: 2px; font-weight: ${task.completed ? '700' : 'normal'}; color: ${task.completed ? 'green' : 'black'}; font-size: ${task.completed ? '12px' : '14px'}">${task.title}</span>
            </label>

            <button id="edit-btn" onclick="editTask(${task.id})"><i class="ri-edit-fill"></i> <br> <sub>Edit</sub></button>
            <button class="delete-task-btn" onclick="removeTask(${task.id})"><i class="ri-delete-bin-fill"></i> <br> <sub>Delete</sub></button>
        </li>`;

        if (task.completed) {
            doneTaskContainer.insertAdjacentHTML('beforeend', taskSectionHeader);

        }
        else {
            taskContainer.insertAdjacentHTML('beforeend', taskSectionHeader);
        }
    });

    if (taskContainer.innerHTML === '') {
        taskContainer.innerHTML = '<p class="text-muted" style="text-align: center; margin-top: 10px; color: var(--primary-color); font-size: 14px;">No tasks yet! Click add to add new tasks.';
    }
    if (doneTaskContainer.innerHTML === '') {
        doneTaskContainer.innerHTML = '<p class="text-muted" style="text-align: center; margin-top: 10px; color: green; font-size: 14px;">No tasks yet! Click add to add new tasks';
    }

    if (clearAllBtn) {
        clearAllBtn.style.display = taskState.selectedTasks.length > 0 ? 'block' : 'none';
    }
    if (taskCount) {
        const remainingTasks = taskState.selectedTasks.filter(t => !t.completed).length;
        taskCount.style.display = taskState.selectedTasks.length > 0 ? 'block' : 'none';
        taskCount.textContent = `${remainingTasks} tasks left`;
    }
    if (quickActionsContainer) {
        quickActionsContainer.style.display = taskState.selectedTasks.length > 0 ? 'flex' : 'none'
    }
}

window.removeTask = function (taskId) {
    taskState.selectedTasks = taskState.selectedTasks.filter(task => task.id !== taskId);
    savedTasksToStorage();
    renderTasks();
};

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-add-form');
    const taskInput = document.getElementById('task-input');

    if (taskForm && taskInput) {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const taskText = taskInput.value.trim();

            if (taskInput.value === '') {
                alert("Please add a task!");
                return;
            }
            else {
                const newTask = {
                    id: Date.now(),
                    title: taskText,
                    items: [],
                    completed: false,
                    edit: false,
                };

                taskState.selectedTasks.push(newTask);
                taskInput.value = '';

                const toast = document.getElementById('toast');
                toast.classList.add('show');
                toast.textContent = "Task added successfully!";

                setTimeout(() => {
                    toast.classList.remove('show');
                }, 2000);

                savedTasksToStorage();
                renderTasks();
            }
        });
    }
    renderTasks();
});

window.toggleTask = function (taskId) {
    const task = taskState.selectedTasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed; //Users can uncheck and return the task to task container

        if (task.completed) {
            showToast("Task done successfully!");
        }
        else {
            showToast("Task undone successfully!", true);
        }

        savedTasksToStorage();
        renderTasks();
    }
};

window.editTask = function (taskId) {
    const editBtn = document.getElementById('edit-btn');
    const task = taskState.selectedTasks.find(t => t.id === taskId);
    if (task) {
        task.edit = !task.edit;

        if (task.edit) {
            const taskInput = document.getElementById('task-input');
            const toast = document.getElementById('toast');

            taskInput.focus();
            taskInput.value = task.title;

            const addBtn = document.getElementById('add-btn');
            addBtn.style.display = 'none';

            const saveBtn = document.getElementById('save-btn');
            saveBtn.style.display = 'block';

            saveBtn.onclick = () => {
                task.title = taskInput.value;
                task.edit = false;

                addBtn.style.display = 'block';
                saveBtn.style.display = 'none';
                taskInput.value = '';
                toast.classList.add('show');
                toast.textContent = "Task edited successfully!";

                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);

                savedTasksToStorage();
                renderTasks();
            }
            editBtn.textContent = 'Save';
        }
        else {
            editBtn.textContent = 'Edit';
        }
        savedTasksToStorage();
        renderTasks();
    }
}

window.saveTask = function (taskId) {
    const task = taskState.selectedTasks.find(t => t.id === taskId);
    if (task) {
        task.edit = !task.edit;

        if (task.edit) {
            editBtn.textContent = 'Save';
            console.log('edited');

        }
        else {
            editBtn.textContent = 'Edit';
        }
        savedTasksToStorage();
        renderTasks();
    }
}

window.clearAllTasks = function () {
    taskState.selectedTasks = [];

    const toast = document.getElementById('toast');
    toast.classList.add('show');
    toast.textContent = "All tasks cleared successfully!";

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);

    savedTasksToStorage();
    renderTasks();
}

window.clearDoneTasks = function () {
    taskState.selectedTasks = taskState.selectedTasks.filter(task => !task.completed);

    const toast = document.getElementById('toast');
    toast.classList.add('show');
    toast.textContent = "All done tasks cleared successfully!";

    setTimeout(() => {
        toast.classList.remove('show');
        return;
    }, 3000);

    savedTasksToStorage();
    renderTasks();
}
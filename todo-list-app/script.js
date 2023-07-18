const addButton = document.getElementById('addButton');
const clearCompletedButton = document.getElementById('clearCompletedTasksButton');
const clearAllButton = document.getElementById('clearAllButton');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const completedList = document.getElementById('completedList');
const remainingCount = document.getElementById('remainingCount');

function updateRemainingCount() {
    const tasksRemaining = taskList.getElementsByTagName('li').length;
    remainingCount.innerText = `${tasksRemaining} ${tasksRemaining === 1 ? 'task' : 'tasks'} remaining`;
}

function saveTasksToLocalStorage() {
    const tasks = [];
    const taskItems = taskList.getElementsByTagName('li');
    for (let i = 0; i < taskItems.length; i++) {
        const taskText = taskItems[i].querySelector('.task-text').innerText;
        const isCompleted = taskItems[i].querySelector('.task-checkbox').checked;
        tasks.push({ text: taskText, completed: isCompleted });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveCompletedTasksToLocalStorage() {
    const completedTasks = [];
    const completedTaskItems = completedList.getElementsByTagName('li');
    for (let i = 0; i < completedTaskItems.length; i++) {
        const taskText = completedTaskItems[i].querySelector('.task-text').innerText;
        const isCompleted = completedTaskItems[i].querySelector('.task-checkbox').checked;
        completedTasks.push({ text: taskText, completed: isCompleted });
    }
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

function loadTasksFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
        savedTasks.forEach((task) => {
            const taskItem = createTaskElement(task.text, task.completed);
            taskList.appendChild(taskItem);
        });
    }
}

function loadCompletedTasksFromLocalStorage() {
    const savedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks'));
    if (savedCompletedTasks) {
        savedCompletedTasks.forEach((task) => {
            const taskItem = createTaskElement(task.text, task.completed);
            taskItem.addEventListener('click', () => {
                taskItem.querySelector('.task-checkbox').checked = !taskItem.querySelector('.task-checkbox').checked;
                taskItem.classList.toggle('completed');
                saveTasksToLocalStorage();
                saveCompletedTasksToLocalStorage();
                updateRemainingCount();
            });
            completedList.appendChild(taskItem);
        });
    }
}

function createTaskElement(text, isCompleted = false) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');

    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.classList.add('task-checkbox');
    taskCheckbox.checked = isCompleted;
    taskCheckbox.addEventListener('click', () => {
        taskItem.classList.toggle('completed');
        saveTasksToLocalStorage();
        saveCompletedTasksToLocalStorage();
        updateRemainingCount();
    });
    taskItem.appendChild(taskCheckbox);

    const taskTextElement = document.createElement('span');
    taskTextElement.classList.add('task-text');
    taskTextElement.innerText = text;
    taskItem.appendChild(taskTextElement);

    const editButton = document.createElement('button');
    editButton.classList.add('edit-button');
    editButton.innerHTML = '<i class="fas fa-pen"></i>';
    editButton.addEventListener('click', () => {
        const newText = prompt('Edit the task:', text);
        if (newText !== null && newText.trim() !== '') {
            taskTextElement.innerText = newText.trim();
            saveTasksToLocalStorage();
            saveCompletedTasksToLocalStorage();
        }
    });
    taskItem.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.addEventListener('click', () => {
        taskItem.remove();
        saveTasksToLocalStorage();
        saveCompletedTasksToLocalStorage();
        updateRemainingCount();
    });
    taskItem.appendChild(deleteButton);

    if (isCompleted) {
        taskItem.classList.add('completed');
    }

    return taskItem;
}

addButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const taskItem = createTaskElement(taskText);
        taskList.appendChild(taskItem);
        taskInput.value = '';
        saveTasksToLocalStorage();
        updateRemainingCount();
    }
});

clearCompletedButton.addEventListener('click', () => {
    const completedTasks = completedList.getElementsByClassName('completed');
    while (completedTasks.length > 0) {
        completedTasks[0].remove();
    }
    saveCompletedTasksToLocalStorage();
    updateRemainingCount();
});

clearAllButton.addEventListener('click', () => {
    while (taskList.firstChild) {
        taskList.firstChild.remove();
    }
    while (completedList.firstChild) {
        completedList.firstChild.remove();
    }
    saveTasksToLocalStorage();
    saveCompletedTasksToLocalStorage();
    updateRemainingCount();
});

completedList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button')) {
        const taskItem = event.target.parentElement;
        taskItem.remove();
        saveCompletedTasksToLocalStorage();
        updateRemainingCount();
    }
});

loadTasksFromLocalStorage();
loadCompletedTasksFromLocalStorage();
updateRemainingCount();

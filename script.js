document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const sortSelect = document.getElementById('sort');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');

    // Initialize tasks from localStorage or set to an empty array
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Function to save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to add a task
    function addTask(title, description, dueDate) {
        const task = {
            id: Date.now(),
            title,
            description,
            dueDate,
            completed: false
        };
        tasks.push(task);
        saveTasks(); // Save the updated tasks
        displayTasks();
        taskForm.reset();
    }
// ...

// Event listener for searching/filtering tasks when the button is clicked
searchButton.addEventListener('click', function() {
    displayTasks();
});

// ...

// Function to display tasks
function displayTasks() {
    const searchText = searchInput.value.trim().toLowerCase();
    taskList.innerHTML = '';

    const filteredTasks = filterTasks(tasks, searchText);
    if (filteredTasks.length === 0) {
        const noTaskMessage = document.createElement('li');
        noTaskMessage.innerText = 'No tasks found with that name.';
        taskList.appendChild(noTaskMessage);
    } else {
        const sortedTasks = sortTasks(filteredTasks, sortSelect.value);
        sortedTasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="task-title" data-task-id="${task.id}">${task.title}</span>
                <span>${task.description}</span>
                <span>${task.dueDate}</span>
                ${task.completed ? '<span>Completed</span>' : ''}
                <input type="checkbox" data-task-id="${task.id}" ${task.completed ? 'checked' : ''}>
                <button class="edit-btn" data-task-id="${task.id}">Edit</button>
                <button class="delete-btn" data-task-id="${task.id}">Delete</button>
            `;

            taskList.appendChild(li);
        });

        // Add event listener for checkbox changes
        const checkboxes = taskList.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const taskId = this.dataset.taskId;
                const task = tasks.find(task => task.id == taskId);
                task.completed = this.checked;
                saveTasks(); // Save the updated tasks
                displayTasks();
            });
        });
    }
}


    
// ...


// ...


    // Function to filter tasks
    function filterTasks(tasks, searchText) {
        searchText = searchText.toLowerCase().trim();

        if (searchText === "") {
            return tasks; // If the search text is empty, return all tasks
        }

        return tasks.filter(task => {
            const titleMatch = task.title.toLowerCase().includes(searchText);
            const descriptionMatch = task.description.toLowerCase().includes(searchText);
            return titleMatch || descriptionMatch;
        });
    }

    // Function to sort tasks
    function sortTasks(tasks, sortBy) {
        if (sortBy === 'due-date') {
            return tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        } else if (sortBy === 'status') {
            return tasks.sort((a, b) => a.completed - b.completed);
        } else {
            return tasks;
        }
    }

    // Function to edit a task
    function editTask(taskId, newTitle, newDescription) {
        const task = tasks.find(task => task.id == taskId);
        if (task) {
            task.title = newTitle;
            task.description = newDescription;
            saveTasks(); // Save the updated tasks
            displayTasks();
        }
    }

    // Event listener for form submission
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const dueDate = document.getElementById('task-due-date').value;
        addTask(title, description, dueDate);
    });

    // Event listener for task completion
    taskList.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox') {
            const taskId = e.target.parentElement.querySelector('.task-title').dataset.taskId;
            const task = tasks.find(task => task.id == taskId);
            task.completed = e.target.checked;
            saveTasks(); // Save the updated tasks
            displayTasks();
        }
    });

    // Event listener for task deletion
    taskList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const taskId = e.target.dataset.taskId;
            tasks = tasks.filter(task => task.id != taskId);
            saveTasks(); // Save the updated tasks
            displayTasks();
        }
    });

    // Event listener for task editing
    taskList.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-btn')) {
            const taskId = e.target.dataset.taskId;
            const task = tasks.find(task => task.id == taskId);
            if (task) {
                const newTitle = prompt('Edit Task Title:', task.title);
                if (newTitle !== null) {
                    const newDescription = prompt('Edit Task Description:', task.description);
                    if (newDescription !== null) {
                        editTask(taskId, newTitle, newDescription);
                    }
                }
            }
        }
    });

    // Initial display of tasks
    displayTasks();
});


let a = document.getElementById('main');
let inputData = document.getElementById('taskData');
let statusSuccess = document.getElementById('statusSuccess');  
let statusPending = document.getElementById('statusPending');  
let successTaskList = document.getElementById('sucessTask');  
let pendingTaskList = document.getElementById('PendingTask');  

let TASKS = [];

// Function to load tasks from local storage
function loadTasks() {
    const storedTasks = localStorage.getItem('TASKS');
    if (storedTasks) {
        TASKS = JSON.parse(storedTasks);
        TASKS.forEach(task => {
            addTaskToDOM(task.text, task.status);
        });
    }
}

// Function to add a task to the DOM 
function addTaskToDOM(task, status) {
    const li = document.createElement('li');
    li.textContent = task;

    if (status === 'pending') {
        pendingTaskList.append(li);
    } else if (status === 'success') {
        successTaskList.append(li);
    }
}

// Function to add a new task
function taskAdd() {
    const taskAdd = inputData.value.trim(); // Trim whitespace
    const taskStatus = statusSuccess.checked ? 'success' : 'pending'; // Determine status based on checked radio button

    if (taskAdd) {
        const data = {
            text: taskAdd,
            status: taskStatus,
            dueDate : null
        };

        TASKS.push(data);
        localStorage.setItem('TASKS', JSON.stringify(TASKS));
        addTaskToDOM(data.text, data.status);  
        renderTasks();
        inputData.value = ''; // Clear the input field
    }
}


function renderTasks() {
    successTaskList.innerHTML = '<strong>SUCCESS</strong>';
    pendingTaskList.innerHTML = '<strong>PENDING</strong>';

    TASKS.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;

        const editButton = document.createElement('button');
        editButton.style.margin = '4px 2px';
        editButton.style.padding = '15px 20px';
        editButton.textContent = 'EDIT ' + task.status;
        editButton.style.marginLeft = '20px';
        editButton.onclick = () => edit(index);

        const deleteButton = document.createElement('button');
        deleteButton.style.margin = '4px 2px';
        deleteButton.style.padding = '15px 20px';
        deleteButton.textContent = 'DELETE';
        deleteButton.onclick = () => deleteTask(index); // Call deleteTask with the index
        
        if(task.status === 'pending'){

            // Create a label for the due date
            const dueDateLabel = document.createElement('span');
            dueDateLabel.textContent = 'DUE DATE: ';
            dueDateLabel.style.marginRight = '10px'; // Add some space between the label and the input
            
            
            const dueButton = document.createElement('input');
            dueButton.type = 'date';
            dueButton.style.width = '100px';
            dueButton.style.height = '30px';
            dueButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Shadow effect
            dueButton.style.margin = '20px'; // Margin around the box
            
            dueButton.value = task.dueDate || '';
        
            dueButton.onchange = (e) => dueDate(index, e.target.value);
            
            // Set the title attribute for the due date button
            dueButton.title = 'Set Due Date'; // This will show a tooltip when hovered over
            
            // Create due date display
            const dueDateDisplay = document.createElement('span');
            dueDateDisplay.textContent = task.dueDate ? ` (Due: ${task.dueDate})` : '';
            
            dueDateLabel.style.marginLeft='20px'
            li.appendChild(dueDateLabel);
            li.appendChild(dueButton);
            li.appendChild(dueDateDisplay); // Append the due date display to the list item
        }
            editButton.style.marginRight = '20px'


        li.appendChild(editButton);
        li.appendChild(deleteButton);
        li.style.marginBottom = '20px';

        if (task.status === 'pending') {
            li.title = 'Pending';
            pendingTaskList.append(li);
        } else {
            li.title = 'Success';
            successTaskList.append(li);
        }
    });
}



function deleteTask(index) {
    TASKS.splice(index, 1); // Remove the task from the TASKS array
    localStorage.setItem('TASKS', JSON.stringify(TASKS)); // Update local storage
    renderTasks(); // Re-render the task list
}


function dueDate(index,date){
  
    TASKS[index].dueDate = date;
    localStorage.setItem('TASKS',JSON.stringify(TASKS))
    renderTasks();
}

function edit(index) {  
    const task = TASKS[index];  
    TASKS.splice(index, 1); // Remove the task from the array  
    localStorage.setItem('TASKS', JSON.stringify(TASKS)); // Update local storage  

    // Populate the input field with the task's text  
    inputData.value = task.text;  

    // Set the radio button based on the task's status  
    if (task.status === 'success') {  
        statusSuccess.checked = true;  
    } else {  
        statusPending.checked = true;  
    }  

    // Re-render the task list  
    renderTasks();  
}
/////////////
// Globals //
/////////////

// Global constants //
const NEW_TASK_PROMPT = 'Add task <name + Enter>';
const IS_DIRTY = true;
const NOT_DIRTY = false;

// Global variables
let taskList = null;

// Code called when the script loads - similar to other languages' main()
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const listId = params.id;
var loopCount = 0;

loadTaskList();
renderHTML(NOT_DIRTY);

//////////////////////////
// Function definitions //
//////////////////////////
function loadTaskList() {
  // load the task list from local storage
  taskList = JSON.parse(localStorage.getItem(listId));

  // make sure we have at least an empty task list
  //  (local storage might have never been set and might have returned 'null').
  taskList = taskList || [];
}

function clearPage() {
  document.querySelector('body').innerHTML = '';
}

function renderHTML(isDirty) {
  // clear the current HTML
  clearPage();

  // Create the 'Add Task' input element.
  var elInputAddTask = document.createElement('input');
  elInputAddTask.setAttribute('placeholder', NEW_TASK_PROMPT);

  // Add a keypress event handler to the 'Add Task' input element that
  //  will handle the 'Enter' key, creating and adding a new task.
  elInputAddTask.addEventListener('keypress', handleAddTaskKeypress);
  document.body.appendChild(elInputAddTask);
  document.body.appendChild(document.createElement('br'));
  elInputAddTask.focus();

  // Add the tasks to the task list in the DOM for display
  taskList.forEach((task, index) => {

    // create the task
    elButton = document.createElement('button');
    elButton.innerHTML = task.name;
    elButton.setAttribute('id', index);
    task.completed ? elButton.setAttribute('class', 'completed') : null;

    // add event listeners to the task for user interaction
    elButton.addEventListener('keyup', handleTaskKeypress);
    elButton.addEventListener('click', handleTaskClicked);

    // add the task to the DOM
    document.body.appendChild(elButton);
    document.body.appendChild(document.createElement('br'));
  });

  // Save the task list if we are dirty.
  isDirty ? saveTaskList() : null;
}

function saveTaskList() {
  // Save the task list so that it will come up the same if the app
  //  is shut down and re-loaded.
  if (taskList === null) {
    localStorage.removeItem(listId);
    return;
  }

  localStorage.setItem(listId, JSON.stringify(taskList));
}

function addNewTask(taskName) {
  // Add the new task to the global list of tasks.
  const newTask = { "name": taskName, "completed": false };
  taskList.push(newTask);

  // Re-render the HTML
  renderHTML(IS_DIRTY);
}

function handleAddTaskKeypress(event) {
  if ('Enter' !== event.key) return;

  // Get the name of the new list and add it to the table of lists
  const elInputTask = document.querySelector('input');
  // console.log(elInputTask.value);
  addNewTask(elInputTask.value);
}

function handleTaskKeypress(event) {
  const index = event.target.id;

  switch (event.key) {
    case 'Delete':
    case 'Backspace':
    case 'd':
    case 'D':
      deleteTask(index);
      break;

    case 'Return':
      toggleCompleted(index);
  }
}

function handleTaskClicked(event) {
  toggleCompleted(event.target.id);
}

function deleteTask(index) {
  // alert(`Deleting element ${index}`);
  taskList.splice(index, 1);
  renderHTML(IS_DIRTY);
}

function toggleCompleted(index) {
  taskList[index].completed = !taskList[index].completed;
  renderHTML(IS_DIRTY);
}

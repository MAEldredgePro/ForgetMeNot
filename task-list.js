/////////////
// Globals //
/////////////

// Global constants //
const NEW_TASK_PROMPT = 'Add task <name + Enter>';
const CLEAR_COMPLETED_TASKS_PROMPT = 'Clear completed tasks';
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
renderPage(NOT_DIRTY);

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

function renderPage(isDirty) {
  // Clear the page.
  clearPage();

  // Add the UI for adding a task.
  addUIToPage_AddTask();

  // Add the UI for clearing completed tasks.
  addUIToPage_ClearCompletedTasks();

  // Add a line break.
  document.body.appendChild(document.createElement('br'));

  // Add the UI for the task list.
  addUIToPage_TaskList();

  // Save the task list if we are dirty.
  isDirty ? saveTaskList() : null;
}

function addUIToPage_AddTask() {
  // Create the 'Add Task' input element and add it to the web page.
  //  then add a keypress event handler to the input element that
  //  will handle the 'Enter' key, which creates and adds a new task.
  var elInput = addInputElement(NEW_TASK_PROMPT);
  elInput.addEventListener('keypress', handleKeypressAddTask);
  elInput.focus();
}

function addUIToPage_ClearCompletedTasks() {
  // Create the 'Clear Completed Tasks' button
  elButton = document.createElement('button');
  elButton.innerHTML = CLEAR_COMPLETED_TASKS_PROMPT;
  document.body.appendChild(elButton);

  // TODO:
  // Add event listeners that make the button work.
  // elButton.addEventListener('keypress', handleKeypressClearCompleted);
  elButton.addEventListener('click', handleClickClearCompleted);
}

function addUIToPage_TaskList() {
  // Add the tasks to the web page.
  taskList.forEach((task, index) => {

    // create the task
    elButton = document.createElement('button');
    elButton.innerHTML = task.name;
    elButton.setAttribute('id', index);
    task.completed ? elButton.setAttribute('class', 'completed') : null;

    // add event listeners to the task item for user interaction
    elButton.addEventListener('keyup', handleKeypressTaskItem);
    elButton.addEventListener('click', handleClickTaskItem);

    // add the task item to the page
    document.body.appendChild(elButton);
    document.body.appendChild(document.createElement('br'));
  });
}

function addInputElement(prompt) {
  var elInput = document.createElement('input');
  elInput.setAttribute('placeholder', prompt);
  document.body.appendChild(elInput);
  return elInput;
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

function removeAllCompletedTasks() {
  // Copy the contents of the live task list then empty the live task list.
  let tasks = taskList.splice(0, taskList.length);

  // Iterate all the saved tasks and push the incomplete ones back on to the
  //  live task list.
  tasks.forEach(function (task) {
    !task.completed ? taskList.push(task) : null;
  });

  // Re-render the HTML
  renderPage(IS_DIRTY);
}

function handleClickClearCompleted() {
  removeAllCompletedTasks();
}

function addTaskItem(taskItemName) {
  // Add the new task item to the list of tasks.
  const newTaskItem = { "name": taskItemName, "completed": false };
  taskList.push(newTaskItem);

  // Re-render the HTML
  renderPage(IS_DIRTY);
}

function handleKeypressAddTask(event) {
  if ('Enter' !== event.key) return;

  // Get the name of the new list and add it to the table of lists
  const elInputAddTask = document.querySelector('input');
  addTaskItem(elInputAddTask.value);
}

function handleKeypressTaskItem(event) {
  const index = event.target.id;

  switch (event.key) {
    case 'Tab':
      break;

    case 'Delete':
    case 'Backspace':
    case 'd':
    case 'D':
      deleteTaskItem(index);
      break;

    case 'Return':
      toggleTaskItemCompleted(index);

    default:
      console.log(event.key);
  }
}

function handleClickTaskItem(event) {
  toggleTaskItemCompleted(event.target.id);
}

function deleteTaskItem(index) {
  taskList.splice(index, 1);
  renderPage(IS_DIRTY);
}

function toggleTaskItemCompleted(index) {
  taskList[index].completed = !taskList[index].completed;
  renderPage(IS_DIRTY);
}

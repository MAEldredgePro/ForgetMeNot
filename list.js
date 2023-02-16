/////////////
// Globals //
/////////////

// Global constants //
const NEW_TASK_PROMPT = 'Add task <name + Enter>';
const DIRTY = true;
const NOT_DIRTY = false;

// Global variables
let taskList = null;

// Code called when the script loads - similar to other languages' main()
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const listId = params.id;

document.addEventListener('DOMContentLoaded', function () {
  loadTaskList();
  renderHTML(NOT_DIRTY);
});

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

function clearPage(isDirty) {
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
  elInputAddTask.focus();

  // Add the tasks to the task list
  taskList.forEach((task, index) => {
    elButton = document.createElement('button');
    elButton.innerHTML = task;
    elButton.addEventListener('click', function () {
      console.log(index);
      //    open(`list.html?id=${index}`, '_self');
    });
    document.body.appendChild(elButton);
  }
  );

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
  taskList.push(taskName);

  // Re-render the HTML
  renderHTML(DIRTY);
}

function handleAddTaskKeypress(event) {
  if ('Enter' !== event.key) return;

  // Get the name of the new list and add it to the table of lists
  const elInputTask = document.querySelector('input');
  console.log(elInputTask.value);
  addNewTask(elInputTask.value);
}

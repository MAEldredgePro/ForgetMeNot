/////////////
// Globals //
/////////////

// Global constants //
const NEW_TASK_PROMPT = 'Add task <name + Enter>';
const CLEAR_COMPLETED_TASKS_PROMPT = 'Clear completed tasks';
const IS_DIRTY = true;
const NOT_DIRTY = false;

// Global data type definitions //
class ActiveListSettings {
  taskWithFocus;
  isEditing;

  constructor() {
    this.taskWithFocus = -1;
    this.isEditing = false;
  }
}

// Global variables
let taskList;
let activeListSettings = new ActiveListSettings();

// Code called when the script loads - similar to other languages' main()
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const listIdStr = params.id;
var loopCount = 0;

loadTaskList();
renderPage(NOT_DIRTY);


//////////////////////////
// Function definitions //
//////////////////////////
function loadTaskList() {
  // load the task list from local storage
  taskList = JSON.parse(localStorage.getItem(listIdStr));

  // make sure we have at least an empty task list
  //  (local storage might have never been set and might have returned 'null').
  taskList = taskList || [];
}

function clearPage() {
  document.querySelector('body').innerHTML = '';
}

function renderPage(isDirty, idxOfTaskToGetFocus = -1) {
  // Clear the page.
  clearPage();

  // Add the UI for adding a task.
  addUIToPage_CreateTaskInput();

  // Add the UI for clearing completed tasks.
  addUIToPage_ClearCompletedTasksButton();

  // Add the UI for the task list.
  addUIToPage_TaskList(idxOfTaskToGetFocus);

  // Save the task list if we are dirty.
  isDirty ? saveTaskList() : null;
}

function addUIToPage_CreateTaskInput() {
  // Create the 'Add Task' input element and add it to the web page.
  //  then add a keypress event handler to the input element that
  //  will handle the 'Enter' key, which creates and adds a new task.
  var elInput = addInputElement(NEW_TASK_PROMPT);
  elInput.addEventListener('keypress', handleKeypressAddTask);
  elInput.focus();
}

function addUIToPage_ClearCompletedTasksButton() {
  // Create the 'Clear Completed Tasks' button
  elButton = document.createElement('button');
  elButton.innerHTML = CLEAR_COMPLETED_TASKS_PROMPT;
  document.body.appendChild(elButton);

  // Add event listeners for the ClearCompleted action on click
  elButton.addEventListener('click', handleClickClearCompleted);
}

function addUIToPage_TaskList(idxOfTaskToGetFocus) {
  // Add the tasks to the web page.
  taskList.forEach((task, index) => {

    // q&d formatting
    document.body.appendChild(document.createElement('br'));

    // create the edit button and add it to the page
    elButton = document.createElement('button');
    elButton.innerHTML = '✎';
    elButton.setAttribute('id', index);
    elButton.addEventListener('click', handleClickEditTask);
    document.body.appendChild(elButton);

    // create the task button and add it to the page
    elButton = document.createElement('button');
    elButton.innerHTML = task.name;
    elButton.setAttribute('id', index);
    task.completed ? elButton.setAttribute('class', 'completed') : null;
    // add event listeners to the task item for user interaction
    elButton.addEventListener('keyup', handleKeypressTaskItem);
    elButton.addEventListener('click', handleClickTaskItem);
    // add the task item button to the page
    document.body.appendChild(elButton);
    (index === idxOfTaskToGetFocus) ? elButton.focus() : null;
  });
}

function addInputElement(prompt) {
  var elInput = document.createElement('input');
  elInput.setAttribute('placeholder', prompt);
  document.body.appendChild(elInput);
  return elInput;
}

function addTaskItem(taskItemName) {
  // Add the new task item to the list of tasks.
  const newTaskItem = {
    "name": taskItemName,
    "completed": false,
  };

  taskList.push(newTaskItem);

  // Re-render the HTML
  renderPage(IS_DIRTY);
}

function deleteTaskItem(index) {
  taskList.splice(index, 1);
  renderPage(IS_DIRTY);
}

function handleArrowKey(index, requestedDelta) {
  // Check for any invalid or no-op conditions.
  if (taskList.length <= 1) return;
  if (requestedDelta === 0) return;

  const smallestValidIndex = 0;
  const largestValidIndex = taskList.length - 1;
  const newIndex = index + requestedDelta;
  if ((newIndex < smallestValidIndex) || (newIndex > largestValidIndex)) return;

  // Remove the item from the array.
  task = taskList.splice(index, 1)[0];

  // Add it back at the new position
  taskList.splice(newIndex, 0, task);

  // Render the modified page
  renderPage(IS_DIRTY, newIndex);
}

function handleClickClearCompleted() {
  removeAllCompletedTasks();
}

function handleClickTaskItem(event) {
  console.log(document.activeElement);
  toggleTaskItemCompleted(Number(event.target.id));
}

function handleClickEditTask(event) {
  const index = Number(event.target.id);
  // taskList[index].
  // console.log(event);
  // console.log('Editing task ' + event.target.id);
}

function handleKeypressAddTask(event) {
  if ('Enter' !== event.key) return;

  // Get the name of the new list and add it to the table of lists
  const elInputAddTask = document.querySelector('input');
  addTaskItem(elInputAddTask.value);
}

function handleKeypressTaskItem(event) {
  const index = Number(event.target.id);

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

    case 'ArrowUp':
      handleArrowKey(index, -1);
      break;

    case 'ArrowDown':
      handleArrowKey(index, +1);
      break;

    default:
      console.log(event.key);
  }
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

function saveTaskList() {
  // Save the task list so that it will come up the same if the app
  //  is shut down and re-loaded.
  if (taskList === null) {
    localStorage.removeItem(listIdStr);
    return;
  }

  localStorage.setItem(listIdStr, JSON.stringify(taskList));
}

function toggleTaskItemCompleted(index) {
  taskList[index].completed = !taskList[index].completed;
  renderPage(IS_DIRTY, index);
}

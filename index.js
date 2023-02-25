/////////////
// Globals //
/////////////

// Global constants //
const MASTER_LIST_STORAGE_KEY = 'toDoListTable';
const NEW_LIST_PROMPT = 'Add list <name + Enter>';
const DELETE_ALL_DATA = 'Delete All Data';
const IS_DIRTY = true;
const NOT_DIRTY = false;

// Global variables
let todoListTable = null;

// Code called when the script loads - similar to other languages' main()
document.addEventListener('DOMContentLoaded', function () {
  loadAppState();
  renderPage(NOT_DIRTY);
});

//////////////////////////
// Function definitions //
//////////////////////////
function loadAppState() {
  // load the table from local storage
  todoListTable = JSON.parse(localStorage.getItem(MASTER_LIST_STORAGE_KEY));

  // make sure we have at least an empty table (local storage might be empty).
  todoListTable = todoListTable || [];
}

function clearPage() {
  document.querySelector('body').innerHTML = '';
}

function renderPage(isDirty) {
  // Clear the page.
  clearPage();

  // Add the UI for adding a list.
  addUIToPage_AddList();

  // Add the UI for deleting all data.
  addUIToPage_DeleteAllData();

  // Add a line break.
  document.body.appendChild(document.createElement('br'));

  // Add the UI for the task list table
  addUIToPage_TaskListTable();

  // Save the app state if we are dirty.
  isDirty ? saveAppState() : null;
}

function addUIToPage_AddList() {
  // Create the 'Add List' input element.
  var elInputAddList = document.createElement('input');
  elInputAddList.setAttribute('placeholder', NEW_LIST_PROMPT);

  // Add the keypress event handler to the 'Add List' input element that
  //  will handle the 'Enter' key, creating and adding the new list.
  elInputAddList.addEventListener('keypress', handleAddListKeypress);
  document.body.appendChild(elInputAddList);
  elInputAddList.focus();
}

function addUIToPage_DeleteAllData() {
  // Create the 'Delete All Lists' button
  elButton = document.createElement('button');
  elButton.innerHTML = DELETE_ALL_DATA;
  elButton.addEventListener('click', deleteAllData);
  document.body.appendChild(elButton);
}

function addUIToPage_TaskListTable() {
  // Add the todo list table data
  todoListTable.forEach((todoList, index) => {

    // create the task list
    elButton = document.createElement('button');
    elButton.innerHTML = todoList;

    // Add event listener for user interaction
    elButton.addEventListener('click', function () {
      open(`task-list.html?id=${index}`, '_self');
    });
    document.body.appendChild(elButton);
    document.body.appendChild(document.createElement('br'));
  }
  );
}

function deleteAllData() {
  localStorage.clear();
  loadAppState();
  renderPage(IS_DIRTY);
}

function renderListPage(listId, listName) {
  clearPage();
  document.body.innerHTML += listName;
}

function saveAppState() {
  // Save the state of the app so that it will come up the same if the app
  //  is shut down and re-loaded.
  if (todoListTable === null) {
    localStorage.removeItem(MASTER_LIST_STORAGE_KEY);
    return;
  }

  localStorage.setItem(MASTER_LIST_STORAGE_KEY, JSON.stringify(todoListTable));
}

function addNewList(listName) {
  // Add the new list to the global list of lists.
  todoListTable.push(listName);

  // Re-render the HTML
  renderPage(IS_DIRTY);
}

function handleAddListKeypress(event) {
  if ('Enter' !== event.key) return;

  // Get the name of the new list and add it to the table of lists
  const elInputAddList = document.querySelector('input');
  console.log(elInputAddList.value);
  addNewList(elInputAddList.value);
}

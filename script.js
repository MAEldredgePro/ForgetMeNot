/////////////
// Globals //
/////////////

// Global constants //
const MASTER_LIST_STORAGE_KEY = 'toDoListTable';
const NEW_LIST_PROMPT = 'Add list <name + Enter>';
const DELETE_ALL_LISTS = 'Delete All Lists';
const DIRTY = true;
const NOT_DIRTY = false;

// debug code
// localStorage.removeItem(MASTER_LIST_STORAGE_KEY);

// Global variables
// let testString = 'testString was declared and initialized';
let todoListTable = null;

// Code called when the script loads - similar to other languages' main()
document.addEventListener('DOMContentLoaded', function () {
  loadAppState();
  renderHTML(NOT_DIRTY);
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

function deleteAllLists() {
  testString = null;
  saveAppState();
  loadAppState();
  renderHTML();
}

function renderHTML(isDirty = DIRTY) {
  // clear the current HTML
  document.querySelector('body').innerHTML = '';

  // Create the 'Delete All Lists' button
  let elButton = document.createElement('button');
  elButton.innerHTML = DELETE_ALL_LISTS;
  elButton.addEventListener('click', deleteAllLists);
  document.body.appendChild(elButton);

  // Create the 'Add List' input element.
  var elInputAddList = document.createElement('input');
  elInputAddList.setAttribute('placeholder', NEW_LIST_PROMPT);

  // Add the keypress event handler to the 'Add List' input element that
  //  will handle the 'Enter' key, creating and adding the new list.
  elInputAddList.addEventListener('keypress', handleAddListKeypress);
  document.body.appendChild(elInputAddList);
  elInputAddList.focus();

  // Add the app data
  todoListTable.forEach(todoList => {
    elButton = document.createElement('button');
    elButton.innerHTML = todoList;
    document.body.appendChild(elButton);
  }
  );

  // Save the app state if we are dirty.
  isDirty ? saveAppState() : null;
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

function handleAddListKeypress(event) {
  if ('Enter' !== event.key) return;

  // Get the name of the new list and add it to the table of lists
  const elInputAddList = document.querySelector('input');
  console.log(elInputAddList.value);
  addNewList(elInputAddList.value);
}

function addNewList(listName) {
  // Add the new list to the global list of lists.
  todoListTable.push(listName);

  // Re-render the HTML
  renderHTML();
}

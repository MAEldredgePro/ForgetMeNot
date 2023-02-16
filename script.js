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
  todoListTable = null;
  saveAppState();
  loadAppState();
  renderHTML();
}

function clearPage() {
  document.querySelector('body').innerHTML = '';
}

function renderHTML(isDirty = DIRTY) {
  let elButton = null;

  // clear the current HTML
  clearPage();

  // Create the 'Add List' input element.
  var elInputAddList = document.createElement('input');
  elInputAddList.setAttribute('placeholder', NEW_LIST_PROMPT);

  // Add the keypress event handler to the 'Add List' input element that
  //  will handle the 'Enter' key, creating and adding the new list.
  elInputAddList.addEventListener('keypress', handleAddListKeypress);
  document.body.appendChild(elInputAddList);
  elInputAddList.focus();

  // Create the 'Delete All Lists' button
  elButton = document.createElement('button');
  elButton.innerHTML = DELETE_ALL_LISTS;
  elButton.addEventListener('click', deleteAllLists);
  document.body.appendChild(elButton);

  // add a line break
  document.body.appendChild(document.createElement('br'));

  // Add the todo list table data
  todoListTable.forEach((todoList, index) => {

    // create the task list
    elButton = document.createElement('button');
    elButton.innerHTML = todoList;

    // Add event listener for user interaction
    elButton.addEventListener('click', function () {
      open(`list.html?id=${index}`, '_self');
    });
    document.body.appendChild(elButton);
    document.body.appendChild(document.createElement('br'));
  }
  );

  // Save the app state if we are dirty.
  isDirty ? saveAppState() : null;
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
  renderHTML();
}

function handleAddListKeypress(event) {
  if ('Enter' !== event.key) return;

  // Get the name of the new list and add it to the table of lists
  const elInputAddList = document.querySelector('input');
  console.log(elInputAddList.value);
  addNewList(elInputAddList.value);
}

// function handleListButtonClick(event) {
//   renderListPage(event.target.id, event.target.innerHTML);
//   // console.log(event);
// }

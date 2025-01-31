// ************ SELECT ITEMS ****************
const form = document.querySelector('.grocery-form');
const alert = document.querySelector('.alert');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const groceryList = document.querySelector('.grocery-list');
const groceryContainer = document.querySelector('.grocery-container');
const clearBtn = document.querySelector('.clear-btn');

// ************ EDIT OPTION ************
let editElement;
let editFlag = false;
let editID = '';

// ************ EVENT LISTENERS ****************
// submit form
form.addEventListener('submit', addItem);
// clear items
clearBtn.addEventListener('click', clearItems);
// load items
window.addEventListener('DOMContentLoaded', setupItems);

// ************ FUNCTIONS ****************
// add item
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    createListItem(id, value);

    // display alert
    displayAlert('item added to the list', 'success');
    // show container
    groceryContainer.classList.add('show-container');

    // add to local storage
    addToLocalStorage(id, value);

    // set back to default
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert('value changed', 'success');
    // edit local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert('please enter value', 'danger');
  }
}

// create list items
function createListItem(id, value) {
  const articleElement = document.createElement('article');
  articleElement.classList.add('grocery-item');

  // creating a resuable data-id attribute
  const dataIdAttr = document.createAttribute('data-id');
  dataIdAttr.value = id;
  articleElement.setAttributeNode(dataIdAttr);
  articleElement.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button class="edit-btn" type="button">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>`;

  const editBtn = articleElement.querySelector('.edit-btn');
  const deletebtn = articleElement.querySelector('.delete-btn');

  editBtn.addEventListener('click', editItem);
  deletebtn.addEventListener('click', deleteItem);

  // appending the articleElement to div.grocery-list
  groceryList.appendChild(articleElement);
}

// display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // remove alert
  setTimeout(function () {
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// Set back to default
function setBackToDefault() {
  grocery.value = '';
  submitBtn.textContent = 'submit';
  editFlag = false;
  editID = '';
}

// clear items
function clearItems() {
  const items = document.querySelectorAll('.grocery-item');

  if (items.length > 0) {
    items.forEach(function (item) {
      groceryList.removeChild(item);
    });
  }

  // display alert
  displayAlert('empty list', 'danger');
  // hide container
  groceryContainer.classList.remove('show-container');

  // clear all items from local storage
  localStorage.removeItem('list');
}

// deleting item
function deleteItem(e) {
  const item = e.currentTarget.parentElement.parentElement;
  groceryList.removeChild(item);

  if (groceryList.children.length === 0) {
    groceryContainer.classList.remove('show-container');
  }

  displayAlert('item removed', 'danger');
  setBackToDefault();

  // remove from local storage
  const id = item.getAttribute('data-id');
  removeFromLocalStorage(id);
}

// editing item
function editItem(e) {
  const item = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // console.log(editElement);

  // set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = item.dataset.id;
  submitBtn.textContent = 'edit';
}

// ************ LOCAL STORAGE ****************
// add to local storage
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();

  items.push(grocery);
  localStorage.setItem('list', JSON.stringify(items));
}

// remove from local storage
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem('list', JSON.stringify(items));
}

// editing local storage
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem('list', JSON.stringify(items));
}

// get local storage
function getLocalStorage() {
  return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];
}

// ************ SETUP ITEMS ****************
function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
  }
  groceryContainer.classList.add('show-container');
}

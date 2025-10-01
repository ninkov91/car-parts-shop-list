const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let itemBeingEdited = null;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach(item => addItemtoDOM(item));
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value.trim();

  if (newItem === '') {
    alert('Please add a car part');
    return;
  }

  if (itemBeingEdited) {
    removeItemFromStorage(itemBeingEdited.textContent);
    itemBeingEdited.remove();
    itemBeingEdited = null;
  } else {
    if (checkIfItemExist(newItem)) {
      alert('That item already exist');
      return;
    }
  }

  addItemtoDOM(newItem);

  addItemToStorage(newItem);

  checkUI();

  itemInput.value = '';
};

function addItemtoDOM(item) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
};

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item);

  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

function onClickItem(e) {
  const removeBtn = e.target.closest('.remove-item');
  if (removeBtn) {
    const li = removeBtn.closest('li');
    if (li) removeItem(li);
    return;
  }

  const li = e.target.closest('li');
  if (!li || !itemList.contains(li)) return;

  setItemToEdit(li);
}

function checkIfItemExist(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  if (!item || item.tagName !== 'LI') return;
  itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  itemBeingEdited = item;

  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>&nbsp;  Update Item';
  formBtn.style.backgroundColor = '#228b22';
  itemInput.value = item.firstChild.textContent;
}

function removeItem(item) {
  if (confirm('Are you sure?')) {
    item.remove();

    removeItemFromStorage(item.textContent);

    checkUI();
  }
};

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  localStorage.removeItem('items');

  checkUI();
}

function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }

  });
};

function checkUI() {
  itemInput.value = '';

  const items = itemList.querySelectorAll('li');
  clearBtn.style.display = items.length === 0 ? 'none' : 'block';
  itemFilter.style.display = items.length === 0 ? 'none' : 'block';

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  itemBeingEdited = null;
};

function init() {
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
}

init();



const { editMessageTextEventListener } = require('./editMessage');

let activeBox = null;
let activeEscapeHandler = null;

function createOptionsBox(messageId) {
  deleteOptionsBox();

  const container = document.createElement('div');
  container.classList.add('options-card');

  const editButton = createEditButton(messageId);
  const deleteButton = createDeleteButton(messageId);
  container.append(editButton, deleteButton);
  
  // Delete the container if the user presses escape
  function handleEscape(e) {
    if (e.key === 'Escape') {
      deleteOptionsBox();
    }
  }
  document.addEventListener('keydown', handleEscape);

  activeBox = container;
  activeEscapeHandler = handleEscape;
  
  // Dismiss optionsBox on outside click
  function handleClickOutside(e) {
    if (
      activeBox &&
      !activeBox.parentElement.contains(e.target)
    ) {
      deleteOptionsBox();
      document.removeEventListener('click', handleClickOutside);
    }
  }
  document.addEventListener('click', handleClickOutside);
  
  return container;
}

function createEditButton(messageId) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('title', 'Edit');
  button.classList.add('edit-button');
  button.innerText = '✏️';

  function editButtonListener(e) {
    e.preventDefault();
    e.stopPropagation();

    const nodes = document.querySelectorAll('.message-text');
    const messageContainer = Array.from(nodes).find((node) => node.getAttribute('data-id') == messageId);

    deleteOptionsBox();
    editMessageTextEventListener(e, messageContainer);
  }

  button.addEventListener('click', editButtonListener);

  return button;
}

function createDeleteButton(messageId) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('title', 'Delete');
  button.classList.add('delete-button');
  button.innerText = '🗑️';

  function deleteButtonListener(e) {
    e.preventDefault();
    e.stopPropagation();

    deleteOptionsBox();
    console.log(`Message id to be deleted: ${messageId}`);
  }

  button.addEventListener('click', deleteButtonListener);

  return button;
}

function deleteOptionsBox() {
  if (activeBox) {
    activeBox.remove();
    activeBox = null;
  }

  if (activeEscapeHandler) {
    document.removeEventListener('keydown', activeEscapeHandler);
    activeEscapeHandler = null;
  }
}

module.exports = {
  createOptionsBox,
}

const { editMessageTextEventListener } = require('./editMessage');
const { deleteMessageEventListener } = require('./deleteMessage');

let activeBox = null;

function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    deleteOptionsBox();
  }
}

function handleClickOutside(e) {
  if (
    activeBox &&
    !activeBox.parentElement.contains(e.target)
  ) {
    deleteOptionsBox();
  }
}

function createMessageOptionsBox(messageId) {
  deleteOptionsBox();

  const container = document.createElement('div');
  container.classList.add('options-card');

  const editButton = createEditButton(messageId);
  const deleteButton = createDeleteButton(messageId);
  container.append(editButton, deleteButton);
  
  activeBox = container;
  
  // Attach listener to close on esc and outside click
  document.addEventListener('keydown', handleEscapeKey);
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

    const messageContainer = document.querySelector(`.message-text[data-id="${messageId}"]`);

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
    deleteMessageEventListener(e, messageId);
  }

  button.addEventListener('click', deleteButtonListener);

  return button;
}

function deleteOptionsBox() {
  if (activeBox) {
    activeBox.remove();
    activeBox = null;
  }

  document.removeEventListener('keydown', handleEscapeKey);
  document.removeEventListener('click', handleClickOutside);
}

module.exports = {
  createMessageOptionsBox,
}

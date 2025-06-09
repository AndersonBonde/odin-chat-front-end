const { 
  deleteMessageFromDOM 
} = require('../ui/delete');
const {
  createEditForm,
  removeEditForm,
  hideOldContainerAndDisplayNewForm,
  updateOldMessage,
  moveCursorToEnd,
} = require('../ui/edit');
const {
  deleteMessageWithId,
  editMessageWithId,
} = require('../api');

let activeMessageActionMenu = null;

async function handleClickDeleteButton(e, id) {
  e.preventDefault();
  e.stopPropagation();

  const confirmed = window.confirm('Are you sure you want to delete this message?');

  if (confirmed) {
    const { success } = await deleteMessageWithId(id);

    if (success) {
      deleteMessageFromDOM(id);
    }
  }
}

async function handleClickEditButton(e, id) {
  e.preventDefault();
  e.stopPropagation();

  const container = document.querySelector(`.message-text[data-id="${id}"]`);
  const oldText = container.innerText;

  const { form, textArea } = createEditForm(oldText);
  hideOldContainerAndDisplayNewForm(container, form);
  moveCursorToEnd(textArea);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const { success } = await editMessageWithId(id, textArea.value);
    
    if (success) {
      updateOldMessage(textArea.value);
      removeEditForm();
    }
  });
}

function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closeMessageActionMenu();
  }
}

function handleClickOutside(e) {
  if (
    activeMessageActionMenu &&
    !activeMessageActionMenu.parentElement.contains(e.target)
  ) {
    closeMessageActionMenu();
  }
}

function createEditButton(messageId) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('title', 'Edit');
  button.classList.add('options-button');
  button.innerText = '✏️';

  button.addEventListener('click', (e) => {
    closeMessageActionMenu();
    handleClickEditButton(e, messageId);
  });

  return button;
}

function createDeleteButton(messageId) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('title', 'Delete');
  button.classList.add('options-button');
  button.innerText = '🗑️';

  button.addEventListener('click', (e) => {
    closeMessageActionMenu();
    handleClickDeleteButton(e, messageId);
  });

  return button;
}

function closeMessageActionMenu() {
  if (activeMessageActionMenu) {
    activeMessageActionMenu.remove();
    activeMessageActionMenu = null;
  }

  document.removeEventListener('keydown', handleEscapeKey);
  document.removeEventListener('click', handleClickOutside);
}

function createMessageActionMenu(messageId) {
  closeMessageActionMenu();

  const container = document.createElement('div');
  container.classList.add('options-card');

  const editButton = createEditButton(messageId);
  const deleteButton = createDeleteButton(messageId);
  container.append(editButton, deleteButton);
  
  activeMessageActionMenu = container;
  
  // Attach listener to close on esc and outside click
  document.addEventListener('keydown', handleEscapeKey);
  document.addEventListener('click', handleClickOutside);
  
  return container;
}

module.exports = {
  createMessageActionMenu,
};

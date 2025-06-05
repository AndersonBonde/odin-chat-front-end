let activeMessageActionMenu = null;

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

function deleteMessageFromDOM(id) {
  const messageContainer = document.querySelector(`.message-text[data-id="${id}"]`);
  const length = messageContainer.parentElement.children.length;

  // Delete the whole message-card if it contains only one message-text, else the single message
  if (messageContainer) {
    if (length <= 2) {
      messageContainer.parentElement.remove();
    } else {
      messageContainer.remove();
    }
  }
}

function createEditButton() {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('title', 'Edit');
  button.classList.add('options-button');
  button.innerText = '✏️';

  button.addEventListener('click', closeMessageActionMenu);

  return button;
}

function createDeleteButton() {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('title', 'Delete');
  button.classList.add('options-button');
  button.innerText = '🗑️';

  button.addEventListener('click', closeMessageActionMenu);

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
  deleteMessageFromDOM,
  
  
}
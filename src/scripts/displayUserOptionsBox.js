let activeBox = null;

function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    deleteUserOptionsBox();
  }
}

function handleClickOutside(e) {
  if (
    activeBox &&
    !activeBox.parentElement.contains(e.target)
  ) {
    deleteUserOptionsBox();
  }
}

function deleteUserOptionsBox() {
  if (activeBox) {
    activeBox.remove();
    activeBox = null;
  }

  document.removeEventListener('keydown', handleEscapeKey);
  document.removeEventListener('click', handleClickOutside);
}

function createNewChatButton() {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('options-button');
  button.innerText = '✚';

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    deleteUserOptionsBox();
  });

  return button;
}

function createUserOptionsBox() {
  deleteUserOptionsBox();

  const container = document.createElement('div');
  container.classList.add('options-card');

  const newChatButton = createNewChatButton();
  container.append(newChatButton);

  activeBox = container;

  // Listeners to close on esc and clicking outside the box
  document.addEventListener('keydown', handleEscapeKey);
  document.addEventListener('click', handleClickOutside);

  return container;
}

module.exports = {
  createUserOptionsBox,
}

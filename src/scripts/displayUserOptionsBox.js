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

function createNewChatButton(authorId, user) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('title', 'Create chat');
  button.classList.add('options-button');
  button.innerText = '✚';

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log(`User with id: ${user.id} is creating a new chat with user with id: ${authorId} WIP`);

    deleteUserOptionsBox();
  });

  return button;
}

function createFollowUserButton(authorId, user) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('title', 'Follow');
  button.classList.add('options-button');
  button.innerText = '➕👤';

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log(`User with id: ${user.id} is now following user with id: ${authorId} WIP`);

    deleteUserOptionsBox();
  });

  return button;
}

function createOpenOwnProfileButton() {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('title', 'Profile');
  button.classList.add('options-button');
  button.innerText = 'Profile';

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('Open own profile');

    deleteUserOptionsBox();
  });

  return button;
}

function createUserOptionsBox(authorId) {
  deleteUserOptionsBox();

  const user = JSON.parse(localStorage.getItem('user'));

  const container = document.createElement('div');
  container.classList.add('options-card');

  // Buttons for clicking own user
  if (user.id == authorId) {
    const profileButton = createOpenOwnProfileButton();
    container.append(profileButton);
  }

  // Buttons for clicking other users
  if (user.id != authorId) {
    const newChatButton = createNewChatButton(authorId, user);
    const followUser = createFollowUserButton(authorId, user);
    container.append(newChatButton, followUser);
  }

  activeBox = container;

  // Listeners to close on esc and clicking outside the box
  document.addEventListener('keydown', handleEscapeKey);
  document.addEventListener('click', handleClickOutside);

  return container;
}

module.exports = {
  createUserOptionsBox,
}

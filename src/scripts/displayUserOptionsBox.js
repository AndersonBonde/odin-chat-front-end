const { syncUser, getChatRooms, createNewChatRoom, followUserWithId, unfollowUserWithId } = require('./api');
const { openUserProfile } = require('./profile');
const { populateFollowingList } = require('./populateFollowList');
const { populateChatRoomList } = require('./populateRoomList');

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

async function chatAlreadyExists(authorId, userId) {
  const myRooms = await getChatRooms();

  for (let i = 0; i < myRooms.length; i++) {
    const room = myRooms[i];
    const memberIds = room.members.map((m) => m.id);

    if (
      memberIds.length == 2 &&
      memberIds.every((id) => (id == authorId || id == userId))
    ) { return room };
  }
  
  return false;
}

function createNewChatButton(authorId, user) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('title', 'Create chat');
  button.classList.add('options-button');
  button.innerText = '✚';

  button.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { loadChatWithId } = require('./loadGeneralChat');
    
    const room = await chatAlreadyExists(authorId, user.id);
    
    if (!room) {
      const memberIds = [user.id, authorId];

      const { success, data } = await createNewChatRoom(memberIds);

      if (success) {
        populateChatRoomList();
        loadChatWithId(data.chatRoom.id);
      }

    } else {
      loadChatWithId(room.id);
    }

    deleteUserOptionsBox();
  });

  return button;
}

function followingThisUser(authorId, user) {
  return user.following.some((f) => f.id == authorId);
}

async function followUser(e, authorId) {
  e.preventDefault();
  e.stopPropagation();

  deleteUserOptionsBox();

  const { success } = await followUserWithId(authorId);

  if (success) {
    await syncUser();
    populateFollowingList();
  }
}

async function unfollowUser(e, authorId) {
  e.preventDefault();
  e.stopPropagation();

  deleteUserOptionsBox();

  const { success } = await unfollowUserWithId(authorId);

  if (success) {
    await syncUser();
    populateFollowingList();
  }
}

function createFollowUserButton(authorId, user) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('options-button');

  // Check if is already following
  if (followingThisUser(authorId, user)) {
    button.setAttribute('title', 'Unfollow');
    button.innerText = '➖👤';

    button.addEventListener('click', (e) => unfollowUser(e, authorId));
  } else {
    button.setAttribute('title', 'Follow');
    button.innerText = '➕👤';

    button.addEventListener('click', (e) => followUser(e, authorId));
  }

  return button;
}

function createOpenOwnProfileButton() {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('title', 'Profile');
  button.classList.add('options-button');
  button.innerText = '👤';

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    openUserProfile();

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

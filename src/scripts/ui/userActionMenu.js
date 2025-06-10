const { 
  syncUser, 
  getChatRooms, 
  createNewChatRoom, 
  followUserWithId, 
  unfollowUserWithId 
} = require('../api');
const { 
  populateFollowingList, 
  populateChatRoomList 
} = require('../logic/asideController');
const { openUserProfile } = require('./profile');

let activeUserActionMenu = null;

function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    deleteUserActionMenu();
  }
}

function handleClickOutside(e) {
  if (
    activeUserActionMenu &&
    !activeUserActionMenu.parentElement.contains(e.target)
  ) {
    deleteUserActionMenu();
  }
}

function deleteUserActionMenu() {
  if (activeUserActionMenu) {
    activeUserActionMenu.remove();
    activeUserActionMenu = null;
  }

  document.removeEventListener('keydown', handleEscapeKey);
  document.removeEventListener('click', handleClickOutside);
}

async function chatAlreadyExists(authorId, userId) {
  const { rooms } = await getChatRooms();

  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    const memberIds = room.members.map((m) => m.id);

    if (
      memberIds.length == 2 &&
      memberIds.every((id) => (id == authorId || id == userId))
    ) { return room };
  }
  
  return false;
}

async function handleClickNewChatButton(authorId, user) {
  const room = await chatAlreadyExists(authorId, user.id);
  
  if (!room) {
    const memberIds = [user.id, authorId];

    const { success, data } = await createNewChatRoom(memberIds);
    
    if (success) {
      populateChatRoomList();
      loadChatWithId(data.chatRoom.id);
    }
    
  } else {
    const { loadChatWithId } = require('../logic/chatController');

    loadChatWithId(room.id);
  }
}

function createNewChatButton(authorId, user, listeners = null) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('title', 'Create chat');
  button.classList.add('options-button');
  button.innerText = '✚';
  
  button.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (Array.isArray(listeners)) {
      listeners.forEach((listener) => listener(authorId, user));
    }
  });
  
  return button;
}

function isFollowingThisUser(authorId, user) {
  return user.following.some((f) => f.id == authorId);
}

async function handleClickFollowButton(e, authorId) {
  e.preventDefault();
  e.stopPropagation();

  const { success } = await followUserWithId(authorId);

  if (success) {
    await syncUser();
    populateFollowingList();
  }
}

async function handleClickUnfollowButton(e, authorId) {
  e.preventDefault();
  e.stopPropagation();

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

  if (isFollowingThisUser(authorId, user)) {
    button.setAttribute('title', 'Unfollow');
    button.innerText = '➖👤';

    button.addEventListener('click', (e) => {
      deleteUserActionMenu();
      handleClickUnfollowButton(e, authorId);
    });
  } else {
    button.setAttribute('title', 'Follow');
    button.innerText = '➕👤';

    button.addEventListener('click', (e) => {
      deleteUserActionMenu();
      handleClickFollowButton(e, authorId);
    });
  }

  return button;
}

function createOpenOwnProfileButton(user) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('title', 'Profile');
  button.classList.add('options-button');
  button.innerText = '👤';

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    deleteUserActionMenu();
    openUserProfile(user);
  });

  return button;
}

function createUserActionMenu(authorId) {
  deleteUserActionMenu();

  const user = JSON.parse(localStorage.getItem('user'));

  const container = document.createElement('div');
  container.classList.add('options-card');

  // Buttons for clicking own user
  if (user.id == authorId) {
    const profileButton = createOpenOwnProfileButton(user);
    container.append(profileButton);
  } else { // Clicking other users
    const newChatButton = createNewChatButton(authorId, user, [deleteUserActionMenu, handleClickNewChatButton]);
    const followUser = createFollowUserButton(authorId, user);
    container.append(newChatButton, followUser);
  }

  activeUserActionMenu = container;

  // Listeners to close on esc and clicking outside the box
  document.addEventListener('keydown', handleEscapeKey);
  document.addEventListener('click', handleClickOutside);

  return container;
}

module.exports = {
  createUserActionMenu,
};

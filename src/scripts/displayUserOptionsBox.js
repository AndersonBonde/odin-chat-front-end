const { openUserProfile } = require('./profile');
const { syncUser, fetchChatRooms } = require('./utils');
const { populateFollowingList } = require('./populateFollowList');
const { populateChatRoomList } = require('./populateRoomList');

const token = localStorage.getItem('token');
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
  const myRooms = await fetchChatRooms();

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
      const token = localStorage.getItem('token');
      const memberIds = [user.id, authorId];

      try {
        const res = await fetch(`http://localhost:3000/chat-rooms`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token,
          },
          body: JSON.stringify({ memberIds }),
        }); 

        const data = await res.json();
        console.log(data.message, data.chatRoom);

        populateChatRoomList();
        loadChatWithId(data.chatRoom.id);

      } catch (err) {
        console.error(`Failed to create a new chat room`)
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

  try {
    await fetch(`http://localhost:3000/users/following/${authorId}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': token,
      },
    }); 
    
  } catch (err) {
    console.error(`Failed to follow user`, err);
  }

  await syncUser();
  populateFollowingList();
}

async function unfollowUser(e, authorId) {
  e.preventDefault();
  e.stopPropagation();

  deleteUserOptionsBox();

  try {
    await fetch(`http://localhost:3000/users/following/${authorId}`, {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': token,
      },
    }); 

  } catch (err) {
    console.error(`Failed to unfollow user`, err);
  }

  await syncUser();
  populateFollowingList();
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

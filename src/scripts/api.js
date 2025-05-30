const BASE_URL = 'http://localhost:3000';

async function getGuestNameFromIP() {
  try {
    const res = await fetch(`${BASE_URL}/connect`);
    const data = await res.json();

    return data.guestName;

  } catch (err) {
    console.error('Failed to fetch guest name from API', err);
  }
}

async function getAllGeneralChatMessages() {
  try {
    const res = await fetch(`${BASE_URL}/chat-rooms/general`);
    const data = await res.json();

    return data.messages;

  } catch (err) {
    console.error('Failed to load general messages', err);
  }
}

async function getAllMessagesFromChatWithId(id) {
  try {
    const token = localStorage.getItem('token');

    const res = await fetch(`${BASE_URL}/chat-rooms/${id}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token, 
      }
    });
    const data = await res.json();

    return data.messages;

  } catch (err) {
    console.error(`Failed to load messages from chat with id: ${id}`, err);
  }

}

async function postToGeneralChat(userId, text, guestName) {
  try {
    const res = await fetch(`${BASE_URL}/chat-rooms/general`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, text, guestName }),
    });
    const data = await res.json();

    return data.newMessage;

  } catch (err) {
    console.error('Failed to POST message to general chat', err);
  }
}

async function postToChatWithId(id, text) {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${BASE_URL}/chat-rooms/${id}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ 
        text,
      }),
    });
    const data = await res.json();

    return data.newMessage;

  } catch (err) {
    console.error(`Failed to POST message to chat with id: ${id}`, err);
  }
}

async function patchUserProfileWithId(id, name, color) {
  const token = localStorage.getItem('token');

  try {
    await fetch(`${BASE_URL}/users/profile/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ 
        profileName: name,
        displayColor: color, 
      }),
    });

  } catch (err) {
    console.error(`Failed to PATCH user profile`, err);
  }
}

async function getFollowingList() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!user) return;

  try {
    const res = await fetch(`${BASE_URL}/users/following/${user.id}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token,
      }
    });
    const data = await res.json();

    return data;

  } catch (err) {
    console.error('Failed to fetch following list', err);
  }
}

async function syncUser() {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });
    const data = await res.json();
    localStorage.setItem('user', JSON.stringify(data.user));
  
    return data.user;

  } catch (err) {
    console.error(`Failed to syncUser`, err);
  }
}

async function getChatRooms() {
  const token = localStorage.getItem('token');
  
  try {
    const res = await fetch(`${BASE_URL}/users/chat-rooms`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token,
      }
    });
    const data = await res.json();

    return data.chatRooms;

  } catch (err) {
    console.error('Failed to fetch chat rooms list', err);
  }
}

async function postLogin(email, password) {
  try {
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    return { success: res.ok, data };

  } catch (err) {
    console.error('Error logging in', err);
    return { success: false, data: { message: `Network error` }};
  }
}

async function postRegister(email, password, password_confirm) {
  try {
    const res = await fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, password_confirm }),
    });
    const data = await res.json();

    return { success: res.ok, data };

  } catch (err) {
    console.error('Error registering new user', err);
    return { success: false, data: { message: `Network error` }};
  }
}

module.exports = {
  getGuestNameFromIP,
  getAllGeneralChatMessages,
  getAllMessagesFromChatWithId,
  postToGeneralChat,
  postToChatWithId,
  patchUserProfileWithId,
  getFollowingList,
  syncUser,
  getChatRooms,
  postLogin,
  postRegister,
  
}

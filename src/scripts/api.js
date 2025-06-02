const BASE_URL = 'http://localhost:3000';

async function getGuestNameFromIP() {
  try {
    const res = await fetch(`${BASE_URL}/connect`);
    const data = await res.json();

    return { success: res.ok, name: data.guestName };

  } catch (err) {
    console.error('Failed to fetch guest name from API', err);
    return { success: false, name: 'guest' };
  }
}

async function getAllGeneralChatMessages() {
  try {
    const res = await fetch(`${BASE_URL}/chat-rooms/general`);
    const data = await res.json();

    return { success: res.ok, messages: data.messages };

  } catch (err) {
    console.error('Failed to load general messages', err);
    return { success: false, messages: [{ id: 0, text: 'Network error', guestName: 'Error' }] };
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

    return { success: res.ok, messages: data.messages };

  } catch (err) {
    console.error(`Failed to load messages from chat with id: ${id}`, err);
    return { success: false, messages: [{ id: 0, text: 'Network error', author: { id: 0, email: 'Error', profile: null } }] };
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

    return { success: res.ok, message: data.newMessage };

  } catch (err) {
    console.error('Failed to POST message to general chat', err);
    return { success: false, message: null };
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

    return { success: res.ok, message: data.newMessage };

  } catch (err) {
    console.error(`Failed to POST message to chat with id: ${id}`, err);
    return { success: false, message: null };
  }
}

async function patchUserProfileWithId(id, name, color) {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${BASE_URL}/users/profile/${id}`, {
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

    return { success: res.ok };

  } catch (err) {
    console.error(`Failed to PATCH user profile`, err);
    return { success: false };
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

    return { success: res.ok, list: data };

  } catch (err) {
    console.error('Failed to fetch following list', err);
    return { success: false, list: null };
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
  
    return { success: res.ok, user: data.user };

  } catch (err) {
    console.error(`Failed to syncUser`, err);
    return { success: false, user: null };
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

    return { success: res.ok, rooms: data.chatRooms };

  } catch (err) {
    console.error('Failed to fetch chat rooms list', err);
    return { success: false, rooms: null };
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

async function deleteMessageWithId(id) {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${BASE_URL}/messages/${id}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token,
      }
    });

    return { success: res.ok };

  } catch (err) {
    console.error(`Failed to DELETE message with id: ${id}`);
    return { success: false };
  }
}

async function createNewChatRoom(memberIds) {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${BASE_URL}/chat-rooms`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': token,
      },
      body: JSON.stringify({ memberIds }),
    }); 
    const data = await res.json();

    return { success: res.ok, data };
    
  } catch (err) {
    console.error(`Failed to create a new chat room`);
    return { success: false };
  }
}

async function followUserWithId(id) {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${BASE_URL}/users/following/${id}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': token,
      },
    }); 

    return { success: res.ok };

  } catch (err) {
    console.error(`Failed to follow user`, err);
    return { success: false };
  }
}

async function unfollowUserWithId(id) {
  const token = localStorage.getItem('token');
  
  try {
    const res = await fetch(`${BASE_URL}/users/following/${id}`, {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': token,
      },
    }); 

    return { success: res.ok };

  } catch (err) {
    console.error(`Failed to unfollow user`, err);
    return { success: false };
  }
}

async function editMessageWithId(id, text) {
  const token = localStorage.getItem('token');
  
  try {
    const res = await fetch(`${BASE_URL}/messages/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ text }),
    });

    return { success: res.ok };

  } catch (err) {
    console.error('Failed to PATCH message');
    return { success: false };
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
  deleteMessageWithId,
  createNewChatRoom,
  followUserWithId,
  unfollowUserWithId,
  editMessageWithId,

}

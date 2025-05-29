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

module.exports = {
  getGuestNameFromIP,
  getAllGeneralChatMessages,
  getAllMessagesFromChatWithId,
  postToGeneralChat,
  postToChatWithId,

}

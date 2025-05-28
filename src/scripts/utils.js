async function syncUser() {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch('http://localhost:3000/users/me', {
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
    console.error(`Failed to syncUser`);
  }
}

function setTokenExpiration(days) {
  const ms = Date.now() + days * 24 * 60 * 60 * 1000;

  localStorage.setItem('expiration', ms);
}

function checkIfTokenIsExpired() {
  const expiration = localStorage.getItem('expiration');

  return Date.now() > expiration;
}

async function fetchChatRooms() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  if (!user || !token) return;

  try {
    const res = await fetch(`http://localhost:3000/users/chat-rooms`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token,
      }
    });

    const data = await res.json();

    return data.chatRooms;

  } catch (err) {
    console.error('Failed to fetch chat rooms list');
  }
}

module.exports = {
  syncUser,
  setTokenExpiration,
  checkIfTokenIsExpired,
  fetchChatRooms,
}

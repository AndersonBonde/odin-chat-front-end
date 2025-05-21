const roomList = document.querySelector('#room-list');

async function fetchChatRooms() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  if (!user || !token) return;

  try {
    const res = await fetch(`http://localhost:3000/users/chat-rooms/${user.id}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token,
      }
    });

    const data = await res.json();

    return data;

  } catch (err) {
    console.error('Failed to fetch chat rooms list');
  }
}

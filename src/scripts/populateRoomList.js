const { loadChatWithId } = require('./loadGeneralChat');

const roomList = document.querySelector('#room-list');

// Fetch chat rooms the users is currently participating
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

function clearRoomList() {
  roomList.innerHTML = '';
}

async function clickRoomListener(e, room) {
  e.preventDefault();
  
  await loadChatWithId(room.id);
  console.log(`Room with id: ${room.id} was loaded`);
}

function createRoomCard(room) {
  const card = document.createElement('div');
  card.classList.add('room-card');
  card.setAttribute('data-id', room.id);
  card.innerText = room.name ? room.name : room.id;
  card.addEventListener('click', (e) => clickRoomListener(e, room));

  return card;
}

async function populateChatRoomList() {
  clearRoomList();

  const h3 = document.createElement('h3');
  h3.innerText = 'Rooms';
  roomList.append(h3);

  const rooms = await fetchChatRooms();

  rooms.forEach((room) => {
    const card = createRoomCard(room);
    roomList.append(card);
  });
}
populateChatRoomList();

module.exports = {
  populateChatRoomList,
}

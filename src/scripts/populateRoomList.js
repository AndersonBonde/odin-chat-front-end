const { getChatRooms } = require('./api');

const roomList = document.querySelector('#room-list');
const user = JSON.parse(localStorage.getItem('user'));

function clearRoomList() {
  roomList.innerHTML = '';
}

async function clickRoomListener(e, room) {
  e.preventDefault();

  const { loadChatWithId, loadGeneralChat } = require('./loadGeneralChat');

  if (room.name == 'General Chat') {
    await loadGeneralChat();
  } else {
    await loadChatWithId(room.id);
  }
}

function findRoomName(room) {
  const members = room.members.map((m) => m.email);
  const [other] = members.filter((m) => m != user.email);

  return other.split('@')[0];
}

function createRoomCard(room) {
  const card = document.createElement('div');
  card.classList.add('room-card');
  card.setAttribute('data-id', room.id);
  card.innerText = room.name ? room.name : findRoomName(room);
  card.addEventListener('click', (e) => clickRoomListener(e, room));

  return card;
}

async function populateChatRoomList() {
  if (!user) return;

  clearRoomList();

  const h3 = document.createElement('h3');
  h3.innerText = 'Rooms';
  roomList.append(h3);

  const rooms = await getChatRooms();

  rooms.forEach((room) => {
    const card = createRoomCard(room);
    roomList.append(card);
  });
}
populateChatRoomList();

module.exports = {
  populateChatRoomList,
}

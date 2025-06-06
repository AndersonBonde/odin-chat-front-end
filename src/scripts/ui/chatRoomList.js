const roomList = document.querySelector('#room-list');

function clearRoomList() {
  roomList.innerHTML = '';

  const h3 = document.createElement('h3');
  h3.innerText = 'Rooms';
  roomList.append(h3);
}

function findRoomName(room, user) {
  const members = room.members.map((m) => m.email);
  const [other] = members.filter((m) => m != user.email);

  return other.split('@')[0];
}

function createRoomCard(room, user) {
  const card = document.createElement('div');
  card.classList.add('room-card');
  card.setAttribute('data-id', room.id);
  card.innerText = room.name ? room.name : findRoomName(room, user);
  roomList.append(card);

  return card;
}

async function clickRoomListener(e, room) {
  e.preventDefault();

  const { loadChatWithId, loadGeneralChat } = require('../logic/chatController');

  if (room.name == 'General Chat') {
    await loadGeneralChat();
  } else {
    await loadChatWithId(room.id);
  }
}

module.exports = {
  clearRoomList,
  createRoomCard,
  clickRoomListener,
}

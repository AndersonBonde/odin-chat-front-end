const {
  createFollowCard,
  clearFollowingList,
} = require('../ui/followList');
const {
  clearRoomList,
  createRoomCard,
  clickRoomListener,
} = require('../ui/chatRoomList');
const { 
  getFollowingList,
  getChatRooms,
} = require('../api');

async function populateFollowingList() {
  clearFollowingList();
  
  const token = localStorage.getItem('token');
  if (!token) return;

  const { success, list } = await getFollowingList();

  if (success) {
    list.forEach((user) => {
      createFollowCard(user);
    })
  }
};

async function populateChatRoomList() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!user || !token) return;

  clearRoomList();

  const { success, rooms } = await getChatRooms();

  if (success) {
    rooms.forEach((room) => {
      const card = createRoomCard(room, user);
      card.addEventListener('click', (e) => clickRoomListener(e, room));
    });
  }
}

module.exports = {
  populateFollowingList,
  populateChatRoomList,

};

const { getFollowingList } = require('./api');

const followListDiv = document.querySelector('#follow-list');

function createFollowCard(user) {
  const card = document.createElement('div');
  card.classList.add('follow-card');

  const text = document.createTextNode(user.email);

  card.appendChild(text);

  return card;
}

async function populateFollowingList() {
  clearFollowingList();
  
  const token = localStorage.getItem('token');
  if (!token) return;

  const { success, list } = await getFollowingList();

  if (success) {
    list.forEach((user) => {
      const card = createFollowCard(user);
      followListDiv.appendChild(card);
    })
  }
};
populateFollowingList();

function clearFollowingList() {
  followListDiv.innerHTML = '';

  const title = document.createElement('h3');
  title.innerText = 'You follow';
  followListDiv.appendChild(title);
}

module.exports = {
  populateFollowingList,
}

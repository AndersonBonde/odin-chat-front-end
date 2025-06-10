const followListDiv = document.querySelector('#follow-list');

function createFollowCard(user) {
  const card = document.createElement('div');
  card.classList.add('follow-card');
  card.setAttribute('data-authorid', user.id);

  const text = document.createTextNode(user.email);

  card.appendChild(text);
  followListDiv.append(card);

  return card;
}

function clearFollowingList() {
  followListDiv.innerHTML = '';

  const title = document.createElement('h3');
  title.innerText = 'You follow';
  followListDiv.appendChild(title);
}

module.exports = {
  createFollowCard,
  clearFollowingList,
}

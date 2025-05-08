const followListDiv = document.querySelector('#follow-list');

async function fetchFollowingList() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!user) return;

  try {
    const res = await fetch(`http://localhost:3000/users/following/${user.id}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token,
      }
    });

    const data = await res.json();

    return data;

  } catch (err) {
    console.error('Failed to fetch following list');
  }
}

function createFollowCard(user) {
  const card = document.createElement('div');
  card.classList.add('follow-card');

  const text = document.createTextNode(user.email);

  card.appendChild(text);

  return card;
}


(async function populateFollowingList() {
  cleanFollowingList();

  const title = document.createElement('h3');
  title.innerText = 'You follow';
  followListDiv.appendChild(title);

  const following = await fetchFollowingList();

  if (following) {
    following.forEach((user) => {
      const card = createFollowCard(user);
      followListDiv.appendChild(card);
    })
  }
})();

function cleanFollowingList() {
  followListDiv.innerHTML = '';
}

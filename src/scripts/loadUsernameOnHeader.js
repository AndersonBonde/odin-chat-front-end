const guestNameDiv = document.getElementById('userName');
const spinner = document.getElementById('spinner');

const token = localStorage.getItem('token');
let guestName = null;

async function getGuestName() {
  try {
    const res = await fetch('http://localhost:3000/connect');
    if (!res.ok) throw new Error(`HTTP error: Status: ${res.status}`);

    const data = await res.json();
    hideSpinner();

    return data.guestName;
  } catch (err) {
    console.error('Failed to connect to API:', err);
  }
}

function hideSpinner() {
  spinner.style.display = 'none';
}

function showUsername(name) {
  guestNameDiv.innerText = 'Welcome ' + name;
}

(async function loadUsernameOnConnection() {
  if (!token) {
    guestName = await getGuestName();
    showUsername(guestName);
    localStorage.setItem('guest', guestName);
  } else {
    const user = JSON.parse(localStorage.getItem('user'));
    localStorage.removeItem('guest');

    showUsername(user.email);
  }
})();

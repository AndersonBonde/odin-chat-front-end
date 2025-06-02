const { getGuestNameFromIP } = require('./api');
const guestNameDiv = document.getElementById('userName');
const spinner = document.getElementById('spinner');

const token = localStorage.getItem('token');
let guestName = null;

function hideSpinner() {
  spinner.style.display = 'none';
}

async function getGuestName() {
  const { name } = await getGuestNameFromIP();
  hideSpinner();

  return name;
}

function showUsername(name) {
  guestNameDiv.innerText = 'Welcome ' + name;
}

async function loadUsernameOnConnection() {
  if (!token) {
    guestName = await getGuestName();
    showUsername(guestName);
    localStorage.setItem('guest', guestName);
  } else {
    const user = JSON.parse(localStorage.getItem('user'));
    localStorage.removeItem('guest');

    showUsername(user.email);
  }
};
loadUsernameOnConnection();

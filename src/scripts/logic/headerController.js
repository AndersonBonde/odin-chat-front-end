const { 
  logoutButton,
  settingsButton,
  profileButton,
  showSpinner, 
  hideSpinner, 
  showUsername, 
  displayButtonsForUser, 
  displayButtonsForGuest,
  logoutUser,
  toggleSettings,
  openProfile,
} = require("../ui/header");
const { getGuestNameFromIP } = require("../api");

const token = localStorage.getItem('token');

async function getGuestName() {
  const { name } = await getGuestNameFromIP();
  localStorage.setItem('guest', name);

  return name;
}

function removeGuestName() {
  localStorage.removeItem('guest');
}

async function loadUsernameOnStart() {
  showSpinner();

  if (!token) {
    const name = await getGuestName();
    showUsername(name);
  } else {
    const user = JSON.parse(localStorage.getItem('user'));
    
    showUsername(user.email);
    removeGuestName();
  }

  hideSpinner();
};

function loadHeaderButtonsOnStart() {
  if (token) {
    displayButtonsForUser();
  } else {
    displayButtonsForGuest();
  }
}

function attachHeaderListeners() {
  logoutButton.addEventListener('click', logoutUser);

  settingsButton.addEventListener('click', toggleSettings);

  profileButton.addEventListener('click', openProfile);
}

async function initializeHeader() {
  await loadUsernameOnStart();
  loadHeaderButtonsOnStart();
  attachHeaderListeners();
}

module.exports = {
  initializeHeader,

};

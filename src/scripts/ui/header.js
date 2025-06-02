const { openUserProfile } = require('../profile');

const spinner = document.getElementById('spinner');
const guestNameDiv = document.getElementById('userName');
const token = localStorage.getItem('token');
const loginButton = document.querySelector('#login-button');
const logoutButton = document.getElementById('logout-button');
const settingsButton = document.querySelector('#dropdown-settings-button');
const dropdown = document.querySelector('.dropdown-settings-menu');
const content = document.querySelector('.dropdown-settings-menu-content');
const profileButton = document.querySelector('#profile-button');

function showSpinner() {
  spinner.style.display = 'inline';
}

function hideSpinner() {
  spinner.style.display = 'none';
}

function showUsername(name) {
  guestNameDiv.innerText = 'Welcome ' + name;
}

function displayButtonsForUser() {
  loginButton.style.display = 'none';
  logoutButton.style.display = 'block';
  settingsButton.style.display = 'block';
}

function displayButtonsForGuest() {
  loginButton.style.display = 'block';
  logoutButton.style.display = 'none';
  settingsButton.style.display = 'none';
}

logoutButton.addEventListener('click', (e) => {
  e.preventDefault();

  localStorage.clear();

  window.location.href = './index.html';
});

function handleClickOutside(e) {
  if (!dropdown.contains(e.target)) {
    closeMenuDropdown();
  }
}

function closeMenuDropdown() {
  content.classList.remove('show');
  document.removeEventListener('click', handleClickOutside);
}

settingsButton.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = content.classList.toggle('show');
  
  if (isOpen) {
    document.addEventListener('click', handleClickOutside);
  } else {
    closeMenuDropdown();
  }
});

profileButton.addEventListener('click', () => {
  closeMenuDropdown();
  openUserProfile();
});

module.exports = {
  showSpinner,
  hideSpinner,
  showUsername,
  displayButtonsForUser,
  displayButtonsForGuest,

}

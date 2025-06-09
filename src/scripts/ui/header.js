const { openUserProfile } = require('./profile');

const spinner = document.getElementById('spinner');
const guestNameDiv = document.getElementById('userName');
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

function logoutUser(e) {
  e.preventDefault();

  localStorage.clear();

  window.location.href = './index.html';
}

function handleClickOutside(e) {
  if (!dropdown.contains(e.target)) {
    closeMenuDropdown();
  }
}

function closeMenuDropdown() {
  content.classList.remove('show');
  document.removeEventListener('click', handleClickOutside);
}

function toggleSettings(e) {
  e.stopPropagation();
  const isOpen = content.classList.toggle('show');
  
  if (isOpen) {
    document.addEventListener('click', handleClickOutside);
  } else {
    closeMenuDropdown();
  }
}

function openProfile() {
  const user = JSON.parse(localStorage.getItem('user'));
  closeMenuDropdown();
  openUserProfile(user);
}

module.exports = {
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

}

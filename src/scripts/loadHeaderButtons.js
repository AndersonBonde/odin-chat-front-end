const { openUserProfile } = require('./profile');

const token = localStorage.getItem('token');
const loginButton = document.querySelector('#login-button');
const logoutButton = document.getElementById('logout-button');
const settingsButton = document.querySelector('#dropdown-settings-button');
const dropdown = document.querySelector('.dropdown-settings-menu');
const content = document.querySelector('.dropdown-settings-menu-content');
const profileButton = document.querySelector('#profile-button');

if (token) {
  loginButton.style.display = 'none';
  logoutButton.style.display = 'block';
  settingsButton.style.display = 'block';
} else {
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

settingsButton.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = content.classList.toggle('show');
  
  if (isOpen) {
    document.addEventListener('click', handleClickOutside);
  } else {
    closeMenuDropdown();
  }
});

function closeMenuDropdown() {
  content.classList.remove('show');
  document.removeEventListener('click', handleClickOutside);
}

profileButton.addEventListener('click', (e) => {
  closeMenuDropdown();
  openUserProfile();
});

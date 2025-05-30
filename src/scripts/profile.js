const { patchUserProfileWithId, syncUser } = require('./api');

const profileForm = document.querySelector('#profile-form');
const nameInput = document.querySelector('#profile-name');
const displayColorInput = document.querySelector('#display-color');
const editButton = document.querySelector('.profile-edit-button');
const submitButton = document.querySelector('.profile-buttons-container button[type="submit"]');
const token = localStorage.getItem('token');

function loadProfile() {
  const user = JSON.parse(localStorage.getItem('user'));

  nameInput.value = user.profile.name;
  displayColorInput.value = user.profile.displayColor;

  editButton.style.display = 'block';
  submitButton.style.display = 'none';

  nameInput.setAttribute('disabled', true);
  displayColorInput.setAttribute('disabled', true);
}

profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem('user'));

  const { id } = user; 
  const profileName = nameInput.value;
  const displayColor = displayColorInput.value;

  // If user didn't change any value, return;
  if (profileName == user.profile.name && displayColor == user.profile.displayColor) {
    loadProfile();
    return;
  }

  await patchUserProfileWithId(id, profileName, displayColor);
  await syncUser();
  loadProfile();
});

function clickEdit() {
  editButton.style.display = 'none';
  submitButton.style.display = 'block';

  nameInput.removeAttribute('disabled');
  displayColorInput.removeAttribute('disabled');

  nameInput.focus();
}
editButton.addEventListener('click', clickEdit);

function openUserProfile() {
  document.querySelector('#chat').style.display = 'none';
  document.querySelector('aside').style.display = 'none';
  document.querySelector('#user-profile-container').style.display = 'block';

  loadProfile();
}

function leaveUserProfile() {
  document.querySelector('#chat').style.display = 'flex';
  document.querySelector('aside').style.display = 'flex';
  document.querySelector('#user-profile-container').style.display = 'none';

  // Reload the page to reflect any changes the user made in their profile
  window.location.href = './index.html';
}
document.querySelector('#user-profile-container .back-button').addEventListener('click', leaveUserProfile);

module.exports = {
  openUserProfile,
}

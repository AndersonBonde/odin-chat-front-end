const profileForm = document.querySelector('#profile-form');
const nameInput = document.querySelector('#profile-name');
const displayColorInput = document.querySelector('#display-color');
const editButton = document.querySelector('.profile-edit-button');
const submitButton = document.querySelector('.profile-buttons-container button[type="submit"]');
const backButton = document.querySelector('#user-profile-container .back-button');

function getProfileFormValues() {
  return {
    profileName: nameInput.value,
    displayColor: displayColorInput.value,
  };
}

function renderProfile(user) {
  const { profile } = user;

  nameInput.value = profile.name;
  displayColorInput.value = profile.displayColor;

  editButton.style.display = 'block';
  submitButton.style.display = 'none';

  nameInput.setAttribute('disabled', true);
  displayColorInput.setAttribute('disabled', true);
}

function enableEditMode() {
  editButton.style.display = 'none';
  submitButton.style.display = 'block';

  nameInput.removeAttribute('disabled');
  displayColorInput.removeAttribute('disabled');

  nameInput.focus();
}

function openUserProfile(user) {
  document.querySelector('#chat').style.display = 'none';
  document.querySelector('aside').style.display = 'none';
  document.querySelector('#user-profile-container').style.display = 'block';

  renderProfile(user);
}

function leaveUserProfile() {
  document.querySelector('#chat').style.display = 'flex';
  document.querySelector('aside').style.display = 'flex';
  document.querySelector('#user-profile-container').style.display = 'none';

  // Reload the page to reflect any changes the user made in their profile
  window.location.href = './index.html';
}

module.exports = {
  profileForm,
  editButton,
  backButton,
  getProfileFormValues,
  renderProfile,
  enableEditMode,
  openUserProfile,
  leaveUserProfile,
};

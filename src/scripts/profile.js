const { syncUser } = require('./utils');

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

  try {
    await fetch(`http://localhost:3000/users/profile/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ 
        profileName,
        displayColor 
      }),
    });
    
    await syncUser();
    loadProfile();
    
  } catch (err) {
    console.error(`Failed to PATCH profile`, err);
  }
});

function clickEdit() {
  editButton.style.display = 'none';
  submitButton.style.display = 'block';

  nameInput.removeAttribute('disabled');
  displayColorInput.removeAttribute('disabled');

  nameInput.focus();
}
editButton.addEventListener('click', clickEdit);

module.exports = {
  loadProfile,
}

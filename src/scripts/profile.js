const profileForm = document.querySelector('#profile-form');
const nameInput = document.querySelector('#profile-name');
const displayColorInput = document.querySelector('#display-color');
const editButton = document.querySelector('.profile-edit-button');
const submitButton = document.querySelector('.profile-buttons-container button[type="submit"]');
const user = JSON.parse(localStorage.getItem('user'));

function loadProfile() {
  nameInput.value = user.profile.name;
  displayColorInput.value = user.profile.displayColor;

  editButton.style.display = 'block';
  submitButton.style.display = 'none';

  nameInput.setAttribute('disabled', true);
  displayColorInput.setAttribute('disabled', true);
}

profileForm.addEventListener('submit', (e) => {
  e.preventDefault();

  console.log(nameInput.value, displayColorInput.value);

  // TODO Fetch POST to server
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

module.exports = {
  loadProfile,
}

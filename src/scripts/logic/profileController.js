const {
  profileForm,
  editButton,
  backButton,
  getProfileFormValues,
  renderProfile,
  enableEditMode,
  leaveUserProfile,
} = require('../ui/profile');
const {
  patchUserProfileWithId,
  syncUser,
} = require('../api');

async function handleProfileSubmit(e) {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem('user'));
  const { id, profile } = user;
  const { profileName, displayColor } = getProfileFormValues();

  const noChanges = profileName == profile.name && displayColor == profile.displayColor;

  if (noChanges) {
    renderProfile(user);
    return;
  }
  
  await patchUserProfileWithId(id, profileName, displayColor);
  await syncUser();
  renderProfile(user);
}

function attachProfileListeners() {
  editButton.addEventListener('click', enableEditMode);
  
  profileForm.addEventListener('submit', handleProfileSubmit);

  backButton.addEventListener('click', leaveUserProfile);
}

function initializeProfile() {
  attachProfileListeners();

}

module.exports = {
  initializeProfile,
  
};

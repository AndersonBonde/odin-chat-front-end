import { getGuestNameFromIP } from "../api";
import { showSpinner, hideSpinner, showUsername } from "../ui/header";

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
loadUsernameOnStart();

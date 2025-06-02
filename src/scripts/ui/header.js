const spinner = document.getElementById('spinner');
const guestNameDiv = document.getElementById('userName');

function showSpinner() {
  spinner.style.display = 'inline';
}

function hideSpinner() {
  spinner.style.display = 'none';
}

function showUsername(name) {
  guestNameDiv.innerText = 'Welcome ' + name;
}

module.exports = {
  showSpinner,
  hideSpinner,
  showUsername,
  
}

const token = localStorage.getItem('token');
const loginButton = document.querySelector('.login-button');
const logoutButton = document.getElementById('logout-button');

if (token) {
  loginButton.style.display = 'none';
  logoutButton.style.display = 'block';
} else {
  loginButton.style.display = 'block';
  logoutButton.style.display = 'none';
}

logoutButton.addEventListener('click', (e) => {
  e.preventDefault();

  localStorage.removeItem('token');
  localStorage.removeItem('user');

  window.location.href = './index.html';
});

const { syncUser, postLogin } = require('./api');
const { setTokenExpiration } = require('./utils');

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { success, data } = await postLogin(email, password);

  if (!success) {
    const errorsP = document.querySelector('.errors');
    if (errorsP) {
      errorsP.innerHTML = '';

      const text = document.createTextNode(data?.message || `An unknown error occurred.`);
      errorsP.appendChild(text);

      errorsP.style.color = 'tomato';
    }
    
    return;
  }

  localStorage.setItem('token', data.token);
  setTokenExpiration(parseInt(data.expiresIn));
  await syncUser();

  loginForm.reset();

  window.location.href = './index.html';
});

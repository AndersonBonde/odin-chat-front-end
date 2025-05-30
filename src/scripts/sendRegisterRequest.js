const { syncUser, postRegister } = require('./api');
const { setTokenExpiration } = require('./utils');

const registerForm = document.querySelector('#register-form');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const password_confirm = document.querySelector('#password_confirm').value;

  const { success, data } = await postRegister(email, password, password_confirm);

  if (!success) {
    const errorsP = document.querySelector('.errors');
    if (errorsP && data.errors) {
      errorsP.innerHTML = '';
      errorsP.style.whiteSpace = 'pre-line';

      data.errors.forEach((message) => {
        const text = document.createTextNode(message.msg + '\n');
        errorsP.appendChild(text);
      })

      errorsP.style.color = 'tomato';
    }

    return;
  }

  localStorage.setItem('token', data.token);
  setTokenExpiration(parseInt(data.expiresIn));
  await syncUser();

  registerForm.reset();

  window.location.href = './index.html';
});

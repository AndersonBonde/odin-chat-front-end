const { syncUser } = require('./utils');

const registerForm = document.querySelector('#register-form');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const password_confirm = document.querySelector('#password_confirm').value;

  try {
    const res = await fetch('http://localhost:3000/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, password_confirm }),
    });
    
    const data = await res.json();

    if (!res.ok) {
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
      
      throw new Error(`HTTP error: Status: ${res.status}`);
    }

    localStorage.setItem('token', data.token);
    await syncUser();

    registerForm.reset();

    window.location.href = './index.html';

  } catch (err) {
    console.error('Error registering new user', err);
  }
});

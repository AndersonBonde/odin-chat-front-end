const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:3000/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await res.json();

    if (!res.ok) {
      const errorsP = document.querySelector('.errors');
      if (errorsP) {
        errorsP.textContent = data.message;
        errorsP.style.color = 'tomato';
      }
      
      throw new Error(`HTTP error: Status: ${res.status}`);
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    loginForm.reset();

    window.location.href = './index.html';

  } catch (err) {
    console.error('Error logging in', err);
  }
});
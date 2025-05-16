async function syncUser() {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch('http://localhost:3000/users/me', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });
    const data = await res.json();
    localStorage.setItem('user', JSON.stringify(data.user));
  
    return data.user;

  } catch (err) {
    console.error(`Failed to syncUser`);
  }
}

module.exports = {
  syncUser,
}

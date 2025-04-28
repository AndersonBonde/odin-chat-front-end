const chatForm = document.getElementById('chat-typing-box');

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem('token'));

  const text = document.getElementById('chat-textarea').value;
  const author = user ? user.email : localStorage.getItem('guest');
  console.log(author, text);
});

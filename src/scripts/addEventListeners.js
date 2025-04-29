const chatForm = document.getElementById('chat-typing-box');

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const text = document.getElementById('chat-textarea').value;
  if (text.length < 1) return;

  const user = JSON.parse(localStorage.getItem('user'));

  const id = user?.id;
  const guestName = localStorage.getItem('guest') || null;

  try {
    const res = await fetch('http://localhost:3000/messages/chat-rooms/general', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, text, guestName }),
    });
    if (!res.ok) throw new Error(`Failed to POST message, Status: ${res.status}`);
  
    const data = await res.json();
    console.log(data.message, data.newMessage);

    window.location.href = './index.html'; // PLACEHOLDER
    
  } catch (err) {
    console.error('Failed to POST message', err);
  }

  chatForm.reset();
});

const chatWindow = document.getElementById('chat-window');

function createChatMessage(author, message) {
  const wrapper = document.createElement('div');
  const messageAuthor = document.createElement('p');
  const messageText = document.createElement('p');

  wrapper.classList.add('message-card');
  messageAuthor.classList.add('message-author');
  messageText.classList.add('message-text');

  messageAuthor.innerText = author;
  messageText.innerText = message;

  wrapper.appendChild(messageAuthor);
  wrapper.appendChild(messageText);

  chatWindow.appendChild(wrapper);

  return wrapper;
}

function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

(async function loadGeneralChat() {
  try {
    const res = await fetch('http://localhost:3000/messages');
    if (!res.ok) throw new Error(`Failed to fetch general messages from API. Status: ${res.status}`);

    const data = await res.json();

    for (let i = 0; i < data.messages.length; i++) {
      const { text, author, guestName } = data.messages[i];

      const messageAuthor = guestName ? guestName : author.email;

      createChatMessage(messageAuthor, text);
    }

    scrollToBottom();

  } catch (err) {
    console.error('Failed to load general messages', err);
  }
})();

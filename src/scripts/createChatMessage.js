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

export { createChatMessage };

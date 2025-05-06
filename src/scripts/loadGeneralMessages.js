const { removeEditForm } = require('./editMessage');
const { createOptionsBox } = require('./displayOptionsPopup');

const user = JSON.parse(localStorage.getItem('user'));
const chatWindow = document.getElementById('chat-window');

let lastMessageAuthor = undefined;

function createChatMessage(author, message, messageId) {
  const messageText = document.createElement('p');
  let wrapper;

  messageText.classList.add('message-text');
  messageText.innerText = message;
  messageText.setAttribute('data-id', messageId);
  messageText.setAttribute('data-author', author);

  if (user && user.email == author) {
    messageText.addEventListener('click', (e) => {
      const optionsBox = createOptionsBox(messageId);
      messageText.appendChild(optionsBox);
    });
  }

  // Will add follow up messages from the same user under the same message-card else create a new one
  if (author == lastMessageAuthor) {
    wrapper = document.querySelector('#chat-window').lastChild;

    wrapper.appendChild(messageText);
  } else {
    const messageAuthor = document.createElement('p');
    wrapper = document.createElement('div');
  
    wrapper.classList.add('message-card');
    messageAuthor.classList.add('message-author');
  
    messageAuthor.innerText = author;
  
    wrapper.appendChild(messageAuthor);
    wrapper.appendChild(messageText);
  
    chatWindow.appendChild(wrapper);
  }

  lastMessageAuthor = author;

  return wrapper;
}

function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

(async function loadGeneralChat() {
  try {
    const chat = document.getElementById('chat-textarea');

    chat.focus();
    chat.addEventListener('focus', removeEditForm);

    const res = await fetch('http://localhost:3000/messages/chat-rooms/general');
    if (!res.ok) throw new Error(`Failed to fetch general messages from API. Status: ${res.status}`);

    const data = await res.json();

    for (let i = 0; i < data.messages.length; i++) {
      const { text, author, guestName, id } = data.messages[i];

      const messageAuthor = guestName ? guestName : author.email;

      createChatMessage(messageAuthor, text, id);
    }

    scrollToBottom();

  } catch (err) {
    console.error('Failed to load general messages', err);
  }
})();

const { createMessageOptionsBox } = require('./displayMessageOptionsPopup');
const { createUserOptionsBox } = require('./displayUserOptionsBox');

const chatForm = document.getElementById('chat-typing-box');
const user = JSON.parse(localStorage.getItem('user'));
const chatWindow = document.getElementById('chat-window');

let lastMessageAuthor = null;

// Decode escaped characters from database back to original symbols
function decodeHTMLEntities(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

function createChatMessage(author, message, messageId, profile = null) {
  const messageText = document.createElement('p');
  let wrapper;

  messageText.classList.add('message-text');
  messageText.innerText = decodeHTMLEntities(message);
  messageText.setAttribute('data-id', messageId);
  messageText.setAttribute('data-author', author);

  // Render edit options box if own message is clicked for edit and delete
  if (user && user.email == author) {
    messageText.classList.add('hover-is-pointer');

    messageText.addEventListener('click', (e) => {
      const messageOptionsBox = createMessageOptionsBox(messageId);
      messageText.appendChild(messageOptionsBox);
    });
  }

  // Will add follow up messages from the same user under the same message-card else create a new one
  if (author == lastMessageAuthor) {
    wrapper = chatWindow.lastChild;

    wrapper.appendChild(messageText);
  } else {
    const messageAuthor = document.createElement('p');
    wrapper = document.createElement('div');
  
    wrapper.classList.add('message-card');
    messageAuthor.classList.add('message-author');
  
    messageAuthor.innerText = author;
  
    wrapper.appendChild(messageAuthor);
    wrapper.appendChild(messageText);

    // Update card with profile options
    if (profile) {
      const { name, displayColor } = profile;

      messageAuthor.innerText = name;
      messageAuthor.style.color = displayColor;
    }
  
    chatWindow.appendChild(wrapper);

    
    // Render user options box when a userName is clicked && it's not a guest
    if (user && author.slice(0, 5) !== 'guest') {
      messageAuthor.classList.add('hover-is-pointer');    

      // TODO Add data.id to the messageAuthor div

      messageAuthor.addEventListener('click', (e) => {
        const userOptionsBox = createUserOptionsBox();
        messageAuthor.appendChild(userOptionsBox);
      })
    }
  }

  lastMessageAuthor = author;

  return wrapper;
}

function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const text = document.getElementById('chat-textarea').value;
  if (text.length < 1) return;

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

    const author = user ? user.email : guestName;
    const messageId = data.newMessage.id;
    const profile = user ? user.profile : null;

    createChatMessage(author, text, messageId, profile);
    scrollToBottom();
    
  } catch (err) {
    console.error('Failed to POST message', err);
  }

  chatForm.reset();
});

// Load and display all messages on page load
(async function loadGeneralChat() {
  // Focus chatBox on first load
  const chat = document.getElementById('chat-textarea');
  chat.focus();

  try {
    const res = await fetch('http://localhost:3000/messages/chat-rooms/general');
    if (!res.ok) throw new Error(`Failed to fetch general messages from API. Status: ${res.status}`);

    const data = await res.json();

    for (let i = 0; i < data.messages.length; i++) {
      const { text, author, guestName, id } = data.messages[i];

      const messageAuthor = guestName ? guestName : author.email;
      const profile = author ? author.profile : null;

      createChatMessage(messageAuthor, text, id, profile);
    }

    scrollToBottom();

  } catch (err) {
    console.error('Failed to load general messages', err);
  }
})();

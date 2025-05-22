const { createMessageOptionsBox } = require('./displayMessageOptionsPopup');
const { createUserOptionsBox } = require('./displayUserOptionsBox');

const chatForm = document.getElementById('chat-typing-box');
const user = JSON.parse(localStorage.getItem('user'));
const chatWindow = document.getElementById('chat-window');

let lastMessageAuthor = null;
let chatFormListener = null;

// Decode escaped characters from database back to original symbols
function decodeHTMLEntities(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

function createChatMessage(author, message, messageId, profile, authorId) {
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
      messageAuthor.setAttribute('data-authorId', authorId);

      messageAuthor.addEventListener('click', (e) => {
        const userOptionsBox = createUserOptionsBox(authorId);
        messageAuthor.appendChild(userOptionsBox);
      })
    }
  }

  lastMessageAuthor = author;

  return wrapper;
}

// Scroll to bottom(most recent) in case the chat window overflows
function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Load and display general messages on chat window
async function loadGeneralChat() {
  clearChat();

  // Focus chatBox on first load
  const chat = document.getElementById('chat-textarea');
  chat.focus();

  // Fetch all general chat messages from server
  try {
    const res = await fetch('http://localhost:3000/chat-rooms/general');
    if (!res.ok) throw new Error(`Failed to fetch general messages from API. Status: ${res.status}`);

    const data = await res.json();

    // Create message-card for each message and display them on chat window
    for (let i = 0; i < data.messages.length; i++) {
      const { text, author, guestName, id } = data.messages[i];

      const messageAuthor = guestName ? guestName : author.email;
      const profile = author ? author.profile : null;
      const authorId = author ? author.id : null;

      createChatMessage(messageAuthor, text, id, profile, authorId);
    }

    scrollToBottom();

    // Attach correct listener to chat form submit
    chatForm.addEventListener('submit', generalChatListener);
    chatFormListener = generalChatListener;

  } catch (err) {
    console.error('Failed to load general messages', err);
  }
};

// Loads general chat on first load
loadGeneralChat();

async function loadChatWithId(chatId) {
  clearChat();

  // Focus chatBox on first load
  const chat = document.getElementById('chat-textarea');
  chat.focus();

  // Fetch all messages from chat with id: ${id}
  try {
    const token = localStorage.getItem('token');

    const res = await fetch(`http://localhost:3000/chat-rooms/${chatId}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token, 
      }
    });
    if (!res.ok) throw new Error(`Failed to fetch general messages from API. Status: ${res.status}`);

    const data = await res.json();

    // Create message-card for each message and display them on chat window
    for (let i = 0; i < data.messages.length; i++) {
      const { text, author, id } = data.messages[i];

      const messageAuthor = author.email;
      const profile = author.profile;
      const authorId = author.id;

      createChatMessage(messageAuthor, text, id, profile, authorId);
    }

    scrollToBottom();

    // Attach correct listener to chat form submit
    const listener = (e) => chatListener(e, chatId);
    chatForm.addEventListener('submit', listener);
    chatFormListener = listener;

  } catch (err) {
    console.error('Failed to load general messages', err);
  }
  
}

async function generalChatListener(e) {
  e.preventDefault();
  
  const text = document.getElementById('chat-textarea').value;
  if (text.length < 1) return;

  const id = user?.id;
  const guestName = localStorage.getItem('guest') || null;

  try {
    const res = await fetch('http://localhost:3000/chat-rooms/general', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, text, guestName }),
    });
    if (!res.ok) throw new Error(`Failed to POST message, Status: ${res.status}`);
  
    const data = await res.json();

    const author = user ? user.email : guestName;
    const authorId = user ? user.id : null;
    const messageId = data.newMessage.id;
    const profile = user ? user.profile : null;

    createChatMessage(author, text, messageId, profile, authorId);
    scrollToBottom();
    
  } catch (err) {
    console.error('Failed to POST message', err);
  }

  chatForm.reset();
}

async function chatListener(e, chatId) {
  e.preventDefault();
  
  const text = document.getElementById('chat-textarea').value;
  if (text.length < 1) return;

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`http://localhost:3000/chat-rooms/${chatId}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ 
        id: user.id,
        text
      }),
    });
    if (!res.ok) throw new Error(`Failed to POST message to chat with id: ${chatId}, Status: ${res.status}`);

    const data = await res.json();

    const author = user.email;
    const authorId = user.id;
    const messageId = data.newMessage.id;
    const profile = user.profile;

    createChatMessage(author, text, messageId, profile, authorId);
    scrollToBottom();

  } catch (err) {
    console.error('Failed to POST message', err);
  }
}

function clearChat() {
  if (chatFormListener) {
    chatForm.removeEventListener('submit', chatFormListener);
    chatFormListener = null;
  }

  chatWindow.innerHTML = '';
}

module.exports = {
  loadGeneralChat,
  loadChatWithId,
}

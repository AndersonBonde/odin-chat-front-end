const { getAllGeneralChatMessages, getAllMessagesFromChatWithId, postToGeneralChat, postToChatWithId } = require('./api');
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

function focusChatBox() {
  const chat = document.getElementById('chat-textarea');
  chat.focus();
}

// Load and display general messages on chat window
async function loadGeneralChat() {
  clearChat();
  focusChatBox();

  const messages = await getAllGeneralChatMessages();

  // Create message-card for each message and display them on chat window
  for (let i = 0; i < messages.length; i++) {
    const { text, author, guestName, id } = messages[i];

    const messageAuthor = guestName ? guestName : author.email;
    const profile = author ? author.profile : null;
    const authorId = author ? author.id : null;

    createChatMessage(messageAuthor, text, id, profile, authorId);
  }

  scrollToBottom();

  // Attach correct listener to chat form submit
  chatForm.addEventListener('submit', generalChatListener);
  chatFormListener = generalChatListener;
};

// Loads general chat on first load
loadGeneralChat();

async function loadChatWithId(chatId) {
  clearChat();
  focusChatBox();

  // Fetch all messages from chat with id: ${chatId}
  const messages = await getAllMessagesFromChatWithId(chatId);

  // Create message-card for each message and display them on chat window
  for (let i = 0; i < messages.length; i++) {
    const { text, author, id } = messages[i];

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
}

async function generalChatListener(e) {
  e.preventDefault();
  
  const text = document.getElementById('chat-textarea').value;
  if (text.length < 1) return;

  const id = user?.id;
  const guestName = localStorage.getItem('guest') || null;

  const postedMessage = await postToGeneralChat(id, text, guestName);

  const author = user ? user.email : guestName;
  const authorId = user ? user.id : null;
  const messageId = postedMessage.id;
  const profile = user ? user.profile : null;

  createChatMessage(author, text, messageId, profile, authorId);
  scrollToBottom();
    
  chatForm.reset();
}

async function chatListener(e, chatId) {
  e.preventDefault();
  
  const text = document.getElementById('chat-textarea').value;
  if (text.length < 1) return;

  const user = JSON.parse(localStorage.getItem('user'));

  const postedMessage = await postToChatWithId(chatId, text);

  const author = user.email;
  const authorId = user.id;
  const messageId = postedMessage.id;
  const profile = user.profile;

  createChatMessage(author, text, messageId, profile, authorId);
  scrollToBottom();

  chatForm.reset();
}

function clearChat() {
  if (chatFormListener) {
    chatForm.removeEventListener('submit', chatFormListener);
    chatFormListener = null;
  }

  lastMessageAuthor = null;
  chatWindow.innerHTML = '';
}

module.exports = {
  loadGeneralChat,
  loadChatWithId,
}

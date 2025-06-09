const { createUserActionMenu } = require('./userActionMenu');
const { createMessageActionMenu } = require('./messageActionMenu');

const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-typing-box');

let lastMessageAuthor = null;
let chatFormListener = null;

// Decode escaped characters from database back to original symbols
function decodeHTMLEntities(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

function renderMessageActionMenu(user, message) {
  const { id, author } = message.dataset;

  if (user && user.email == author) {
    message.classList.add('hover-is-pointer');

    message.addEventListener('click', () => {
      const messageActionMenu = createMessageActionMenu(id);
      message.appendChild(messageActionMenu);
    });
  }
}

function renderUserActionMenu(user, authorParagraph, author, authorId) {
  if (user && author.slice(0, 5) !== 'guest') {
    authorParagraph.classList.add('hover-is-pointer');
    authorParagraph.setAttribute('data-authorId', authorId);

    authorParagraph.addEventListener('click', () => {
      const userActionMenu = createUserActionMenu(authorId);
      authorParagraph.appendChild(userActionMenu);
    })
  }
}

function applyProfileOptions(profile, authorParagraph) {
  if (profile) {
    const { name, displayColor } = profile;

    authorParagraph.innerText = name;
    authorParagraph.style.color = displayColor;
  }
}

function createChatMessage(user, message) {
  const { id, text, author, guestName } = message;
  const authorId = author?.id ?? null;
  const profile = author?.profile ?? null;
  const authorName = author?.email ?? guestName;

  const messageParagraph = document.createElement('p');
  let wrapper;

  messageParagraph.classList.add('message-text');
  messageParagraph.innerText = decodeHTMLEntities(text);
  messageParagraph.setAttribute('data-id', id);
  messageParagraph.setAttribute('data-author', authorName);

  renderMessageActionMenu(user, messageParagraph);

  // Will add follow up messages from the same user under the same message-card else create a new one
  if (authorName == lastMessageAuthor) {
    wrapper = chatWindow.lastChild;

    wrapper.appendChild(messageParagraph);
  } else {
    const authorParagraph = document.createElement('p');
    wrapper = document.createElement('div');
  
    wrapper.classList.add('message-card');
    authorParagraph.classList.add('message-author');
  
    authorParagraph.innerText = authorName;
  
    wrapper.appendChild(authorParagraph);
    wrapper.appendChild(messageParagraph);
    
    renderUserActionMenu(user, authorParagraph, authorName, authorId);
    applyProfileOptions(profile, authorParagraph);

    chatWindow.appendChild(wrapper);
  }

  lastMessageAuthor = authorName;

  return wrapper;
}

function setFormListener(listener) {
  chatFormListener = listener;
}

function clearChat() {
  if (chatFormListener) {
    chatForm.removeEventListener('submit', chatFormListener);
    chatFormListener = null;
  }

  lastMessageAuthor = null;
  chatWindow.innerHTML = '';
}

function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function focusChatBox() {
  const chat = document.getElementById('chat-textarea');
  chat.focus();
}

module.exports = {
  chatForm,
  createChatMessage,
  setFormListener,
  clearChat,
  scrollToBottom,
  focusChatBox,
};

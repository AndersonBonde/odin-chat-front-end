const { 
  getAllGeneralChatMessages, 
  getAllMessagesFromChatWithId, 
  postToGeneralChat, 
  postToChatWithId 
} = require('../api');
const { 
  chatForm,
  createChatMessage,
  setFormListener,
  clearChat,
  scrollToBottom,
  focusChatBox,
} = require('../ui/chat');

async function loadGeneralChat() {
  const user = JSON.parse(localStorage.getItem('user'));

  clearChat();
  focusChatBox();

  const { messages } = await getAllGeneralChatMessages();

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];

    createChatMessage(user, message);
  }

  scrollToBottom();

  // Attach correct listener to chat form submit
  chatForm.addEventListener('submit', handleSubmitToGeneralChat);
  setFormListener(handleSubmitToGeneralChat);
};

async function loadChatWithId(chatId) {
  const user = JSON.parse(localStorage.getItem('user'));

  clearChat();
  focusChatBox();

  const { messages } = await getAllMessagesFromChatWithId(chatId);

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];

    createChatMessage(user, message);
  }

  scrollToBottom();

  // Attach correct listener to chat form submit
  const listener = (e) => handleSubmitToChatWithId(e, chatId);
  chatForm.addEventListener('submit', listener);
  setFormListener(listener);
}

async function handleSubmitToGeneralChat(e) {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem('user'));
  
  const text = document.getElementById('chat-textarea').value;
  if (text.length < 1) return;

  const id = user?.id;
  const guestName = localStorage.getItem('guest') || null;

  const { success, message } = await postToGeneralChat(id, text, guestName);

  if (success) {
    createChatMessage(user, message);
    scrollToBottom();

    chatForm.reset();
  } else {
    console.warn('Failed to post message');
  }
}

async function handleSubmitToChatWithId(e, chatId) {
  e.preventDefault();
  
  const user = JSON.parse(localStorage.getItem('user'));

  const text = document.getElementById('chat-textarea').value;
  if (text.length < 1) return;

  const { success, message } = await postToChatWithId(chatId, text);

  if (success) {
    createChatMessage(user, message);
    scrollToBottom();
  
    chatForm.reset();
  } else {
    console.warn('Failed to post message');
  }
}

module.exports = {
  loadGeneralChat,
  loadChatWithId,
}

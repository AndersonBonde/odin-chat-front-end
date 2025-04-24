import './style.css';
import './scripts/loadHeaderButtons';
import './scripts/loadUsernameOnHeader';

import { createChatMessage } from './scripts/createChatMessage';

createChatMessage('Author 02', 'Hello world');
createChatMessage('Author 01', 'Testing the createChatMessage function');

function scrollToBottom() {
  const chatWindow = document.getElementById('chat-window');
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

scrollToBottom();

const chatWindow = document.getElementById('chat-window');

let lastMessageAuthor = undefined;

// TODO Add edit button to messages
// TODO Add delete button to messages

function createChatMessage(author, message, messageId) {
  const messageText = document.createElement('p');
  let wrapper;

  messageText.classList.add('message-text');
  messageText.innerText = message;
  messageText.setAttribute('data-id', messageId);
  messageText.setAttribute('data-author', author);

  messageText.addEventListener('click', (e) => {
    editMessageTextEventListener(e, messageText);
  });

  // Will add follow up messages from the same user under the same message-card
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

// Event listener to allow users to edit their messages
function editMessageTextEventListener(e, container) {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem('user'));
  const author = container.dataset.author;
  const id = container.dataset.id;
  const oldText = container.innerText;

  if (!user || author != user.email) return;

  // Create form
  const editForm = document.createElement('form');
  editForm.id = 'edit-form';

  const editTextarea = document.createElement('input');
  editTextarea.setAttribute('type', 'text');
  editTextarea.id = 'edit-textarea';
  editTextarea.value = oldText;

  const editSubmitButton = document.createElement(`button`);
  editSubmitButton.setAttribute('type', 'submit');
  editSubmitButton.id = 'edit-submit-button';
  editSubmitButton.textContent = '➤';
  editSubmitButton.addEventListener('click', (e) =>  EditSubmitButtonEventListener(e, id, editTextarea.value));

  editForm.appendChild(editTextarea);
  editForm.appendChild(editSubmitButton);

  // Find index of container inside the parentElement
  const index = Array.from(container.parentElement.children).indexOf(container);
  
  // Hide container and display the editForm in the same index
  container.style.display = 'none';
  container.parentElement.insertBefore(editForm, container.parentElement.childNodes[index + 1]);

  // Moves the cursor to the end of the text after focus
  editTextarea.focus();
  editTextarea.setSelectionRange(editTextarea.value.length, editTextarea.value.length);
}

async function EditSubmitButtonEventListener(e, id, text) {
  e.preventDefault();

  try {
    await fetch(`http://localhost:3000/messages/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ text }),
    });
    
    window.location.href = './index.html';

  } catch (err) {
    console.error('Failed to PATCH message');
  }
}

(async function loadGeneralChat() {
  try {
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

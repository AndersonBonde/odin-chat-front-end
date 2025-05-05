let oldMessageContainer = undefined;

function removeEditForm(editForm) {
  if (oldMessageContainer) {
    oldMessageContainer.style.display = 'block';
    oldMessageContainer = undefined;
  }

  editForm.parentElement.removeChild(editForm);
}

function updateOldMessage(newText) {
  const editForm = document.getElementById('edit-form');

  oldMessageContainer.innerText = newText;
  removeEditForm(editForm);
}

// Event listener to allow users to edit their messages
function editMessageTextEventListener(e, container) {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem('user'));
  const existingEditForm = document.getElementById('edit-form');
  const author = container.dataset.author;
  const id = container.dataset.id;
  const oldText = container.innerText;

  if (!user || author != user.email) return;

  if (existingEditForm) {
    removeEditForm(existingEditForm);
  }

  // Create form
  const editForm = document.createElement('form');
  editForm.id = 'edit-form';
  editForm.setAttribute('autocomplete', 'off');

  const editTextarea = document.createElement('input');
  editTextarea.setAttribute('type', 'text');
  editTextarea.setAttribute('autocomplete', 'off');
  editTextarea.id = 'edit-textarea';
  editTextarea.value = oldText;

  const editSubmitButton = document.createElement(`button`);
  editSubmitButton.setAttribute('type', 'submit');
  editSubmitButton.id = 'edit-submit-button';
  editSubmitButton.textContent = '➤';
  
  editForm.addEventListener('submit', (e) =>  SubmitEventListener(e, id, editTextarea.value));
  editForm.appendChild(editTextarea);
  editForm.appendChild(editSubmitButton);

  // Hide old container and display the editForm
  container.style.display = 'none';
  oldMessageContainer = container;
  container.insertAdjacentElement('afterend', editForm);

  // Moves the cursor to the end of the text after focus
  editTextarea.focus();
  editTextarea.setSelectionRange(editTextarea.value.length, editTextarea.value.length);

  // Cancel edit from pressing esc
  editForm.addEventListener('keydown', (e) => {
    if (e.key === 'Escape')
      removeEditForm(editForm);
  });
}

async function SubmitEventListener(e, id, text) {
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
    
    updateOldMessage(text);

  } catch (err) {
    console.error('Failed to PATCH message');
  }
}

module.exports = {
  editMessageTextEventListener,
}

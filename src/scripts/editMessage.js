let activeEditForm = null;
let activeMessageContainer = null;

function removeEditForm() {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleEscapeKey);

  if (activeMessageContainer) {
    activeMessageContainer.style.display = 'block';
    activeMessageContainer = null;
  }

  if (activeEditForm) {
    activeEditForm.remove();
    activeEditForm = null;
  }
}

function updateOldMessage(newText) {
  activeMessageContainer.innerText = newText;
}

function handleClickOutside(e) {
  if (
    activeEditForm &&
    !activeEditForm.contains(e.target)
  ) {
    removeEditForm();
  }
}

function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    removeEditForm();
  }
}

// Event listener to allow users to edit their messages
function editMessageTextEventListener(e, container) {
  e.preventDefault();

  const id = container.dataset.id;
  const oldText = container.innerText;

  if (activeEditForm) {
    removeEditForm();
  }

  // Create form
  const editForm = document.createElement('form');
  editForm.id = 'edit-form';
  editForm.setAttribute('autocomplete', 'off');
  activeEditForm = editForm;

  const editTextarea = document.createElement('input');
  editTextarea.setAttribute('type', 'text');
  editTextarea.setAttribute('autocomplete', 'off');
  editTextarea.id = 'edit-textarea';
  editTextarea.value = oldText;

  const editSubmitButton = document.createElement(`button`);
  editSubmitButton.setAttribute('type', 'submit');
  editSubmitButton.id = 'edit-submit-button';
  editSubmitButton.textContent = 'Edit';
  
  editForm.addEventListener('submit', (e) =>  SubmitEventListener(e, id, editTextarea.value));
  editForm.appendChild(editTextarea);
  editForm.appendChild(editSubmitButton);

  // Hide old container and display the editForm
  container.style.display = 'none';
  container.insertAdjacentElement('afterend', editForm);
  activeMessageContainer = container;

  // Moves the cursor to the end of the text after focus
  editTextarea.focus();
  editTextarea.setSelectionRange(editTextarea.value.length, editTextarea.value.length);

  // Attach listeners to close on esc and outside click
  document.addEventListener('keydown', handleEscapeKey);
  document.addEventListener('click', handleClickOutside);
}

async function SubmitEventListener(e, id, text) {
  e.preventDefault();

  try {
    const token = localStorage.getItem('token');

    await fetch(`http://localhost:3000/messages/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ text }),
    });
    
    updateOldMessage(text);
    removeEditForm();

  } catch (err) {
    console.error('Failed to PATCH message');
  }
}

module.exports = {
  editMessageTextEventListener,
  removeEditForm,
}

let activeEditForm = null;
let activeMessageContainer = null;

function removeEditForm() {
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

// Event listener to allow users to edit their messages
function editMessageTextEventListener(e, container) {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem('user'));
  const author = container.dataset.author;
  const id = container.dataset.id;
  const oldText = container.innerText;

  if (!user || author != user.email) return;

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

  // Cancel edit from pressing esc
  editForm.addEventListener('keydown', (e) => {
    if (e.key === 'Escape')
      removeEditForm();
  });

  // Dismiss editForm on outside click
  function handleClickOutside(e) {
    if (
      activeEditForm &&
      !activeEditForm.contains(e.target)
    ) {
      removeEditForm();
      document.removeEventListener('click', handleClickOutside);
    }
  }

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

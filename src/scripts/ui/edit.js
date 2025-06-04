let activeEditForm = null;
let activeMessageContainer = null;

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

function moveCursorToEnd(area) {
  area.focus();
  area.setSelectionRange(area.value.length, area.value.length);  
}

function hideOldContainerAndDisplayNewForm(container, form) {
  container.style.display = 'none';
  container.insertAdjacentElement('afterend', form);
  activeMessageContainer = container;
}

function createEditForm(oldText) {
  if (activeEditForm) removeEditForm();

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
  
  editForm.append(editTextarea, editSubmitButton);

  // Attach listeners to close on esc and outside click
  document.addEventListener('keydown', handleEscapeKey);
  document.addEventListener('click', handleClickOutside);

  return { form: editForm, textArea: editTextarea };
}

module.exports = {
  createEditForm,
  hideOldContainerAndDisplayNewForm,
  updateOldMessage,
  removeEditForm,
  moveCursorToEnd,
};

const { 
  deleteMessageFromDOM 
} = require('../ui/chat');
const {
  createEditForm,
  removeEditForm,
  hideOldContainerAndDisplayNewForm,
  updateOldMessage,
  moveCursorToEnd,
} = require('../ui/edit');
const {
  deleteMessageWithId,
  editMessageWithId,
} = require('../api');

async function handleClickDeleteButton(e, id) {
  e.preventDefault();

  const confirmed = window.confirm('Are you sure you want to delete this message?');

  if (confirmed) {
    const { success } = await deleteMessageWithId(id);

    if (success) {
      deleteMessageFromDOM(id);
    }
  }
}

async function handleClickEditButton(e, container) {
  e.preventDefault();

  const id = container.dataset.id;
  const oldText = container.innerText;

  const { form, textArea } = createEditForm(oldText);
  hideOldContainerAndDisplayNewForm(container, form);
  moveCursorToEnd(textArea);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const { success } = await editMessageWithId(id, textArea.value);
    
    if (success) {
      updateOldMessage(textArea.value);
      removeEditForm();
    }
  });
}

module.exports = {
  handleClickDeleteButton,
  handleClickEditButton,

}

const { deleteMessageWithId } = require('./api');

async function deleteMessageEventListener(e, id) {
  e.preventDefault();

  const confirmed = window.confirm('Are you sure you want to delete this message?');
  
  if (confirmed) {
    const { success } = await deleteMessageWithId(id);

    if (success) {
      const messageContainer = document.querySelector(`.message-text[data-id="${id}"]`);
      const length = messageContainer.parentElement.children.length;
  
      // Delete the whole message-card if it contains only one message-text, else the single message
      if (messageContainer) {
        if (length <= 2) {
          messageContainer.parentElement.remove();
        } else {
          messageContainer.remove();
        }
      } 
    }
  }
}

module.exports = {
  deleteMessageEventListener,
}

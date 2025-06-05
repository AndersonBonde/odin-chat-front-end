function deleteMessageFromDOM(id) {
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

module.exports = {
  deleteMessageFromDOM,  
}
async function deleteMessageEventListener(e, id) {
  e.preventDefault();

  const confirmed = window.confirm('Are you sure you want to delete this message?');
  if (confirmed) {
    try {
      const token = localStorage.getItem('token');
  
      const res = await fetch(`http://localhost:3000/messages/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      });
  
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
  
    } catch (err) {
      console.error(`Failed to DELETE message with id: ${id}`);
    }
  }
}

module.exports = {
  deleteMessageEventListener,
}

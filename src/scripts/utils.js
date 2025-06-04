function setTokenExpiration(days) {
  const ms = Date.now() + days * 24 * 60 * 60 * 1000;

  localStorage.setItem('expiration', ms);
}

function checkIfTokenIsExpired() {
  const expiration = localStorage.getItem('expiration');

  if (Date.now() > expiration) localStorage.clear();
}

module.exports = {
  setTokenExpiration,
  checkIfTokenIsExpired,
}

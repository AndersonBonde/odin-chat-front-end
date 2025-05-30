function setTokenExpiration(days) {
  const ms = Date.now() + days * 24 * 60 * 60 * 1000;

  localStorage.setItem('expiration', ms);
}

function checkIfTokenIsExpired() {
  const expiration = localStorage.getItem('expiration');

  return Date.now() > expiration;
}

module.exports = {
  setTokenExpiration,
  checkIfTokenIsExpired,
}

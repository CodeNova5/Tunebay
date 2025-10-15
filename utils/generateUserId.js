// utils/generateUserId.js
export function getOrCreateUserId() {
  let userId = localStorage.getItem("user_id");

  if (!userId) {
    userId = generateUniqueId(20);
    localStorage.setItem("user_id", userId);
  }

  return userId;
}

function generateUniqueId(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

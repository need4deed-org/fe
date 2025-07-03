const keyToken = "backend-token";

export function setToken(token: string) {
  window.localStorage.setItem(keyToken, token);
}

export function getToken() {
  return window.localStorage.getItem(keyToken);
}

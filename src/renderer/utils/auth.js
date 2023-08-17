const TokenKey = 'Admin-Token'

export async function getToken() {
  return await window.intel_configs.get(TokenKey)
}

export function setToken(token) {
     window.intel_configs.save(TokenKey)
}

export function removeToken() {
  //to do
}
const TokenKey = 'user_info'

export async function getToken() {
  const defaultConfig = await window.intel_configs.get(TokenKey)
  if (defaultConfig!=null) {
    const existedUserInfoConfig = JSON.parse(defaultConfig)
    return  existedUserInfoConfig.accessToken
  }
   return null
}

export function setToken(token) {
     window.intel_configs.save(TokenKey)
}

export function removeToken() {
  //to do
}
import jwt from 'jsonwebtoken';

const STORAGE_KEYS = {
  token: 'state.auth.token',
  user: 'state.auth.user'
}

export const clearStorage = () => {
  localStorage.removeItem(STORAGE_KEYS.token)
  sessionStorage.removeItem(STORAGE_KEYS.user)
}

export const storeToken = (token) => {
  try {
    localStorage.setItem(STORAGE_KEYS.token, JSON.stringify(token))
  } catch (err) { return }
}

export const storeUser = (user) => {
  try {
    sessionStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
  } catch (err) { return }
}

export const restoreToken = () => {
  try {
    const token = JSON.parse(localStorage.getItem(STORAGE_KEYS.token)) || undefined
    return token
  } catch (err) { return undefined }
}

export const restoreUser = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.user)) || undefined
    return user
  } catch (err) { return undefined }
}

export const validate = (token) => {
  if (!token) return false 

  let expirationTime = get(token, "exp") * 1000 // PHP timestamp is in s
  let timeNow = (new Date).getTime() //JS timestamp is in ms

  if (expirationTime > timeNow) {
    // Si le token expire plus tard que maintenant
    return true
  }

  return false
}

export const get = (token, key) => {
  let payload = decodeToken(token)
  if (payload) return payload[key]
  return false
}

const decodeToken = (token) => {
  let decodedToken = jwt.decode(token, { complete: true })
  if (decodedToken) return decodedToken.payload
  return false
}
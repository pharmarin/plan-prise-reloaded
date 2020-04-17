import jwt from 'jsonwebtoken';

export const storeToken = (token) => {
  try {
    localStorage.setItem('state.auth.token', JSON.stringify(token))
  } catch (err) { return }
}

export const storeUser = (user) => {
  try {
    sessionStorage.setItem('state.auth.user', JSON.stringify(user))
  } catch (err) { return }
}

export const restoreToken = () => {
  try {
    const token = JSON.parse(localStorage.getItem('state.auth.token')) || undefined
    return token
  } catch (err) { return undefined }
}

export const restoreUser = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem('state.auth.user')) || undefined
    return user
  } catch (err) { return undefined }
}

export const isValid = (token) => {
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
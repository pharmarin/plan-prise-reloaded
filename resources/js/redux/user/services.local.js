import jwt from 'jsonwebtoken';

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
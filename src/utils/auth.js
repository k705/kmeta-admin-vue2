import Cookies from 'js-cookie'

const TokenKey = 'accessToken'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setAvatar(avatar) {
  return Cookies.set("avatar", avatar)
}

export function getAvatar() {
  return Cookies.get("avatar")
}
export function removeAvatar() {
  return Cookies.remove("avatar")
}

export function setAccessedRoutes(accessedRoutes) {
  return Cookies.set("accessedRoutes", accessedRoutes)
}

export function getAccessedRoutes() {
  return Cookies.get("accessedRoutes")
}

export function removeAccessedRoutes() {
  return Cookies.remove('accessedRoutes')
}


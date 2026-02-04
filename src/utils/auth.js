const LOGIN_KEY = 'isLogin'

// 登入狀態以local storage爲準
export function isLoggedIn () {
  return localStorage.getItem(LOGIN_KEY) === 'true'
}

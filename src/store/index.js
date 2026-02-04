import Vue from 'vue'
import Vuex from 'vuex'

// 導入 plugin(持久化)
import persistPlugin from './plugins/persist'

// 導入products | orders 模塊
import products from './modules/products'
import orders from './modules/orders'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登入狀態（localstorage 登入狀態保存）
    isLogin: localStorage.getItem('isLogin') === 'true',
    // 管理員賬號
    adminAccount: [
      { id: 1, name: 'emma1', password: '123' },
      { id: 2, name: 'emma2', password: '123' }
    ],
    // 目前登入的管理員（暫存）
    user: JSON.parse(localStorage.getItem('user')) || null,
    // 模擬會員資料
    members: [
      { id: 1, name: 'jack', email: 'test1@gmail.co' },
      { id: 2, name: 'rose', email: 'test2@gmail.co' },
      { id: 3, name: 'alice', email: 'test3@gmail.co' }
    ]
  },
  getters: {
  },
  mutations: {
    // 同步登入狀態
    LOGIN (state, user) {
      state.isLogin = true
      state.user = user
      localStorage.setItem('isLogin', 'true')
      localStorage.setItem('user', JSON.stringify(user))
    },
    // 同步登出狀態
    LOGOUT (state) {
      state.isLogin = false
      state.user = null
      // 舊的：清除 登錄的localStorage
      // localStorage.clear()

      // 只清除登入資訊，不清共享資料
      localStorage.removeItem('isLogin')
      localStorage.removeItem('user')
    }
  },
  actions: {
    // 模擬非同步登入
    login ({ commit }, user) {
      commit('LOGIN', user)
    },
    // 模擬非同步登出
    logout ({ commit }, user) {
      commit('LOGOUT', user)
    }
  },
  modules: {
    // 注冊product模組
    products,
    orders
  },
  plugins: [persistPlugin()]
})

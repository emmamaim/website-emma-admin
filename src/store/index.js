import Vue from 'vue'
import Vuex from 'vuex'

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
    // 用戶（暫時）
    user: JSON.parse(localStorage.getItem('user')) || null,
    // 商品詳情
    products: [
      { id: 1, name: '嬰兒推車', price: 6800, status: '上架' },
      { id: 2, name: '奶瓶', price: 1200, status: '上架' },
      { id: 3, name: '奶嘴', price: 500, status: '上架' }
    ],
    // 模擬會員資料
    members: [
      { id: 1, name: 'jack', email: 'test1@gmail.co' },
      { id: 2, name: 'rose', email: 'test2@gmail.co' },
      { id: 3, name: 'alice', email: 'test3@gmail.co' }
    ],
    // 模擬訂單資料
    orders: [
      { id: 101, member: 'jack', total: 7200, status: '已付款' },
      { id: 102, member: 'rose', total: 2000, status: '待出貨' },
      { id: 103, member: 'alice', total: 10990, status: '已付款' }
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
      // 清除 登錄的localStorage
      localStorage.clear()
    },
    // 增加商品
    ADD_PRODUCT (state, product) {
      state.products.push(product)
    },
    // 移除商品
    REMOVE_PRODUCT (state, id) {
      state.products = state.products.filter(p => p.id !== id)
    },
    // 更新編輯商品
    UPDATE_PRODUCT (state, payload) {
      const target = state.products.find(p => p.id === payload.id)
      if (!target) return

      // 只更新傳進來的欄位
      if (payload.price !== undefined) target.price = payload.price
      if (payload.status !== undefined) target.status = payload.status
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
    },
    // 增加商品
    addProduct ({ commit }, product) {
      const newProduct = {
        id: Date.now(),
        name: product.name,
        price: product.price,
        status: '上架'
      }
      commit('ADD_PRODUCT', newProduct)
    },
    // 移除商品
    removeProduct ({ commit }, id) {
      commit('REMOVE_PRODUCT', id)
    },
    // 更新商品
    updateProduct ({ commit }, payload) {
      commit('UPDATE_PRODUCT', payload)
    }
  },
  modules: {
  }
})

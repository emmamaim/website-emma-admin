const state = {
  // 默認商品列表
  products: [
    { id: 1, name: '嬰兒推車', price: 6800, status: '上架' },
    { id: 2, name: '奶瓶', price: 1200, status: '上架' },
    { id: 3, name: '奶嘴', price: 500, status: '上架' }
  ]
}

const mutations = {
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
}

const actions = {
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
}
const getters = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

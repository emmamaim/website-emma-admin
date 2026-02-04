const state = {
  orders: [
    { id: 101, member: 'jack', total: 7200, status: '已付款', date: '2026-01-12' },
    { id: 102, member: 'rose', total: 2000, status: '待出貨', date: '2026-01-18' },
    { id: 103, member: 'alice', total: 10990, status: '已付款', date: '2026-01-25' }
  ]
}

const mutations = {
  // 替換商品（本地儲存備份）
  REPLACE_PRODUCTS (state, orders) {
    state.orders = orders
  },
  UPDATE_ORDER_STATUS (state, payload) {
    const target = state.orders.find(o => o.id === payload.id)
    if (!target) return
    target.status = payload.status
  }
}

const actions = {
  updateOrderStatus ({ commit }, payload) {
    commit('UPDATE_ORDER_STATUS', payload)
  }
}

const getters = {
  allStatuses () {
    return ['待付款', '已付款', '待出貨', '已完成', '已取消']
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

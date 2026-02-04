// 新增vuex plugin 持久化
// 啓動時讀取localstorage->回灌
// 後續每次mutation->存回去
const KEY = 'emma_admin_persist_v1'

export default function persistPlugin () {
  return store => {
    // 1.初始化 localstorage->vuex
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '{}')
      if (saved.products && Array.isArray(saved.products)) {
        store.commit('products/REPLACE_PRODUCTS', saved.products)
      }
      if (saved.orders && Array.isArray(saved.orders)) {
        store.commit('orders/REPLACE_PRODUCTS', saved.orders)
      }
    } catch (e) {
      // 解析失敗就忽略
    }
    // 2.vuex變動 => localstorage
    store.subscribe((mutation, state) => {
      if (!state.isLogin) return
      const dataToSave = {
        products: state.products.products,
        orders: state.orders.orders
      }
      localStorage.setItem(KEY, JSON.stringify(dataToSave))
    })
  }
}

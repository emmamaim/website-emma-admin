<template>
  <div class="container mt-4">
    <h3>商品管理</h3>

    <!-- 新增商品 -->
    <div class="card p-3 mb-4">
      <input
        v-model="newProduct.name"
        class="form-control mb-2"
        placeholder="商品名稱"
      >
      <input
        v-model.number="newProduct.price"
        class="form-control mb-2"
        placeholder="價格"
      >
      <button class="btn btn-success" @click="addProduct">
        新增商品
      </button>
    </div>

    <!-- 編輯商品（點設置才會出現） -->
    <div v-if="editingProduct" class="card p-3 mb-4">
      <h5 class="mb-3">編輯商品：{{ editingProduct.name }}</h5>

      <div class="mb-2">
        <label class="form-label">價格</label>
        <input
          v-model.number="editingForm.price"
          type="number"
          class="form-control"
          placeholder="價格"
        >
      </div>

      <div class="mb-3">
        <label class="form-label">狀態</label>
        <select v-model="editingForm.status" class="form-select">
          <option value="上架">上架</option>
          <option value="下架">下架</option>
        </select>
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-primary" @click="saveEdit">保存</button>
        <button class="btn btn-outline-secondary" @click="cancelEdit">取消</button>
      </div>
    </div>

    <!-- 商品列表 -->
    <table class="table table-bordered align-middle">
      <thead>
        <tr>
          <th>名稱</th>
          <th>價格</th>
          <th>狀態</th>
          <th style="width: 180px;">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.price }}</td>
          <td>
            <span
              class="badge"
              :class="item.status === '上架' ? 'bg-success' : 'bg-secondary'"
            >
              {{ item.status }}
            </span>
          </td>
          <td class="d-flex gap-2">
            <button class="btn btn-outline-primary btn-sm" @click="openEdit(item)">
              編輯
            </button>
            <button class="btn btn-danger btn-sm" @click="remove(item.id)">
              刪除
            </button>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
export default {
  name: 'ProductsDetails',

  data () {
    return {
      newProduct: { name: '', price: '' },

      // 目前正在編輯的商品（用來顯示標題/判斷是否開啟編輯區）
      editingProduct: null,

      // 編輯表單（用來綁定 input/select）
      editingForm: {
        price: 0,
        status: '上架'
      }
    }
  },

  computed: {
    products () {
      return this.$store.state.products
    }
  },

  methods: {
    // 新增商品
    addProduct () {
      if (!this.newProduct.name || !this.newProduct.price) return
      this.$store.dispatch('addProduct', this.newProduct)
      this.newProduct = { name: '', price: '' }
    },

    // 移除商品
    remove (id) {
      // 如果刪到正在編輯的那筆，順便關掉編輯面板
      if (this.editingProduct && this.editingProduct.id === id) {
        this.cancelEdit()
      }
      this.$store.dispatch('removeProduct', id)
    },

    // 打開編輯面板
    openEdit (item) {
      this.editingProduct = item
      // 用拷貝，避免直接改到列表（要按保存才更新）
      this.editingForm = {
        price: item.price,
        status: item.status
      }
    },

    // 保存編輯
    saveEdit () {
      if (!this.editingProduct) return

      // 基本驗證
      if (this.editingForm.price === '' || this.editingForm.price === null) return

      this.$store.dispatch('updateProduct', {
        id: this.editingProduct.id,
        price: this.editingForm.price,
        status: this.editingForm.status
      })

      this.cancelEdit()
    },

    // 取消編輯
    cancelEdit () {
      this.editingProduct = null
      this.editingForm = { price: 0, status: '上架' }
    }
  }
}
</script>

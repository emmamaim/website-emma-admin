<template>
  <div class="container mt-5" style="max-width:400px;">
    <h2 class="mb-4 text-center">Admin Login</h2>

    <input
      type="text"
      class="form-control mb-2"
      placeholder="帳號"
      v-model="account"
    >

    <input
      type="password"
      class="form-control mb-2"
      placeholder="密碼"
      v-model="password"
    >

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <button class="btn btn-primary w-100" @click="handleLogin">
      登入
    </button>
  </div>
</template>

<script>
export default {
  name: 'LoginView',

  data () {
    return {
      account: '',
      password: '',
      error: ''
    }
  },

  methods: {
    async handleLogin () {
      // 排空檢查
      if (!this.account || !this.password) {
        this.error = '請輸入帳號與密碼'
        return
      }

      // 從store取出管理員賬號
      const admins = this.$store.state.adminAccount

      // 匹配管理員賬號
      const admin = admins.find(a => a.name === this.account)

      // 帳號不存在
      if (!admin) {
        this.error = '帳號不存在'
        return
      }

      // 密碼錯誤
      if (admin.password !== this.password) {
        this.error = '密碼錯誤'
        return
      }

      // 模擬登入成功(新增：登入后載入該賬號的持久化資料)
      this.$store.dispatch('login', {
        id: admin.id,
        name: admin.name
      })

      // 跳轉到後台
      this.$router.replace('/')
    }
  }
}
</script>

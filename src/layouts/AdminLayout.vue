<template>
  <div class="admin-layout">
    <!-- Header -->
    <nav class="navbar navbar-dark bg-dark px-3">
      <span class="navbar-brand mb-0 h1">EMMA Admin</span>

      <div>
        <span class="text-light me-3" v-if="user">
          {{ user.name }} 歡迎您！
        </span>

        <button class="btn btn-outline-light btn-sm" @click="logout">
          登出
        </button>
      </div>
    </nav>

    <!-- Main -->
    <div class="d-flex" style="min-height: calc(100vh - 56px);">
      <AppSidebar />

      <main class="flex-fill p-4 bg-light">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import AppSidebar from '@/components/common/AppSidebar.vue'

export default {
  name: 'AdminLayout',
  components: {
    AppSidebar
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  }
}
</script>

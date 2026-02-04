<template>
  <div class="bg-light p-3" style="width: 200px">
    <ul class="nav flex-column">
      <li class="nav-item">
        <router-link :to="{ name: 'DashboardDetails' }" class="nav-link">
          總覽
        </router-link>
      </li>
      <li class="nav-item">
        <router-link :to="{ name: 'ProductsDetails' }" class="nav-link">
          商品管理
        </router-link>
      </li>
      <li class="nav-item">
        <router-link :to="{ name: 'MembersDetails' }" class="nav-link">
          會員管理
        </router-link>
      </li>
      <li class="nav-item">
        <router-link :to="{ name: 'OrdersView' }" class="nav-link">
          訂單管理
        </router-link>
      </li>
      <li class="nav-item">
        <router-link :to="{ name: 'NewsDetails' }" class="nav-link">
          最新消息
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {}
</script>

<style>
</style>

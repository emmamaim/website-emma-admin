<template>
  <div class="ord">
    <h3 class="mb-4">訂單管理</h3>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>訂單編號</th>
                <th>會員</th>
                <th>金額</th>
                <th>狀態</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="o in orders" :key="o.id">
                <td>{{ o.id }}</td>
                <td>{{ o.member }}</td>
                <td>{{ o.total }}</td>
                <td>{{ o.status }}</td>
            </tr>
        </tbody>
    </table>
  </div>
</template>

<script>
export default {
  computed: {
    orders () {
      return this.$store.state.orders
    }
  }
}
</script>

<style>

</style>

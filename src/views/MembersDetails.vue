<template>
  <div class="">
    <h3 class="mb-4">
        會員列表
    </h3>
    <table class="table table-striped">
        <thead>
            <tr>
                <th>姓名</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody v-for="m in members" :key="m.id">
            <tr>
                <td>{{ m.name }}</td>
                <td>{{ m.email }}</td>
            </tr>
        </tbody>
    </table>
  </div>
</template>

<script>
export default {
  computed: {
    members () {
      return this.$store.state.members
    }
  }
}
</script>

<style>

</style>

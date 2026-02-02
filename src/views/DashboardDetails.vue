<template>
  <div class="dash">
    <h3 class="mb-4">後臺總覽</h3>
    <div class="row">
      <div class="col-md-4" v-for="card in cards" :key="card.title">
        <div class="card text-center mb-4">
          <div class="card-body">
            <h5 class="card-title"> {{ card.title }}</h5>
            <h2> {{ card.value }} </h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardDetails',
  computed: {
    cards () {
      return [
        { title: '商品數量', value: this.$store.state.products.length },
        { title: '上架商品', value: this.$store.state.products.filter(p => p.status === '上架').length },
        { title: '管理員', value: this.$store.state.user ? 1 : 0 }
      ]
    }
  }
}
</script>

<style>

</style>

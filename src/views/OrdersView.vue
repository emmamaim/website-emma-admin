<template>
  <div class="ord container mt-4">
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
      <h3 class="mb-0">訂單管理</h3>

      <!-- 篩選/排序控制列 -->
      <div class="d-flex flex-wrap gap-2">
        <!-- 狀態篩選 -->
        <select v-model="statusFilter" class="form-select form-select-sm" style="width: 140px;">
          <option value="ALL">全部狀態</option>
          <option v-for="s in allStatuses" :key="s" :value="s">{{ s }}</option>
        </select>

        <!-- 日期區間 -->
        <select v-model="dateRange" class="form-select form-select-sm" style="width: 160px;">
          <option value="ALL">全部日期</option>
          <option value="7">最近 7 天</option>
          <option value="30">最近 30 天</option>
          <option value="CUSTOM">自訂日期</option>
        </select>

        <!-- 自訂日期 -->
        <div v-if="dateRange === 'CUSTOM'" class="d-flex gap-2">
          <input v-model="dateFrom" type="date" class="form-control form-control-sm" />
          <input v-model="dateTo" type="date" class="form-control form-control-sm" />
        </div>

        <!-- 排序 -->
        <select v-model="sortKey" class="form-select form-select-sm" style="width: 160px;">
          <option value="DATE_DESC">日期：新 → 舊</option>
          <option value="DATE_ASC">日期：舊 → 新</option>
          <option value="TOTAL_DESC">金額：高 → 低</option>
          <option value="TOTAL_ASC">金額：低 → 高</option>
        </select>
      </div>
    </div>

    <table class="table table-bordered align-middle">
      <thead class="text-center">
        <tr>
          <th style="width: 110px;">訂單編號</th>
          <th style="width: 140px;">會員</th>
          <th style="width: 140px;">日期</th>
          <th style="width: 120px;">金額</th>
          <th style="width: 150px;">狀態</th>
          <th style="width: 200px;">操作</th>
        </tr>
      </thead>

      <tbody class="text-center">
        <tr v-for="o in displayOrders" :key="o.id">
          <td>{{ o.id }}</td>
          <td>{{ o.member }}</td>
          <td>{{ formatDate(o.date) }}</td>
          <td>{{ o.total }}</td>

          <!-- 狀態 badge -->
          <td>
            <span class="badge" :class="statusBadgeClass(o.status)">
              {{ o.status }}
            </span>
          </td>

          <!-- 狀態流轉操作 -->
          <td>
            <div class="d-flex flex-wrap gap-2">
              <!-- 下一步（依規則流轉） -->
              <button
                class="btn btn-outline-primary btn-sm"
                :disabled="!nextStatus(o.status)"
                @click="setStatus(o.id, nextStatus(o.status))"
              >
                下一步
              </button>

              <!-- 狀態下拉（允許的狀態） -->
              <select
                class="form-select form-select-sm"
                style="width: 140px;"
                :value="o.status"
                @change="onSelectChange(o.id, $event)"
              >
                <option v-for="s in allowedStatuses(o.status)" :key="s" :value="s">
                  {{ s }}
                </option>
              </select>
            </div>

            <small class="text-muted d-block mt-1">
              規則：待付款→已付款→待出貨→已完成（可隨時改為已取消）
            </small>
          </td>
        </tr>

        <tr v-if="displayOrders.length === 0">
          <td colspan="6" class="text-center text-muted py-4">
            沒有符合條件的訂單
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'OrdersView',

  data () {
    return {
      statusFilter: 'ALL',
      dateRange: 'ALL',
      dateFrom: '',
      dateTo: '',
      sortKey: 'DATE_DESC'
    }
  },

  computed: {
    orders () {
      return this.$store.state.orders.orders || []
    },
    allStatuses () {
      return this.$store.getters['orders/allStatuses']
    },

    // 篩選 + 日期區間 + 排序後的列表
    displayOrders () {
      let list = this.orders.slice()

      // 1) 狀態篩選
      if (this.statusFilter !== 'ALL') {
        list = list.filter(o => o.status === this.statusFilter)
      }

      // 2) 日期區間
      const now = new Date()
      if (this.dateRange === '7') {
        const from = new Date(now)
        from.setDate(now.getDate() - 7)
        list = list.filter(o => new Date(o.date) >= from && new Date(o.date) <= now)
      } else if (this.dateRange === '30') {
        const from = new Date(now)
        from.setDate(now.getDate() - 30)
        list = list.filter(o => new Date(o.date) >= from && new Date(o.date) <= now)
      } else if (this.dateRange === 'CUSTOM') {
        // 自訂日期（若沒填就不限制）
        const from = this.dateFrom ? new Date(this.dateFrom) : null
        const to = this.dateTo ? new Date(this.dateTo) : null

        list = list.filter(o => {
          const d = new Date(o.date)
          if (from && d < from) return false
          if (to) {
            // to 當天結束（包含當天）
            const toEnd = new Date(to)
            toEnd.setHours(23, 59, 59, 999)
            if (d > toEnd) return false
          }
          return true
        })
      }

      // 3) 排序
      if (this.sortKey === 'DATE_DESC') {
        list.sort((a, b) => new Date(b.date) - new Date(a.date))
      } else if (this.sortKey === 'DATE_ASC') {
        list.sort((a, b) => new Date(a.date) - new Date(b.date))
      } else if (this.sortKey === 'TOTAL_DESC') {
        list.sort((a, b) => b.total - a.total)
      } else if (this.sortKey === 'TOTAL_ASC') {
        list.sort((a, b) => a.total - b.total)
      }

      return list
    }
  },

  methods: {
    // ---- 日期顯示 ----
    formatDate (s) {
      if (!s) return '—'
      return String(s).replaceAll('-', '.')
    },

    // ---- 狀態顯示 ----
    statusBadgeClass (status) {
      if (status === '待付款') return 'bg-warning text-dark'
      if (status === '已付款') return 'bg-info text-dark'
      if (status === '待出貨') return 'bg-primary'
      if (status === '已完成') return 'bg-success'
      return 'bg-secondary' // 已取消
    },

    // ---- 狀態流轉規則 ----
    nextStatus (current) {
      const flow = ['待付款', '已付款', '待出貨', '已完成']
      const idx = flow.indexOf(current)
      if (idx === -1) return null
      return flow[idx + 1] || null
    },

    // 允許切換的狀態：下一步 + 已取消（任何狀態都能取消）
    allowedStatuses (current) {
      const next = this.nextStatus(current)
      const opts = [current]
      if (next) opts.push(next)
      if (current !== '已取消') opts.push('已取消')
      return opts
    },

    onSelectChange (id, e) {
      const newStatus = e.target.value
      this.setStatus(id, newStatus)
    },

    setStatus (id, status) {
      // 透過 Vuex action 更新
      this.$store.dispatch('orders/updateOrderStatus', { id, status })
    }
  }
}
</script>

<style>

</style>

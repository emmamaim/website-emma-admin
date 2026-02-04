<template>
  <div class="container-fluid py-4">
    <div
      class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3"
    >
      <h3 class="mb-0">最新消息（Axios + Mock API）</h3>

      <div class="d-flex gap-2" style="max-width: 560px; width: 100%">
        <input
          v-model.trim="q"
          class="form-control"
          placeholder="搜尋標題/內容"
          @keyup.enter="loadList(1)"
        />
        <button class="btn btn-primary" @click="loadList(1)">搜尋</button>
        <button class="btn btn-outline-secondary" @click="reset">重置</button>
      </div>
    </div>

    <!-- 状态 -->
    <div v-if="loadingList" class="alert alert-info">載入列表中…</div>
    <div v-else-if="errorList" class="alert alert-danger">{{ errorList }}</div>

    <div class="row g-3" v-if="!loadingList">
      <!-- 左：列表 -->
      <div class="col-12 col-lg-5">
        <div class="card">
          <div
            class="card-header d-flex justify-content-between align-items-center"
          >
            <div class="fw-semibold">消息列表</div>
            <small class="text-muted">第 {{ page }} 頁</small>
          </div>

          <div v-if="items.length" class="list-group list-group-flush">
            <button
              v-for="it in items"
              :key="it.id"
              type="button"
              class="list-group-item list-group-item-action"
              :class="{ active: selectedId === it.id }"
              @click="loadDetail(it.id)"
            >
              <div class="d-flex justify-content-between align-items-start">
                <div class="me-2">
                  <div class="fw-semibold text-truncate">{{ it.title }}</div>
                  <div class="small opacity-75 mt-1">
                    {{ formatDate(it.date) }}
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div v-else class="p-3 text-muted">沒有資料</div>

          <div
            class="card-footer d-flex justify-content-between align-items-center"
          >
            <button
              class="btn btn-outline-secondary btn-sm"
              :disabled="page <= 1"
              @click="loadList(page - 1)"
            >
              上一頁
            </button>

            <small class="text-muted">共 {{ total }} 篇 | 第 {{ page }} 頁</small>

            <button
              class="btn btn-outline-secondary btn-sm"
              :disabled="!hasNext"
              @click="loadList(page + 1)"
            >
              下一頁
            </button>
          </div>
        </div>
      </div>

      <!-- 右：详情 -->
      <div class="col-12 col-lg-7">
        <div class="card h-100">
          <div class="card-header">
            <div class="fw-semibold">內容</div>
          </div>

          <div class="card-body">
            <div v-if="loadingDetail" class="alert alert-info mb-0">
              載入內容中…
            </div>
            <div v-else-if="errorDetail" class="alert alert-danger mb-0">
              {{ errorDetail }}
            </div>

            <div v-else-if="detail">
              <h4 class="mb-2">{{ detail.title }}</h4>
              <div class="text-muted small mb-3">
                {{ formatDate(detail.date) }}
              </div>
              <p style="line-height: 1.9; white-space: pre-wrap">
                {{ detail.content }}
              </p>
            </div>

            <div v-else class="text-muted">請從左側選擇一則消息查看內容。</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'NewsDetails',

  data () {
    return {
      baseURL: 'http://localhost:3001',

      q: '',
      page: 1,
      limit: 5,

      // 原始資料（全部）
      allNews: [],

      // 當前頁
      items: [],
      total: 0,
      hasNext: false,

      selectedId: null,
      detail: null,

      loadingList: false,
      errorList: '',

      // 若展示二次請求的話，改 true
      useDetailRequest: false,
      loadingDetail: false,
      errorDetail: ''
    }
  },

  created () {
    this.loadList(1)
  },

  methods: {
    async loadList (p) {
      this.page = p
      this.loadingList = true
      this.errorList = ''

      // 不在這裡清空 detail，避免 UI 閃爍
      this.errorDetail = ''

      try {
        // 只打一個接口，拿全部（數量少時最適合）
        const resp = await axios.get(`${this.baseURL}/news`)
        const data = Array.isArray(resp.data) ? resp.data : []

        // 前端排序：新 → 舊（desc）
        const sorted = data
          .slice()
          .sort((a, b) => new Date(b.date) - new Date(a.date))
        this.allNews = sorted

        // 前端搜尋（標題/內容）
        const keyword = (this.q || '').toLowerCase()
        const filtered = keyword
          ? sorted.filter(n =>
            (n.title && n.title.toLowerCase().includes(keyword)) ||
            (n.content && n.content.toLowerCase().includes(keyword))
          )
          : sorted

        // 前端分頁
        this.total = filtered.length
        const start = (this.page - 1) * this.limit
        const end = start + this.limit
        this.items = filtered.slice(start, end)
        this.hasNext = end < this.total

        // 預設選第一篇
        if (this.items.length) {
          await this.loadDetail(this.items[0].id)
        } else {
          this.selectedId = null
          this.detail = null
        }
      } catch (e) {
        this.errorList = e?.message || '載入列表失敗'
      } finally {
        this.loadingList = false
      }
    },

    async loadDetail (id) {
      this.selectedId = id
      this.loadingDetail = true
      this.errorDetail = ''
      this.detail = null

      try {
        if (this.useDetailRequest) {
          // 可選：展示第二次 axios 請求
          const resp = await axios.get(`${this.baseURL}/news/${id}`)
          this.detail = resp.data
        } else {
          // 不打第二次請求：直接從 allNews/items 找
          const found =
            this.items.find(n => n.id === id) ||
            this.allNews.find(n => n.id === id)

          // 若沒存 allNews，就直接在 items 取
          this.detail = found || null

          // 若要存 allNews，把 loadList 裡加一行：
          // this.allNews = sorted
        }
      } catch (e) {
        this.errorDetail = e?.message || '載入內容失敗'
      } finally {
        this.loadingDetail = false
      }
    },

    // 搜尋按鈕用
    search () {
      this.loadList(1)
    },

    reset () {
      this.q = ''
      this.loadList(1)
    },

    formatDate (s) {
      if (!s) return '—'
      return s.replaceAll('-', '.')
    }
  }
}
</script>

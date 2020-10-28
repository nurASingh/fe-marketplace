<template>
<div>
  <h2>API Settings</h2>
  <div class="row border-bottom pb-4 mb-5">
    <div class="col-2">STACKS_API</div>
    <div class="col-4">{{stacksApi}}</div>
    <div class="col-2">SEARCH_API</div>
    <div class="col-4">{{searchApi}}</div>
    <div class="col-2">mac</div>
    <div class="col-4">{{mac}}</div>
  </div>
</div>
</template>

<script>
const STACKS_API = process.env.VUE_APP_API_STACKS
const mac = JSON.parse(process.env.VUE_APP_WALLET_MAC || '')
const SEARCH_API = process.env.VUE_APP_API_SEARCH

export default {
  name: 'ApiSettings',
  components: {
  },
  data () {
    return {
      mac: mac,
      searchApi: SEARCH_API,
      stacksApi: STACKS_API
    }
  },
  methods: {
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>

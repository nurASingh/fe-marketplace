<template>
<div>
  <h2>API Settings</h2>
  <div class="row border-bottom pb-4 mb-5">
    <div class="col-3">STACKS_API</div>
    <div class="col-8">{{stacksApi}}</div>
    <div class="col-3">SEARCH_API</div>
    <div class="col-8">{{searchApi}}</div>
    <div class="col-3">mac</div>
    <div class="col-8">{{mac.keyInfo.address}}</div>
    <div class="col-3">Rates</div>
    <div class="col-8"><a href="#" @click.prevent="fetchRates">fetch rates</a></div>
    <div class="col-3">Invoices</div>
    <div class="col-8"><a href="#" @click.prevent="loadInvoice">load</a></div>
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
      stacksApi: STACKS_API,
      result: null
    }
  },
  methods: {
    fetchRates: function () {
      this.$store.dispatch('fetchRatesFromBinance')
    },
    loadInvoice: function () {
      this.$store.dispatch('paymentStore/fetchPayment').then((result) => {
        this.result = result
      })
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>

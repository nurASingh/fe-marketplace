<template>
<div class="row">
  <side-menu class="col-3 mr-0 pr-0 pt-5"/>
  <div class="col-9 pt-5 admin-app">
    <title-bar class="container" v-on="$listeners"/>
    <div class="container" @click="$emit('toggle-off-navbar')">
      <h2>API Settings</h2>
      <div class="row border-bottom pb-4 mb-5">
        <div class="col-2">STACKS_API</div>
        <div class="col-4">{{stacksApi}}</div>
        <div class="col-2">SEARCH_API</div>
        <div class="col-4">{{searchApi}}</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import SideMenu from '@/components/admin/SideMenu'
import TitleBar from '@/components/admin/TitleBar'

const STACKS_API = process.env.VUE_APP_API_STACKS
const mac = JSON.parse(process.env.VUE_APP_WALLET_MAC || '')
const SEARCH_API = process.env.VUE_APP_API_SEARCH

export default {
  name: 'SystemSettings',
  components: {
    SideMenu,
    TitleBar
  },
  data () {
    return {
      showNavbar: false,
      projectOption: 0,
      meshApi: STACKS_API,
      mac: mac,
      searchApi: SEARCH_API,
      stacksApi: STACKS_API
    }
  },
  mounted () {
    this.loading = false
    this.$store.dispatch('projectStore/fetchProjects')
  },
  methods: {
    editProject (contractName) {
      console.log(contractName)
    }
  },
  computed: {
  }
}
</script>
<style lang="scss">
@import "@/assets/scss/custom.scss";
</style>

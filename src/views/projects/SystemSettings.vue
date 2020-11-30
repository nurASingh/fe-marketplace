<template>
<div class="row">
  <side-menu class="col-3 mr-0 pr-0 pt-5"/>
  <div class="col-9 pt-5 admin-app">
    <title-bar title="For Developers" class="container" v-on="$listeners"/>
    <div class="container" @click="$emit('toggle-off-navbar')">
      <p class="text-40-300">System Settings</p>
    <b-tabs
      nav-class="font-weight-bold text-uppercase text-info"
      nav-wrapper-class="font-weight-bold text-uppercase bg-info text-info"
      active-nav-item-class="font-weight-bold text-uppercase text-info"
      active-tab-class=""
      content-class="mt-3 px-3 pt-5"
      >
      <b-tab title="App Registry" active>
        <app-registry/>
      </b-tab>
      <b-tab title="Diagnostics">
        <clarity-assets />
      </b-tab>
      <b-tab title="API Settings">
        <api-settings/>
      </b-tab>
      <b-tab title="Searching">
        <search-settings/>
      </b-tab>
      <b-tab title="Indexing">
        <index-settings/>
      </b-tab>
    </b-tabs>
    </div>
  </div>
</div>
</template>

<script>
import SideMenu from '@/components/admin/SideMenu'
import TitleBar from '@/components/admin/TitleBar'
import AppRegistry from '@/components/admin/system/AppRegistry'
import ApiSettings from '@/components/admin/system/ApiSettings'
import SearchSettings from '@/components/admin/system/SearchSettings'
import IndexSettings from '@/components/admin/system/IndexSettings'
import ClarityAssets from '@/components/admin/system/ClarityAssets'

export default {
  name: 'SystemSettings',
  components: {
    SideMenu,
    TitleBar,
    AppRegistry,
    SearchSettings,
    IndexSettings,
    ClarityAssets,
    ApiSettings
  },
  data () {
    return {
      showNavbar: false
    }
  },
  mounted () {
    this.loading = false
    this.$store.dispatch('projectStore/fetchMyProjects')
  },
  methods: {
  },
  computed: {
  }
}
</script>
<style lang="scss">
</style>

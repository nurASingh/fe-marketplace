<template>
<div class="row">
  <side-menu class="col-3 mr-0 pr-0 pt-5"/>
  <div class="col-9 pt-5 admin-app" @click="$emit('toggle-off-navbar')">
    <title-bar class="container mt-3" v-on="$listeners"/>
    <b-tabs content-class="text-dark">
      <b-tab class="container mt-3" title="API Settings" active>
        <api-settings/>
      </b-tab>
      <b-tab class="container mt-3" title="Contract" >
        <upload-contract-form :project="project"/>
      </b-tab>
      <b-tab class="container mt-3" title="Search Settings">
        <search-settings/>
      </b-tab>
    </b-tabs>
  </div>
</div>
</template>

<script>
import SideMenu from '@/components/admin/SideMenu'
import TitleBar from '@/components/admin/TitleBar'
import UploadContractForm from '@/components/admin/UploadContractForm'
import ApiSettings from '@/components/admin/system/ApiSettings'
import SearchSettings from '@/components/admin/system/SearchSettings'

export default {
  name: 'SystemSettings',
  components: {
    SideMenu,
    TitleBar,
    UploadContractForm,
    SearchSettings,
    ApiSettings
  },
  data () {
    return {
      showNavbar: false,
      project: {
        projectId: 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW.replacewithfilename'
      }
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
<style lang="scss" >
@import "@/assets/scss/custom.scss";
.nav-link {
    color: #000 !important;
}
</style>

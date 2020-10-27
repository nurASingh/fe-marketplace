<template>
<div class="row">
  <side-menu class="col-3 mr-0 pr-0 pt-5"/>
  <div class="col-9 pt-5 admin-app" v-if="loaded">
    <title-bar class="container" v-on="$listeners"/>
    <div class="container" @click="$emit('toggle-off-navbar')">
      <div class="row">
        <div class="col-12">
          <h1>Upload Contract</h1>
          <p style="font-size: 10px;">Contract id: {{projectId}} <router-link class="mr-3" :to="'/connect-app/' + projectId"><b-icon icon="pencil"/></router-link></p>
            <upload-contract-form :project="project"/>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import UploadContractForm from '@/components/admin/UploadContractForm'
import SideMenu from '@/components/admin/SideMenu'
import TitleBar from '@/components/admin/TitleBar'

export default {
  name: 'UploadContract',
  components: {
    UploadContractForm,
    SideMenu,
    TitleBar
  },
  data () {
    return {
      loaded: false,
      project: null
    }
  },
  mounted () {
    this.projectId = this.$route.params.projectId
    this.$store.dispatch('projectStore/findProjectByProjectId', this.projectId).then((project) => {
      if (!project) {
        this.$router.push('/404')
        return
      }
      this.project = project
      this.loaded = true
    })
  },
  methods: {
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>

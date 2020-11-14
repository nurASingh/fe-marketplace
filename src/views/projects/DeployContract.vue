<template>
<div class="row">
  <side-menu class="col-3 mr-0 pr-0 pt-5"/>
  <div class="col-9 pt-5 admin-app" v-if="loaded">
    <title-bar title="For Developers" class="container" v-on="$listeners"/>
    <div class="container" @click="$emit('toggle-off-navbar')">
      <div class="row">
        <div class="col-12">
          <p class="text-40-300">Upload Contract</p>
          <p style="font-size: 10px;">Contract id: {{projectId}} <router-link class="mr-3" :to="'/connect-app/' + projectId"><b-icon icon="pencil"/></router-link></p>
            <deploy-contract-from-file :project="project" @deployed="deployed"/>
        </div>
      </div>
    </div>
  </div>
  <b-modal scrollable id="modal-1" title="Contract Deployed">
    <div class="row" v-if="deployedProject">
      <div class="col-12 my-1">
        <div class="mb-3">Deployed {{deployedProject.projectId}}</div>
        <div class="mb-3">Tx: {{deployedProject.txId}}</div>
      </div>
    </div>
  </b-modal>
</div>
</template>

<script>
import DeployContractFromFile from '@/components/admin/DeployContractFromFile'
import SideMenu from '@/components/admin/SideMenu'
import TitleBar from '@/components/admin/TitleBar'

export default {
  name: 'DeployContract',
  components: {
    DeployContractFromFile,
    SideMenu,
    TitleBar
  },
  data () {
    return {
      loaded: false,
      deployedProject: null,
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
    deployed: function (data) {
      this.deployedProject = data.project
      this.$bvModal.show('modal-1')
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>

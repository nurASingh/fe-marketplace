<template>
<div v-if="!loading">
  <h1 class="mb-4">Application Registry</h1>
  <div v-if="appmapCounter > -1">
    <div v-if="appmapCounter === 0">
      No applications registered!
    </div>
    <div v-else>
      <div v-for="(appl, idx) in appmapApps" :key="idx" class="mb-4 pb-4 border-bottom">
        <div>Owner: <span>{{appl.owner}}</span></div>
        <div>Contract: <span>{{appl.contractId}}</span></div>
        <div>Base Token URI: <span>{{appl.baseTokenUri}}</span></div>
      </div>
    </div>
  </div>
  <div v-else>
      <div class="col-md-12">
        <b-form>
          <div class="mb-2">
            <div class="mb-2">Contract Id <a href="#" @click.prevent="useMyAddress()">(use my address)</a></div>
            <b-input
              id="projectId"
              ref="projectId"
              v-model="project.projectId"
              class="mt-3"></b-input>
          </div>
          <div class="mb-2" v-if="valid() && project">
            <deploy-contract-from-file :project="project" @deployed="deployed"/>
          </div>
        </b-form>
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
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'AppRegistry',
  components: {
    DeployContractFromFile
  },
  data () {
    return {
      project: {
        projectId: 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW.replacewithfilename'
      },
      deployedProject: null,
      loading: false
    }
  },
  methods: {
    valid: function () {
      return this.project.projectId.indexOf('replace') === -1 &&
        this.project.projectId.split('.').length === 2 &&
        this.project.projectId.split('.')[1].length > 2
    },
    deployed: function (data) {
      this.deployedProject = data.project
      this.$bvModal.show('modal-1')
      this.$store.dispatch('applicationStore/lookupApplications')
    },
    useMyAddress: function () {
      const contractAddress = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].stxAddress
      if (!this.project.projectId) {
        this.project.projectId = contractAddress + '.'
      } else if (this.project.projectId.indexOf('.') > -1) {
        const contractName = this.project.projectId.split('.')[1]
        if (contractName) {
          this.project.projectId = contractAddress + '.' + contractName
        }
      } else {
        this.project.projectId = contractAddress + this.project.projectId
      }
    }
  },
  computed: {
    appmapCounter () {
      const appmapCounter = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP_COUNTER]
      return appmapCounter
    },
    appmapApps () {
      const appmap = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP]
      if (appmap) return appmap.apps
      return []
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

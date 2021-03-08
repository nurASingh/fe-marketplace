<template>
<div v-if="!loading">
  <h1 class="mb-4">Application Registry</h1>
  <div v-if="appmapCounter > -1">
    <div v-if="appmapCounter === 0">
      No applications registered!
    </div>
    <div v-else>
      <div v-for="(appl, idx) in appmapApps" :key="idx" class="mb-4 pb-4 border-bottom">
        <div class="row">
          <div class="col-4">
            <img :src="appl.imageUrl" width="100%"/>
          </div>
          <div class="col-8">
            <div>Owner: <span>{{appl.owner}}</span></div>
            <div>Contract: <span>{{appl.contractId}}</span></div>
            <div>Base Token URI: <span>{{appl.baseTokenUri}}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
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
</div>
</template>

<script>
import DeployContractFromFile from '@/components/admin/DeployContractFromFile'
import { APP_CONSTANTS } from '@/app-constants'

const mac = JSON.parse(process.env.VUE_APP_WALLET_MAC || '')

export default {
  name: 'AppRegistry',
  components: {
    DeployContractFromFile
  },
  data () {
    return {
      project: {
        projectId: mac.keyInfo.address + '.replacewithfilename'
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
      this.$root.$emit('bv::show::modal', 'success-modal')
      this.$store.commit('setModalMessage', 'Contract deployment transaction sent to Stacks blockchain - check explorer for progress.')
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

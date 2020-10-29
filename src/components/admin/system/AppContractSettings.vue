<template>
<div v-if="!loading">
  <h2>API Settings</h2>
  <div class="row border-bottom pb-4 mb-5" v-if="appmapTxId">
    {{appmapTxId}}
  </div>
  <div class="row border-bottom pb-4 mb-5" v-else>
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
            <deploy-contract-from-file :project="project"/>
          </div>
        </b-form>
      </div>
  </div>
</div>
</template>

<script>
import DeployContractFromFile from '@/components/admin/DeployContractFromFile'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'AppContractSettings',
  components: {
    DeployContractFromFile
  },
  data () {
    return {
      project: {
        projectId: 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW.replacewithfilename'
      },
      loading: false
    }
  },
  methods: {
    valid: function () {
      return this.project.projectId.indexOf('replace') === -1 &&
        this.project.projectId.split('.').length === 2 &&
        this.project.projectId.split('.')[1].length > 2
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
    appmapTxId () {
      const appmapTxId = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP_TX_ID]
      return appmapTxId
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

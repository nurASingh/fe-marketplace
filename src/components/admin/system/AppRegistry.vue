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

    <div class="upload-preview bg-info text-warning text-small text-bold  my-5 p-4" v-if="appMapContract">
      <div class="row border-bottom mb-3 pb-2">
        <div class="col-12"><h3>All Contract Data</h3></div>
        <div class="col-2">administrator</div><div class="col-10">{{appMapContract.administrator}}</div>
        <div class="col-2">appCounter</div><div class="col-10">{{appMapContract.appCounter}}</div>
      </div>
      <div class="row border-bottom mb-3 pb-2" v-for="(application, index) in appMapContract.applications" :key="index">
        <div class="col-2">Contract Id</div><div class="col-10">{{application.contractId}}</div>
        <div class="col-2">App-Index</div><div class="col-10">{{application.appIndex}}</div>
        <div class="col-2">Storage</div><div class="col-10">{{application.storageModel}}</div>
        <div class="col-2">Status</div><div class="col-10">{{application.status}}</div>
          <div class="row ml-3 p-3" v-if="application.tokenContract">
            <div class="col-2">Token</div><div class="col-10 text-bold">{{application.tokenContract.tokenSymbol}} - {{application.tokenContract.tokenName}}</div>
            <div class="col-2">Base URL</div><div class="col-10">{{application.tokenContract.baseTokenUri}}</div>
            <div class="col-2">administrator</div><div class="col-10">{{application.tokenContract.administrator}}</div>
            <div class="col-2">Platform</div><div class="col-10">{{application.tokenContract.platformFee}}</div>
            <div class="col-2">Minted</div><div class="col-10">{{application.tokenContract.mintCounter}}</div>
            <div class="row text-danger ml-4 mt-3 border-bottom mb-3 pb-2" v-for="(token, index) in application.tokenContract.tokens" :key="index">
              <div class="col-2">NFT</div><div class="col-10">#<a href="#" class="text-small text-info" @click.prevent="loadToken(application.contractId, token.nftIndex)">{{token.nftIndex}}</a></div>
              <div class="col-2">TokenInfo</div><div class="col-10"><a href="#" class="text-small text-info" @click.prevent="loadToken(application.contractId, token.nftIndex, token.tokenInfo['asset-hash'].valueHex)">{{token.tokenInfo['asset-hash'].valueHex}}</a></div>
              <div class="col-2">Owner</div><div class="col-10">{{token.owner}}</div>
              <div class="col-2">Offers</div><div class="col-10">{{token.offers}}</div>
              <div class="col-2">SaleData</div><div class="col-10">Type={{token.saleData['sale-type'].value}}, Opening/Guide Amount {{token.saleData['amount-stx'].value}}</div>
              <div class="col-2">Max Eds.</div><div class="col-10">{{token.tokenInfo['max-editions'].value}}</div>
              <div class="col-2">Eds.</div><div class="col-10">{{token.tokenInfo['edition'].value}}</div>
              <div class="col-2">Block-height</div><div class="col-10">{{token.tokenInfo['date'].value}}</div>
              <div class="col-2">Original</div><div class="col-10">{{token.tokenInfo['series-original'].value}}</div>
            </div>
          </div>
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
    appMapContract () {
      const appMapContract = this.$store.getters[APP_CONSTANTS.KEY_APP_RPAY_REGISTRY]
      return appMapContract
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
.upload-preview {
  padding: 10px;
  height: auto;
  border: 0pt dashed rgb(146, 146, 38);
  background-color: #FCFCFC 0% 0% no-repeat padding-box;
  box-shadow: 0px 6px 9px #00000029;
  border-radius: 6px;
  font-size: 1.2rem;
  font-weight: bold;
}
</style>

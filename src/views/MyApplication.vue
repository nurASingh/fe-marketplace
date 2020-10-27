<template>
<div v-if="loaded">
  <div class="row mb-5">
    <side-menu class="col-3 mr-0 pr-0 pt-5"/>
    <div class="col-9 pt-5">
      <title-bar class="container" v-on="$listeners"/>
      <div class="container" @click="$emit('toggle-off-navbar')">
        <div class="pl-4">
          <p class="text-light">My Application</p>
          <div class="row my-5">
            <div class="col-4">
              <img width="250px" height="250px" :src="project.imageUrl"/>
            </div>
            <div class="col-8">
              <p>App Name: {{project.title}}</p>
              <p>Contract Id: <br/><span style="font-size: 12px;">{{project.projectId}}</span></p>
              <p>Owner: {{project.owner}}</p>
              <p>Description: {{project.description}}</p>
              <p>
                <a href="#" class="mr-3" @click="openApp(project)">edit</a>
              </p>
            </div>
          </div>
          <div class="text-light" v-if="contractData">Explorer: <a :href="'https://testnet-explorer.blockstack.org/txid/' + project.projectId" target="_blank">{{project.projectId}}</a></div>
          <div v-else>
            <div class="mb-5">
              <h2>Deploy a contract</h2>
              <h4>Contract Id: <br/>{{project.projectId}}</h4>
              <p>Click 'I need a contract' to customise a smart contract template and deploy to the Stacks blockchain.
                If you have a contract which conforms to the interface click 'I have a contract'.</p>
              <b-button :to="'/upload-contract/' + project.projectId" variant="info" class="mt-3 mr-3 btn-lg" style="text-transform: capitalize; font-size: 14px;">I Have a Contract</b-button>
              <b-button :to="'/customise-contract/' + project.projectId" variant="warning" class="mt-3 btn-lg" style="text-transform: capitalize; font-size: 14px;">I Need a Contract</b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <b-modal scrollable id="contract-modal" title="Looking for contract">
    <div class="row">
      <div class="col-12 my-1">
        <p>If you've deployed your contract using <a href="https://testnet-explorer.blockstack.org/" target="_blank">explorer</a> check it has the correct contract Id.
        You can edit the contract id on the <router-link :to="'/connect-app/' + project.projectId">in project details</router-link></p>
      </div>
      <div class="col-12 my-1">
        <p>Looking for contract: {{projectId}}</p>
      </div>
    </div>
  </b-modal>
</div>
</template>

<script>
import SideMenu from '@/components/admin/SideMenu'
import TitleBar from '@/components/admin/TitleBar'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ConnectApplication',
  components: {
    SideMenu,
    TitleBar
  },
  data () {
    return {
      loading: true,
      useDefaultLogo: false,
      projectId: null,
      loaded: false,
      dims: { width: 250, height: 250 },
      project: {
        imageUrl: require('@/assets/img/Group 15980.svg'),
        mintPrice: '',
        title: '',
        description: ''
      }
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
      this.lookupContract()
      this.loaded = true
    })
  },
  methods: {
    lookupContract: function () {
      this.$store.dispatch('stacksStore/lookupContractInterface', this.projectId).then((contract) => {
        this.contract = contract.interface
      }).catch(() => {
        // this.$notify({ type: 'error', title: 'Error', text: error })
      })
    },
    connectContract () {
      this.lookupContract()
      this.$bvModal.show('contract-modal')
    },
    openApp (project) {
      if (project.projectId) {
        this.$router.push('/connect-app/' + project.projectId)
      } else {
        // this.$notify({ type: 'error', title: 'Project', text: 'Unable to open project - no project id.' })
      }
    }
  },
  computed: {
    contractData () {
      const contractData = this.$store.getters[APP_CONSTANTS.KEY_CONTRACT_DATA](this.projectId)
      return contractData
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

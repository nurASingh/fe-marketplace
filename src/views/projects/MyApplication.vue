<template>
<div>
  <div class="row mb-5">
    <side-menu class="col-3 mr-0 pr-0 pt-5"/>
    <div class="col-9 pt-5">
      <title-bar title="For Developers" class="container" v-on="$listeners"/>
      <div class="container" @click="$emit('toggle-off-navbar')">
        <p class="text-17-500">Your Application</p>
        <b-card no-body class="overflow-hidden" >
          <b-row no-gutters>
            <b-col md="4">
              <b-card-img :src="project.imageUrl" alt="Image" class="rounded-0"></b-card-img>
            </b-col>
            <b-col md="8">
              <b-card-body class="ml-4">
                <div class="d-flex justify-content-between">
                  <p class="text-30-500">{{project.title}}</p>
                  <router-link :to="'/connect-app/' + project.projectId"><b-icon icon="pencil"/></router-link>
                </div>
                <b-card-text>
                  <div class="mb-2 contract-id">{{project.projectId}}</div>
                  <p class="mb-2 text1">{{project.owner}}</p>
                  <p class="mb-2 text1">{{project.gaiaFilename}}</p>
                  <p class="mb-2 text1">{{project.description}}</p>
                  <div v-if="contractInterface">
                    <div class="mb-2 text1"><span>Contract found on the <a class="text-info" :href="openContractUrl()" target="_blank">Stacks Blockchain</a>  <a href="#" @click="showContractData = !showContractData">show contract</a></span></div>
                    <div class="mb-2 text1" v-if="appmapProject">
                      Application is registered with the marketplace (#{{appmapProject.appCounter}})
                      <div v-if="appmapProject.status === 0" class="mb-2 text1">
                         <a href="#" @click.prevent="disableApplication(1)">disable</a>
                      </div>
                      <div v-else-if="appmapProject.status === 1" class="mb-2 text1">
                         <a href="#" @click.prevent="disableApplication(0)">enable</a>
                      </div>
                    </div>
                    <div class="mt-4 mb-2 text1" v-else>
                      <b-button @click.prevent="connectApp()" variant="info">Connect App to Marketplace</b-button>
                    </div>
                    <div v-if="showContractData">
                      <pre class="source-code">{{project.codeBody}}</pre>
                    </div>
                  </div>
                  <div class="mt-4 mb-2 text1" v-else>
                    <b-button @click.prevent="deleteApp(project)" class="text-info" variant="outline-info">Delete Application</b-button>
                  </div>
                </b-card-text>
              </b-card-body>
            </b-col>
          </b-row>
        </b-card>
        <div class="w-75 mt-4 text-light">
          <div v-if="contractInterface">
          </div>
          <div class="my-4" v-else>
            <div>
              <p class="text-12-700">Deploy a contract</p>
              <p class="text2">Click 'I need a contract' to customise a smart contract template and deploy to the Stacks blockchain.
                If you have a contract which conforms to the interface click 'I have a contract'.</p>
              <b-button class="mr-3" :to="'/upload-contract/' + project.projectId" variant="info">I Have a Contract</b-button>
              <b-button :to="'/customise-contract/' + project.projectId" variant="outline-info" class="text-info">I Need a Contract</b-button>
            </div>
          </div>
          <div class="text-light" v-if="appmapProject">
            <div>{{appmapProject.baseTokenUri}}</div>
            <div v-for="(asset, index) in appmapProject.assets" :key="index">
              <pre>Owner: {{asset.owner}}</pre>
              <pre>Asset hash: {{asset.assetHash}}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import SideMenu from '@/components/admin/SideMenu'
import TitleBar from '@/components/admin/TitleBar'
import { APP_CONSTANTS } from '@/app-constants'
import {
  intCV,
  bufferCV
} from '@stacks/transactions'

const STACKS_API = process.env.VUE_APP_API_STACKS

export default {
  name: 'MyApplication',
  components: {
    SideMenu,
    TitleBar
  },
  data () {
    return {
      loading: true,
      result: null,
      useDefaultLogo: false,
      projectId: null,
      loaded: false,
      dims: { width: 250, height: 250 },
      showContractData: false
    }
  },
  mounted () {
    this.projectId = this.$route.params.projectId
    // this.$store.dispatch('stacksStore/fetchMacSkyWalletInfo')
    this.$store.dispatch('applicationStore/lookupApplications')
    /**
    this.$store.dispatch('projectStore/findProjectByProjectId', this.projectId).then((project) => {
      this.project = project
      this.lookupContract()
      this.loaded = true
    })
    **/
  },
  methods: {
    deleteApp (project) {
      this.$store.dispatch('projectStore/deleteProject', project.projectId).then(() => {
        this.$router.push('/my-apps')
      })
    },
    connectApp: function () {
      const project = this.$store.getters[APP_CONSTANTS.KEY_MY_PROJECT](this.projectId)
      const appmapContractId = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP_CONTRACT_ID]
      const owner = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].username
      const functionArgs = [bufferCV(Buffer.from(owner)), bufferCV(Buffer.from(project.gaiaFilename)), bufferCV(Buffer.from(this.projectId)), intCV(0)]
      const data = {
        contractAddress: appmapContractId.split('.')[0],
        contractName: appmapContractId.split('.')[1],
        functionName: 'register-app',
        functionArgs: functionArgs,
        eventCode: 'connect-application'
      }
      this.connectApplication(data) // $emit('updateEventCode', data)
    },
    connectApplication (data) {
      const walletMode = this.$store.getters[APP_CONSTANTS.KEY_WALLET_MODE]
      const method = (walletMode === 'risidio') ? 'stacksStore/callContractRisidio' : 'stacksStore/callContractBlockstack'
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      this.$store.dispatch(method, data).then((result) => {
        this.result = result
        this.$root.$emit('bv::hide::modal', 'waiting-modal')
        this.$root.$emit('bv::show::modal', 'success-modal')
        this.$store.commit('setModalMessage', 'Application is now connected to the Stacks blockchain.')
      }).catch(() => {
        data.action = 'inc-nonce'
        this.$store.commit('setModalMessage', 'Incrementing nonce and trying again.')
        this.$store.dispatch(method, data).then((result) => {
          this.result = result
          this.$root.$emit('bv::hide::modal', 'waiting-modal')
          this.$root.$emit('bv::show::modal', 'success-modal')
          this.$store.commit('setModalMessage', 'Application is now connected to the Stacks blockchain.')
        }).catch((error) => {
          this.result = error
          this.$store.commit('setModalMessage', 'Error occurred processing transaction.')
        })
      })
    },
    disableApplication (status) {
      const project = this.$store.getters[APP_CONSTANTS.KEY_MY_PROJECT](this.projectId)
      const appmapContractId = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP_CONTRACT_ID]
      const owner = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].username
      const functionArgs = [bufferCV(Buffer.from(owner)), bufferCV(Buffer.from(project.gaiaFilename)), bufferCV(Buffer.from(this.projectId)), intCV(0), intCV(status)]
      const data = {
        contractAddress: appmapContractId.split('.')[0],
        contractName: appmapContractId.split('.')[1],
        functionName: 'set-app-status',
        functionArgs: functionArgs,
        eventCode: 'disable-application'
      }
      const walletMode = this.$store.getters[APP_CONSTANTS.KEY_WALLET_MODE]
      const method = (walletMode === 'risidio') ? 'stacksStore/callContractRisidio' : 'stacksStore/callContractBlockstack'
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      this.$store.dispatch(method, data).then((result) => {
        this.result = result
        this.$root.$emit('bv::hide::modal', 'waiting-modal')
        this.$root.$emit('bv::show::modal', 'success-modal')
        this.$store.commit('setModalMessage', 'Application is now connected to the Stacks blockchain.')
      }).catch((error) => {
        this.result = error
        this.$store.commit('setModalMessage', 'Error occurred processing transaction.')
      })
    },
    openContractUrl () {
      if (this.projectId) {
        return STACKS_API + '/v2/contracts/source/' + this.projectId.split('.')[0] + '/' + this.projectId.split('.')[1] + '?proof=0'
      }
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
    project () {
      let project = this.$store.getters[APP_CONSTANTS.KEY_MY_PROJECT](this.projectId)
      if (!project) {
        project = {
          imageUrl: require('@/assets/img/risidio_collection_logo.svg'),
          mintPrice: '',
          title: '',
          description: ''
        }
      }
      return project
    },
    appmapProject () {
      const appmap = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP_PROJECT](this.projectId)
      return appmap
    },
    contractInterface () {
      const contract = this.$store.getters[APP_CONSTANTS.KEY_CONTRACT](this.projectId)
      return contract
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

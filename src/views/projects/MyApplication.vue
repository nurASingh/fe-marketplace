<template>
<div v-if="loaded">
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
                  <p class="mb-2 text1">{{project.description}}</p>
                  <div v-if="application">
                    <div class="mb-2 text1"><span>Contract found on the <a class="text-info" :href="openContractUrl()" target="_blank">Stacks Blockchain</a>  <a href="#" @click="showContractData = !showContractData">show contract</a></span></div>
                    <div class="mb-2 text1">
                      Application is registered with the marketplace (#{{application.appCounter}})
                      <div class="mb-2 text1">App Status: {{application.status}}</div>
                      <div class="mb-2 text1">
                         <a href="#" @click.prevent="updateApp(application.appCounter)">Update Contract Data</a>
                      </div>
                      <div v-if="application.status === 0" class="mb-2 text1">
                         <a href="#" @click.prevent="changeApplicationStatus(1)">disable</a>
                      </div>
                      <div v-else-if="application.status === 1" class="mb-2 text1">
                         <a href="#" @click.prevent="changeApplicationStatus(0)">enable</a>
                      </div>
                    </div>
                    <div v-if="showContractData">
                      <pre class="source-code">{{project.codeBody}}</pre>
                    </div>
                  </div>
                  <div class="mt-4 mb-2 text1" v-else>
                    <div class="mt-4 mb-2 text1" v-if="contractInterface">
                      <b-button @click.prevent="connectApp()" variant="info">Connect App to Marketplace</b-button>
                    </div>
                    <b-button @click.prevent="deleteApp(project)" class="text-info" variant="outline-info">Delete Application</b-button>
                  </div>
                </b-card-text>
              </b-card-body>
            </b-col>
          </b-row>
        </b-card>
        <div class="w-75 mt-4 text-light mt-4">
          <div class="text-light" v-if="application">
            <div>{{application.baseTokenUri}}</div>
            <div v-for="(asset, index) in application.assets" :key="index">
              <pre>Owner: {{asset.owner}}</pre>
              <pre>Asset hash: {{asset.assetHash}}</pre>
            </div>
          </div>
          <div v-else>
            <div v-if="!contractInterface">
              <p class="text-12-700">Deploy a contract</p>
              <p class="text2">Click 'I need a contract' to customise a smart contract template and deploy to the Stacks blockchain.
                If you have a contract which conforms to the interface click 'I have a contract'.</p>
              <b-button class="mr-3" :to="'/upload-contract/' + project.projectId" variant="info">I Have a Contract</b-button>
              <b-button :to="'/customise-contract/' + project.projectId" variant="outline-info" class="text-info">I Need a Contract</b-button>
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
  bufferCV,
  standardPrincipalCV
} from '@stacks/transactions'

const STACKS_API = process.env.VUE_APP_STACKS_API
const REGISTRY_CONTRACT_ADDRESS = process.env.VUE_APP_REGISTRY_CONTRACT_ADDRESS
const REGISTRY_CONTRACT_NAME = process.env.VUE_APP_REGISTRY_CONTRACT_NAME
const NETWORK = process.env.VUE_APP_NETWORK

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
      contractInterface: null,
      showContractData: false
    }
  },
  mounted () {
    this.projectId = this.$route.params.projectId
    this.$store.dispatch('rpayStacksStore/lookupContractInterface', this.projectId).then((data) => {
      this.contractInterface = data
      this.loaded = true
    }).catch(() => {
      this.loaded = true
    })
  },
  methods: {
    deleteApp (project) {
      this.$store.dispatch('projectStore/deleteProject', project.projectId).then(() => {
        this.$router.push('/my-apps')
      })
    },
    updateApp: function (appCounter) {
      const application = this.application
      const owner = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].stxAddress
      const functionArgs = [intCV(appCounter), standardPrincipalCV(owner), bufferCV(Buffer.from(this.projectId)), intCV(0), intCV(application.status)]
      const data = {
        contractAddress: REGISTRY_CONTRACT_ADDRESS,
        contractName: REGISTRY_CONTRACT_NAME,
        functionName: 'update-app',
        functionArgs: functionArgs,
        eventCode: 'connect-application'
      }
      this.connectApplication(data) // $emit('updateEventCode', data)
    },
    connectApp: function () {
      const owner = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].stxAddress
      const functionArgs = [standardPrincipalCV(owner), bufferCV(Buffer.from(this.projectId)), intCV(0)]
      const data = {
        contractAddress: REGISTRY_CONTRACT_ADDRESS,
        contractName: REGISTRY_CONTRACT_NAME,
        functionName: 'register-app',
        functionArgs: functionArgs,
        eventCode: 'connect-application'
      }
      this.connectApplication(data) // $emit('updateEventCode', data)
    },
    connectApplication (data) {
      const method = (NETWORK === 'local') ? 'rpayStacksStore/callContractRisidio' : 'rpayStacksStore/callContractBlockstack'
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
    changeApplicationStatus (status) {
      const application = this.application
      const functionArgs = [intCV(application.appIndex), intCV(status)]
      const data = {
        contractAddress: REGISTRY_CONTRACT_ADDRESS,
        contractName: REGISTRY_CONTRACT_NAME,
        functionName: 'set-app-status',
        functionArgs: functionArgs,
        eventCode: 'disable-application'
      }
      const method = (NETWORK === 'local') ? 'rpayStacksStore/callContractRisidio' : 'rpayStacksStore/callContractBlockstack'
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      this.$store.dispatch(method, data).then((result) => {
        this.result = result
        this.$root.$emit('bv::hide::modal', 'waiting-modal')
        this.$root.$emit('bv::show::modal', 'success-modal')
        this.$store.commit('setModalMessage', 'Application status has been changed to ' + status + ' on the Stacks blockchain.')
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
          imageUrl: require('@/assets/img/risidio_white.png'),
          mintPrice: '',
          title: '',
          description: ''
        }
      }
      return project
    },
    registration () {
      const registry = this.$store.getters[APP_CONSTANTS.KEY_REGISTRY](this.projectId)
      const app = registry.applications.find((o) => o.contractId === this.projectId)
      return app
    },
    application () {
      let application = this.$store.getters[APP_CONSTANTS.KEY_APPLICATION_FROM_REGISTRY_BY_CONTRACT_ID](this.projectId)
      if (!application) {
        const registry = this.$store.getters[APP_CONSTANTS.KEY_REGISTRY]
        if (registry && registry.notAllowed) application = registry.notAllowed.find((o) => o.contractId === this.projectId)
      }
      return application
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
